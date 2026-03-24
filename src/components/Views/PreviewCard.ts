import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export type TPreviewCard = Pick<IProduct, 'image' | 'category' | 'description'> & {
  buttonText: string;
  buttonDisabled: boolean;
  isInBasket: boolean;
}

export class PreviewCard extends Card<TPreviewCard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected isProductInBasket = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.buttonElement.addEventListener('click', () => {
      this.events.emit(this.isProductInBasket ? 'preview:basket-remove' : 'preview:basket-add');
    });
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}/${value}`, this.titleElement.textContent ?? '');
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap] ?? '');
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  set isInBasket(value: boolean) {
    this.isProductInBasket = value;
  }
}
