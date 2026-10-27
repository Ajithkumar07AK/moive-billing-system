import { apiResponse } from '../utils/apiResponse.js';

export const PaymentController = {
  processPayment: async (req, res, next) => {
    try {
      const { paymentMethod, amount, details } = req.body;

      if (!paymentMethod || !amount) {
        return apiResponse(res, 400, false, 'Payment method and amount are required');
      }

      // Simulate a 2-second payment gateway processing delay (as requested)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, integrate Razorpay:
      // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: ... });

      const transactionId = `TXN_INF_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      return apiResponse(res, 200, true, 'Payment authorized successfully', {
        transactionId,
        paymentStatus: 'completed',
        amount,
        paymentMethod,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },
};
