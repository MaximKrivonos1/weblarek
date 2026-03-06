import { IProduct } from "../../types";

export class Basket {
  private productsBasket: IProduct[] = [];

  constructor() { }

  getBasket(): IProduct[] {
    return this.productsBasket;
  }

  addBasket(product: IProduct): void {
    this.productsBasket.push(product);
  }

  deleteProduct(productToDelete: IProduct): void {
    this.productsBasket = this.productsBasket.filter((product) => product.id != productToDelete.id);
  }

  getCost(): number {
    return this.productsBasket.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  clearBasket(): void {
    this.productsBasket = [];
  }

  getProductsCount(): number {
    return this.productsBasket.length;
  }

  isProductInBasketById(id: string): boolean {
    return this.productsBasket.some(product => product.id === id);
  }
}