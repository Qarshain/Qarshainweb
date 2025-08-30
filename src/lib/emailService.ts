// Email Service for Garshain
// Handles sending repayment reminders and other notifications

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface ReminderEmailData {
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: number;
  remainingAmount: number;
  dueDate: string;
  daysOverdue?: number;
  loanId: string;
  paymentLink: string;
  lenderName?: string;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  apiKey?: string;
  serviceUrl?: string;
}

class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  // Generate repayment reminder email template
  generateReminderEmail(data: ReminderEmailData, type: 'upcoming' | 'overdue' | 'final'): EmailTemplate {
    const isOverdue = type === 'overdue' || type === 'final';
    const urgencyLevel = type === 'final' ? 'high' : isOverdue ? 'medium' : 'low';
    
    const subject = this.getReminderSubject(type, data.daysOverdue);
    const html = this.generateReminderHTML(data, type, urgencyLevel);
    const text = this.generateReminderText(data, type);

    return { subject, html, text };
  }

  private getReminderSubject(type: string, daysOverdue?: number): string {
    switch (type) {
      case 'upcoming':
        return '🔔 Payment Reminder - Garshain Loan Due Soon';
      case 'overdue':
        return `⚠️ Payment Overdue - ${daysOverdue} Days Past Due - Garshain`;
      case 'final':
        return '🚨 Final Notice - Immediate Payment Required - Garshain';
      default:
        return 'Payment Reminder - Garshain';
    }
  }

  private generateReminderHTML(data: ReminderEmailData, type: string, urgencyLevel: string): string {
    const urgencyColor = urgencyLevel === 'high' ? '#dc2626' : urgencyLevel === 'medium' ? '#ea580c' : '#059669';
    const urgencyBg = urgencyLevel === 'high' ? '#fef2f2' : urgencyLevel === 'medium' ? '#fff7ed' : '#f0fdf4';
    
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Reminder - Garshain</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f8fafc;
        }
        .container { 
            background: white; 
            border-radius: 12px; 
            padding: 30px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-top: 4px solid ${urgencyColor};
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding: 20px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            border-radius: 8px;
        }
        .logo { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
        }
        .urgency-banner {
            background-color: ${urgencyBg};
            border: 2px solid ${urgencyColor};
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .urgency-text {
            color: ${urgencyColor};
            font-weight: bold;
            font-size: 18px;
        }
        .loan-details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
            border-right: 4px solid #3b82f6;
        }
        .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 10px 0; 
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #475569; }
        .detail-value { font-weight: 500; color: #1e293b; }
        .amount { 
            font-size: 24px; 
            font-weight: bold; 
            color: #059669; 
        }
        .overdue-amount { color: #dc2626; }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(5, 150, 105, 0.4);
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e2e8f0; 
            text-align: center; 
            color: #64748b; 
            font-size: 14px;
        }
        .contact-info {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .warning-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-text {
            color: #dc2626;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container { padding: 20px; }
            .detail-row { flex-direction: column; }
            .detail-label { margin-bottom: 5px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">قرشين</div>
            <div>منصة الإقراض الرقمي</div>
        </div>

        ${this.getUrgencyBanner(type, data.daysOverdue, urgencyColor, urgencyBg)}

        <h2 style="color: #1e40af; margin-bottom: 20px;">
            ${this.getGreeting(type)}
        </h2>

        <p style="font-size: 16px; margin-bottom: 20px;">
            ${this.getMainMessage(data, type)}
        </p>

        <div class="loan-details">
            <h3 style="color: #1e40af; margin-bottom: 15px;">تفاصيل القرض</h3>
            <div class="detail-row">
                <span class="detail-label">اسم المقترض:</span>
                <span class="detail-value">${data.borrowerName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">رقم القرض:</span>
                <span class="detail-value">#${data.loanId}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">المبلغ المتبقي:</span>
                <span class="detail-value amount ${isOverdue ? 'overdue-amount' : ''}">
                    ${data.remainingAmount.toLocaleString('ar-SA')} ر.س
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">تاريخ الاستحقاق:</span>
                <span class="detail-value">${new Date(data.dueDate).toLocaleDateString('ar-SA')}</span>
            </div>
            ${data.daysOverdue ? `
            <div class="detail-row">
                <span class="detail-label">أيام التأخير:</span>
                <span class="detail-value" style="color: #dc2626; font-weight: bold;">
                    ${data.daysOverdue} يوم
                </span>
            </div>
            ` : ''}
        </div>

        ${this.getWarningBox(type)}

        <div style="text-align: center; margin: 30px 0;">
            <a href="${data.paymentLink}" class="cta-button">
                ${this.getButtonText(type)}
            </a>
        </div>

        <div class="contact-info">
            <h4 style="color: #1e40af; margin-bottom: 10px;">هل تحتاج مساعدة؟</h4>
            <p style="margin: 5px 0;">📧 البريد الإلكتروني: support@garshain.com</p>
            <p style="margin: 5px 0;">📞 الهاتف: +966 11 123 4567</p>
            <p style="margin: 5px 0;">💬 الدردشة المباشرة: متاحة 24/7</p>
        </div>

        <div class="footer">
            <p>هذه رسالة تلقائية من منصة قرشين. يرجى عدم الرد على هذا البريد الإلكتروني.</p>
            <p>© 2024 قرشين. جميع الحقوق محفوظة.</p>
            <p style="margin-top: 15px;">
                <a href="#" style="color: #3b82f6; text-decoration: none;">سياسة الخصوصية</a> | 
                <a href="#" style="color: #3b82f6; text-decoration: none;">شروط الاستخدام</a>
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  private getUrgencyBanner(type: string, daysOverdue?: number, color: string, bgColor: string): string {
    switch (type) {
      case 'upcoming':
        return `
        <div class="urgency-banner">
            <div class="urgency-text">🔔 تذكير بالدفع - الاستحقاق قريب</div>
        </div>`;
      case 'overdue':
        return `
        <div class="urgency-banner">
            <div class="urgency-text">⚠️ دفعة متأخرة - ${daysOverdue} يوم من التأخير</div>
        </div>`;
      case 'final':
        return `
        <div class="urgency-banner">
            <div class="urgency-text">🚨 إشعار نهائي - دفع فوري مطلوب</div>
        </div>`;
      default:
        return '';
    }
  }

  private getGreeting(type: string): string {
    switch (type) {
      case 'upcoming':
        return 'تذكير ودود بالدفع';
      case 'overdue':
        return 'إشعار تأخير الدفع';
      case 'final':
        return 'إشعار نهائي للدفع';
      default:
        return 'تذكير بالدفع';
    }
  }

  private getMainMessage(data: ReminderEmailData, type: string): string {
    const daysOverdue = data.daysOverdue || 0;
    
    switch (type) {
      case 'upcoming':
        return `نود أن نذكرك بأن دفعة قرضك رقم #${data.loanId} مستحقة قريباً. يرجى التأكد من توفر المبلغ المطلوب في حسابك.`;
      case 'overdue':
        return `نود أن نعلمك بأن دفعة قرضك رقم #${data.loanId} متأخرة ${daysOverdue} يوم. يرجى السداد في أقرب وقت ممكن لتجنب رسوم إضافية.`;
      case 'final':
        return `هذا إشعار نهائي بخصوص القرض رقم #${data.loanId}. يرجى السداد فوراً لتجنب اتخاذ إجراءات قانونية.`;
      default:
        return `تذكير بخصوص دفعة قرضك رقم #${data.loanId}.`;
    }
  }

  private getWarningBox(type: string): string {
    switch (type) {
      case 'overdue':
        return `
        <div class="warning-box">
            <div class="warning-text">
                ⚠️ تحذير: التأخير في السداد قد يؤدي إلى رسوم إضافية وتأثير على التقييم الائتماني.
            </div>
        </div>`;
      case 'final':
        return `
        <div class="warning-box">
            <div class="warning-text">
                🚨 تحذير نهائي: فشل السداد قد يؤدي إلى اتخاذ إجراءات قانونية وتأثير دائم على التقييم الائتماني.
            </div>
        </div>`;
      default:
        return '';
    }
  }

  private getButtonText(type: string): string {
    switch (type) {
      case 'upcoming':
        return 'سدد الآن';
      case 'overdue':
        return 'سدد فوراً';
      case 'final':
        return 'سدد الآن - إجراء فوري';
      default:
        return 'سدد الآن';
    }
  }

  private generateReminderText(data: ReminderEmailData, type: string): string {
    const greeting = this.getGreeting(type);
    const mainMessage = this.getMainMessage(data, type);
    
    return `
${greeting}

${mainMessage}

تفاصيل القرض:
- اسم المقترض: ${data.borrowerName}
- رقم القرض: #${data.loanId}
- المبلغ المتبقي: ${data.remainingAmount.toLocaleString('ar-SA')} ر.س
- تاريخ الاستحقاق: ${new Date(data.dueDate).toLocaleDateString('ar-SA')}
${data.daysOverdue ? `- أيام التأخير: ${data.daysOverdue} يوم` : ''}

للسداد، يرجى زيارة: ${data.paymentLink}

للحصول على المساعدة:
- البريد الإلكتروني: support@garshain.com
- الهاتف: +966 11 123 4567

© 2024 قرشين. جميع الحقوق محفوظة.
    `.trim();
  }

  // Send email using configured service
  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // In a real implementation, you would integrate with an email service
      // like SendGrid, AWS SES, or similar
      console.log('📧 Sending email:', {
        to,
        subject: template.subject,
        service: 'Email Service'
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Email sent successfully to:', to);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Send reminder email
  async sendReminderEmail(data: ReminderEmailData, type: 'upcoming' | 'overdue' | 'final'): Promise<boolean> {
    const template = this.generateReminderEmail(data, type);
    return await this.sendEmail(data.borrowerEmail, template);
  }
}

// Email service configuration
export const emailConfig: EmailConfig = {
  fromEmail: 'noreply@garshain.com',
  fromName: 'قرشين - منصة الإقراض الرقمي',
  replyTo: 'support@garshain.com',
  // Add your email service API key here
  apiKey: import.meta.env.VITE_EMAIL_API_KEY,
  serviceUrl: import.meta.env.VITE_EMAIL_SERVICE_URL,
};

// Create email service instance
export const emailService = new EmailService(emailConfig);

// Utility functions for reminder scheduling
export const getReminderType = (dueDate: string, currentDate: Date = new Date()): 'upcoming' | 'overdue' | 'final' => {
  const due = new Date(dueDate);
  const today = new Date(currentDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return 'upcoming';
  } else if (diffDays >= -7) {
    return 'overdue';
  } else {
    return 'final';
  }
};

export const getDaysOverdue = (dueDate: string, currentDate: Date = new Date()): number => {
  const due = new Date(dueDate);
  const today = new Date(currentDate);
  const diffTime = today.getTime() - due.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};
