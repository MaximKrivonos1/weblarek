import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private productsBasket: IProduct[] = [];

  constructor(protected events: IEvents) { }

  getBasket(): IProduct[] {
    return this.productsBasket;
  }

  addBasket(product: IProduct): void {
    this.productsBasket.push(product);
    this.events.emit('basket:changed');
  }

  deleteProduct(productToDelete: IProduct): void {
    this.productsBasket = this.productsBasket.filter((product) => product.id != productToDelete.id);
    this.events.emit('basket:changed');
  }

  getCost(): number {
    return this.productsBasket.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  clearBasket(): void {
    this.productsBasket = [];
    this.events.emit('basket:changed');
  }

  getProductsCount(): number {
    return this.productsBasket.length;
  }

  isProductInBasketById(id: string): boolean {
    return this.productsBasket.some(product => product.id === id);
  }
}
