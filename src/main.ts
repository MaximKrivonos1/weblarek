import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { LarekApi } from "./components/LarekApi";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { BasketCard } from "./components/Views/BasketCard";
import { BasketView } from "./components/Views/BasketView";
import { CatalogCard } from "./components/Views/CatalogCard";
import { ContactsForm } from "./components/Views/ContactsForm";
import { Header } from "./components/Views/Header";
import { Modal } from "./components/Views/Modal";
import { OrderForm } from "./components/Views/OrderForm";
import { PreviewCard } from "./components/Views/PreviewCard";
import { Success } from "./components/Views/Success";
import { IProduct, TOrderRequest, WrongUserData } from "./types";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const base = new Api(API_URL);
const apiModel = new LarekApi(base);

const gallery = ensureElement<HTMLElement>(".gallery");
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const previewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

type TFormStep = "order" | "contacts";

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>(orderTemplate),
  events,
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>(contactsTemplate),
  events,
);
const basketView = new BasketView(
  cloneTemplate<HTMLElement>(basketTemplate),
  events,
);

function formatErrors(errors: WrongUserData): string {
  return Object.values(errors).filter(Boolean).join(", ");
}

function getFormErrors(step: TFormStep): WrongUserData {
  const errors = buyerModel.isValidUserData();

  if (step === "order") {
    return {
      payment: errors.payment,
      address: errors.address,
    };
  }

  return {
    email: errors.email,
    phone: errors.phone,
  };
}

function isFormValid(errors: WrongUserData): boolean {
  return Object.keys(errors).filter((key) => errors[key as keyof WrongUserData])
    .length === 0;
}

function updateHeader(): void {
  header.render({
    counter: basketModel.getProductsCount(),
  });
}

function renderCatalog(): void {
  gallery.replaceChildren(
    ...productsModel.getProducts().map((item) => {
      const card = new CatalogCard(
        cloneTemplate<HTMLButtonElement>("#card-catalog"),
        {
          onClick: () => events.emit("card:select", { productId: item.id }),
        },
      );

      return card.render({
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
      });
    }),
  );
}

function renderBasket(): HTMLElement {
  const basketItems = basketModel.getBasket().map((item, index) => {
    const basketCard = new BasketCard(
      cloneTemplate<HTMLLIElement>(basketCardTemplate), events);

    return basketCard.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    }) as HTMLLIElement;
  });

  return basketView.render({
    content: basketItems,
    total: basketModel.getCost(),
  });
}

function renderOrderForm(): HTMLElement {
  const userData = buyerModel.getUserData();
  const errors = getFormErrors("order");

  return orderForm.render({
    payment: userData.payment,
    address: userData.address,
    valid: isFormValid(errors),
    errors: formatErrors(errors),
  });
}

function renderContactsForm(): HTMLElement {
  const userData = buyerModel.getUserData();
  const errors = getFormErrors("contacts");

  return contactsForm.render({
    email: userData.email,
    phone: userData.phone,
    valid: isFormValid(errors),
    errors: formatErrors(errors),
  });
}

function renderPreview(): HTMLElement | null {
  const product = productsModel.getSelectedProduct();

  if (!product) {
    return null;
  }

  const isInBasket = basketModel.isProductInBasketById(product.id);
  const isAvailable = product.price !== null;
  const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>(previewTemplate),
    events,
  );

  return previewCard.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
    buttonDisabled: !isAvailable,
    buttonText: !isAvailable
      ? "Недоступно"
      : isInBasket
        ? "Удалить из корзины"
        : "Купить",
  });
}

events.on<{ productId: string }>("card:select", ({ productId }) => {
  const product = productsModel.getProductById(productId);

  if (!product) {
    return;
  }

  productsModel.setSelectedProduct(product);
});

events.on("product:selected", () => {
  const preview = renderPreview();

  if (!preview) {
    return;
  }

  modal.render({
    content: preview,
  });
});

events.on("basket-toggle", () => {
  const selectedProduct = productsModel.getSelectedProduct();

  if (!selectedProduct || selectedProduct.price === null) {
    return;
  }

  if (basketModel.isProductInBasketById(selectedProduct.id)) {
    basketModel.deleteProduct(selectedProduct);
  } else {
    basketModel.addBasket(selectedProduct);
  }

  modal.close();
});

events.on<IProduct>("basket:delete", (product) => {
  basketModel.deleteProduct(product);
});

events.on("basket:changed", () => {
  updateHeader();
  renderBasket();
});

events.on("catalog:changed", () => {
  renderCatalog();
});

events.on<{ form: string; field: string; value: string }>(
  "form:change",
  ({ form, field, value }) => {
    if (form === "order") {
      if (
        field === "payment" &&
        (value === "card" || value === "cash" || value === "")
      ) {
        buyerModel.setPayment(value);
      }

      if (field === "address") {
        buyerModel.setAddress(value);
      }
    }

    if (form === "contacts") {
      if (field === "email") {
        buyerModel.setEmail(value);
      }

      if (field === "phone") {
        buyerModel.setPhone(value);
      }
    }
  },
);

events.on("buyer:changed", () => {
  renderOrderForm();
  renderContactsForm();
});

events.on("basket:open", () => {
  modal.render({
    content: basketView.render(),
  });
});

events.on("basket:order", () => {
  modal.render({
    content: renderOrderForm(),
  });
});

events.on("order:submit", () => {
  const errors = getFormErrors("order");

  if (!isFormValid(errors)) {
    return;
  }

  modal.render({
    content: renderContactsForm(),
  });
});

events.on("contacts:submit", async () => {
  const errors = getFormErrors("contacts");

  if (!isFormValid(errors)) {
    return;
  }

  const userData = buyerModel.getUserData();
  const orderData: TOrderRequest = {
    payment: userData.payment === "cash" ? "cash" : "card",
    address: userData.address,
    email: userData.email,
    phone: userData.phone,
    total: basketModel.getCost(),
    items: basketModel.getBasket().map((item) => item.id),
  };

  try {
    const response = await apiModel.orderProducts(orderData);
    events.emit("order:success", { total: response.total });
  } catch (error) {
    contactsForm.render({
      valid: true,
      errors: "Не удалось оформить заказ",
    });
  }
});

events.on<{ total: number }>("order:success", ({ total }) => {
  const success = new Success(
    cloneTemplate<HTMLElement>(successTemplate),
    events,
  );

  basketModel.clearBasket();
  buyerModel.clearUserData();

  modal.render({
    content: success.render({ total }),
  });
});

events.on("success:close", () => {
  modal.close();
});

events.on("modal:close", () => {
  modal.close();
});

productsModel.setProducts(apiProducts.items);
renderBasket();
updateHeader();
renderCatalog();

apiModel
  .getProductList()
  .then((response) => {
    productsModel.setProducts(response);
  })
  .catch((error) => {
    console.error("Ошибка при получении списка товаров:", error);
  });
