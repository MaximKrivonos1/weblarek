import { IBuyer, WrongUserData } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: 'card' | 'cash' | '' = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected events: IEvents) { }

  setPayment(payment: 'card' | 'cash' | ''): void {
    this.payment = payment;
    this.events.emit('buyer:changed');
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('buyer:changed');
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('buyer:changed');
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
    this.address = '';
    this.events.emit('buyer:changed');
  }

  isValidUserData(): WrongUserData {
    const errors: WrongUserData = {}

    if (this.payment !== 'card' && this.payment !== 'cash') {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (this.email.trim() === '') {
      errors.email = 'Не указан email';
    }

    if (this.phone.trim() === '') {
      errors.phone = 'Не указан телефон';
    }

    if (this.address.trim() === '') {
      errors.address = 'Не указан адрес';
    }

    return errors
  }
}
