import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

type TBasketCard = Pick<IProduct, "title" | "price"> & {
  index: number;
};

export interface IBasketCardActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketCard extends Card<TBasketCard> {
  protected buttonElement: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("basket:delete");
    });

  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
