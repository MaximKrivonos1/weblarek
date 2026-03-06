export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: 'card' | 'cash' | '';
    email: string;
    phone: string;
    address: string;
}

export type WrongUserData = {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
}

export type TOrderRequest = Pick<IBuyer, 'email' | 'phone' | 'address'> & {
    payment: 'card' | 'cash';
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}