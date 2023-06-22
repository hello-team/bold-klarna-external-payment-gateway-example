import { Request, Response } from 'express';
import KlarnaService from '../../services/klarna/KlarnaService'
import KlarnaPayments  from '../../services/klarna/Payments';
import KlarnaOrders from '../../services/klarna/Orders';

class ExampleController {
  public async generateRetainedPaymentToken(req: Request, res: Response): Promise<void> {
    const klarna = new KlarnaService()
    const klarnaPayments = new KlarnaPayments();
    const klarnaSession = await klarna.getSession(req.body.token)
    const klarnaData = {
      authorization_token: klarnaSession.authorization_token,
      auto_capture: false,
      order_amount: klarnaSession.order_amount,
      order_lines: klarnaSession.order_lines,
      purchase_country: klarnaSession.purchase_country,
      purchase_currency: klarnaSession.purchase_currency,
    };

    const data = await klarnaPayments.preAuthPayment(klarnaSession.authorization_token, klarnaData)

    res.json({ token: data.token});
  }

  public authorizePayment(req: Request, res: Response): void {
    const {token} = req.body;
    res.json({ authorization_id: token });
  }

  public async capturePayment(req: Request, res: Response): Promise<void> {
    const klarnaOrders = new KlarnaOrders();
    const { authorization_id } = req.body;
    const order = await klarnaOrders.getOrder(authorization_id)
     await klarnaOrders.capturePayment(authorization_id, order.remaining_authorized_amount, order.order_lines)
     const capturedOrder = await klarnaOrders.getOrder(authorization_id)

    const transactionId = capturedOrder.captures[0].capture_id; // Placeholder transaction ID, replace with actual logic
    res.json({ transaction_id: transactionId });
  }

  public voidPayment(req: Request, res: Response): void {
    // Add your implementation logic here
    res.sendStatus(200);
  }

  public refundPayment(req: Request, res: Response): void {
    // Add your implementation logic here
    res.sendStatus(200);
  }
}

export default ExampleController;
