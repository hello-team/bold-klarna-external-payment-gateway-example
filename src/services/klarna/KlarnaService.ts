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

  async capturePayment(orderId: string, captured_amount: number, order_lines: any) {
    return this.orders.capturePayment(orderId, captured_amount, order_lines);
  }


  async getSession(sessionId: string) {
    return this.sessions.getSession(sessionId);
  }

  async updateSession(sessionId: string, payload: any) {
    return this.sessions.updateSession(sessionId, payload);
  }

  async sessionBody(shop: string, order: any, cart: any){
    return this.sessions.sessionBody(shop, order, cart)
  }
  async createSession(session: any) {
    return this.sessions.createSession(session);
  }
}
