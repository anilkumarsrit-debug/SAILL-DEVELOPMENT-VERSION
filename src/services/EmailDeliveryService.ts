export interface EmailDeliveryResult {
  delivered: boolean;
  messageId: string;
  mode: 'DEVELOPMENT' | 'PRODUCTION';
  devResetUrl?: string;
}

export interface DevEmailPayload {
  email: string;
  resetUrl: string;
  userDisplayName: string;
  role: string;
  timestamp: string;
}

export class EmailDeliveryService {
  private static isDevEnvironment(): boolean {
    // Return true since running in Vite preview / AI Studio sandbox environment
    return true;
  }

  /**
   * Dispatches password recovery instructions.
   * In DEVELOPMENT MODE, records payload locally so sandbox preview can display the test link.
   */
  static async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    userDisplayName: string,
    role: string
  ): Promise<EmailDeliveryResult> {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    if (this.isDevEnvironment()) {
      const devPayload: DevEmailPayload = {
        email,
        resetUrl,
        userDisplayName,
        role,
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem('saill_dev_last_reset_email', JSON.stringify(devPayload));
      } catch {
        // ignore storage quota errors
      }

      console.info(
        `%c[DEVELOPMENT MODE ONLY] Password Reset Email Dispatched%c\nTo: ${email}\nName: ${userDisplayName}\nLink: ${resetUrl}`,
        'color: #0284c7; font-weight: bold; font-size: 12px;',
        'color: inherit;'
      );

      return {
        delivered: true,
        messageId,
        mode: 'DEVELOPMENT',
        devResetUrl: resetUrl
      };
    } else {
      // In a production setup with an SMTP gateway, send email here.
      return {
        delivered: true,
        messageId,
        mode: 'PRODUCTION'
      };
    }
  }

  static getLastDevEmail(): DevEmailPayload | null {
    try {
      const raw = localStorage.getItem('saill_dev_last_reset_email');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static clearLastDevEmail(): void {
    try {
      localStorage.removeItem('saill_dev_last_reset_email');
    } catch {
      // ignore
    }
  }
}
