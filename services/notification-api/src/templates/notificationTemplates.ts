export interface FormattedNotification {
  type: string;
  title: string;
  message: string;
}

export class NotificationTemplates {
  static get(type: string, data: Record<string, any>): FormattedNotification {
    switch (type.toUpperCase()) {
      case 'ORDER_CONFIRMED':
        return {
          type: 'ORDER_CONFIRMED',
          title: 'Order Confirmed! 🎉',
          message: `Your grocery order #${data.orderNumber || ''} has been placed and is being prepared by the store.`,
        };

      case 'PAYMENT_RECEIVED':
        return {
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Successful 💳',
          message: `Payment of $${data.amount || ''} was successfully processed for order #${data.orderNumber || ''}.`,
        };

      case 'RIDER_ASSIGNED':
        return {
          type: 'RIDER_ASSIGNED',
          title: 'Delivery Partner Assigned 🛵',
          message: `Rider ${data.riderName || 'Partner'} has been assigned to deliver your fresh groceries.`,
        };

      case 'OUT_FOR_DELIVERY':
        return {
          type: 'OUT_FOR_DELIVERY',
          title: 'Out for Delivery ⚡',
          message: `Your groceries are on the way! Share verification OTP: ${data.deliveryOtp || '••••••'} on arrival.`,
        };

      case 'DELIVERED':
        return {
          type: 'DELIVERED',
          title: 'Order Delivered! 🥦',
          message: `Your order #${data.orderNumber || ''} has been delivered successfully. Thank you for shopping fresh!`,
        };

      case 'REFUND_PROCESSED':
        return {
          type: 'REFUND_PROCESSED',
          title: 'Refund Processed 💰',
          message: `A refund of $${data.amount || ''} has been processed for order #${data.orderNumber || ''}.`,
        };

      default:
        return {
          type: 'GENERAL',
          title: data.title || 'FreshCart Notification',
          message: data.message || 'You have an update regarding your order.',
        };
    }
  }
}
