import { IBuyer } from "../../../types";

export class Buyer implements IBuyer {
  payment: 'card' | 'cash' | '' = '';
  email: string = '';
  phone: string = '';
  address: string = '';

  constructor() { }

  setPayment(payment: 'card' | 'cash' | ''): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getUserData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clearUserData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = ''
  }

  isValidUserData(): {
    payment?: 'не выбран вид оплаты',
    address?: 'не указан адрес',
    phone?: 'не указан номер телефона',
    email?: 'не указан емеил'
  } {
    const errors: {
      payment?: 'не выбран вид оплаты',
      address?: 'не указан адрес',
      phone?: 'не указан номер телефона',
      email?: 'не указан емеил'
    } = {}
    if (this.payment !== 'card' && this.payment !== 'cash') {
      errors.payment = 'не выбран вид оплаты';
    }
    if (this.email.trim() === '') {
      errors.email = 'не указан емеил';
    }
    if (this.phone.trim() === '') {
      errors.phone = 'не указан номер телефона';
    }
    if (this.address.trim() === '') {
      errors.address = 'не указан адрес';
    }
    return errors
  }
}