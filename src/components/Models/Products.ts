import { IProduct } from "../../types";

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor() { }

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const product = this.products.find((product) => product.id == id);
    return product;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}