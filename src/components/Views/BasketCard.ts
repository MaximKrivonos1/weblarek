import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

type TBasketCard = Pick<IProduct, "title" | "price"> & {
  index: number;
};

export interface IBasketCardActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketCard extends Card<TBasketCard> {
  protected buttonElement: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement, actions?: Partial<IBasketCardActions>) {
    super(container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
