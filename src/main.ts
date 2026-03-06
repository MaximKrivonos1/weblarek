import './scss/styles.scss';
import { Products } from './components/base/Models/Products';
import { Basket } from './components/base/Models/basket';
import { Buyer } from './components/base/Models/Buyer';
import { LarekApi } from './components/base/LarekApi';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';


const productsModel = new Products();
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getProducts())
console.log('Получение товара по айди: ', productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'))
productsModel.setSelectedProduct(apiProducts.items[1]);
console.log('получение выбранного товара: ', productsModel.getSelectedProduct())

const basketModel = new Basket();
basketModel.addBasket(apiProducts.items[0]);
basketModel.addBasket(apiProducts.items[1]);
console.log('кол-во товаров из корзины', basketModel.getProductsCount())
console.log('массив товаров из корзины', basketModel.getBasket())
console.log('стоимость товаров в корзине: ', basketModel.getCost())
console.log('есть ли товар корзине:', basketModel.isProductInBasketById('854cef69-976d-4c2a-a18c-2aa45046c390'))
basketModel.deleteProduct(apiProducts.items[0])
console.log('массив товаров из корзины', basketModel.getBasket())
basketModel.clearBasket();
console.log('массив товаров из корзины', basketModel.getBasket())

const buyerModel = new Buyer();
buyerModel.setAddress('grrrfd');
buyerModel.setEmail('dfdfd');
buyerModel.setPayment('card');
buyerModel.setPhone('8656565');
console.log('информация о покупателе:', buyerModel.getUserData());
buyerModel.setPhone('');
console.log('проверка корректности заполенения данных пользователя:', buyerModel.isValidUserData());
buyerModel.clearUserData();
console.log('информация о покупателе:', buyerModel.getUserData());

const base = new Api(API_URL);
const apiModel = new LarekApi(base);

apiModel.getProductList().then((response) => productsModel.setProducts(response));
console.log(productsModel);
