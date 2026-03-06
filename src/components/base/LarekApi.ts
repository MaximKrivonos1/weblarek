import { IApi, IOrderResponse, IProduct, TOrderRequest } from "../../types";

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[]; total: number }>('/product/');
    return response.items;
  }

  async orderProducts(order: TOrderRequest): Promise<IOrderResponse> {
    try {
      const response = await this.api.post<IOrderResponse>('/order', order);
      return response;
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      throw error;
    }
  }
}
