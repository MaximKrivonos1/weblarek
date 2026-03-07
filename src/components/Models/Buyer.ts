import { IBuyer, WrongUserData } from "../../types";

export class Buyer {
  private payment: 'card' | 'cash' | '' = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

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

  isValidUserData(): WrongUserData {
    const errors: WrongUserData = {}
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