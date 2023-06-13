import KlarnaApi from '../../clients/Klarna';
import * as dotenv from 'dotenv';
import Orders from './Orders';
import Payments from './Payments';
import Sessions from './Sessions';

dotenv.config();

export default class KlarnaService {
  private klarna: KlarnaApi;
  private orders: Orders;
  private payments: Payments;
  private sessions: Sessions;

  constructor() {
    this.klarna = new KlarnaApi();
    this.orders = new Orders();
    this.payments = new Payments();
    this.sessions = new Sessions();
  }

  async preAuthPayment(order: any, payment: any) {
    return this.payments.preAuthPayment(order, payment);
  }

  async capturePayment(order: any, payment: any) {
    return this.orders.capturePayment(order, payment);
  }

  async updateSession(order: any, cart: any, cart_params: any) {
    return this.sessions.updateSession(order, cart, cart_params);
  }

  async sessionBody(order: any, cart: any) {
    return this.sessions.sessionBody(order, cart);
  }

  async createSession(session: any) {
    return this.sessions.createSession(session);
  }
}
