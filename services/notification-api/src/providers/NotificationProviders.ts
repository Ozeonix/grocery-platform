export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';

export interface EmailPayload {
  to: string;
  subject: string;
  bodyHtml: string;
}

export interface SmsPayload {
  toPhoneNumber: string;
  message: string;
}

export interface PushPayload {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class EmailProvider {
  static async send(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[EmailProvider] Sent email to ${payload.to} | Subject: "${payload.subject}"`);
    return { success: true, messageId: `email_mock_${Date.now()}` };
  }
}

export class SmsProvider {
  static async send(payload: SmsPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[SmsProvider] Sent SMS to ${payload.toPhoneNumber} | Message: "${payload.message}"`);
    return { success: true, messageId: `sms_mock_${Date.now()}` };
  }
}

export class PushProvider {
  static async send(payload: PushPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[PushProvider] Dispatched push notification to token ${payload.deviceToken.slice(0, 8)}... | Title: "${payload.title}"`);
    return { success: true, messageId: `push_mock_${Date.now()}` };
  }
}
