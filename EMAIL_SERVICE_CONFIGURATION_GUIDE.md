# Email Service Configuration Guide for Garshain

This guide will help you configure the email reminder system for your Garshain lending platform.

## 🚀 Quick Start

1. **Access the Email Settings**: Navigate to the admin panel in your application
2. **Configure Email Service**: Set up your preferred email service provider
3. **Test Configuration**: Send a test email to verify everything works
4. **Enable Reminders**: Activate the automatic reminder system

## 📧 Email Service Providers

### Option 1: SendGrid (Recommended)
- **Pros**: Reliable, good deliverability, easy setup
- **Cons**: Paid service (free tier available)
- **Setup**: 
  1. Sign up at [sendgrid.com](https://sendgrid.com)
  2. Create an API key
  3. Verify your sender email

### Option 2: AWS SES (Amazon Simple Email Service)
- **Pros**: Very reliable, cost-effective, integrates well with AWS
- **Cons**: Requires AWS account setup
- **Setup**:
  1. Create AWS account
  2. Set up SES service
  3. Verify your domain/email
  4. Create IAM user with SES permissions

### Option 3: Mailgun
- **Pros**: Developer-friendly, good documentation
- **Cons**: Paid service
- **Setup**:
  1. Sign up at [mailgun.com](https://mailgun.com)
  2. Verify your domain
  3. Get API key

### Option 4: Nodemailer with Gmail (Development Only)
- **Pros**: Free, easy for testing
- **Cons**: Not suitable for production, limited sending
- **Setup**:
  1. Enable 2-factor authentication on Gmail
  2. Generate app password
  3. Use Gmail SMTP settings

## 🔧 Configuration Steps

### Step 1: Access Email Settings
1. Open your Garshain application
2. Navigate to the admin panel
3. Look for "Email Settings" or "إعدادات البريد الإلكتروني"

### Step 2: Configure Email Service
Fill in the following fields:

#### Basic Configuration
- **API Key**: Your email service API key
- **Service URL**: Your email service endpoint
- **From Email**: `noreply@garshain.com` (or your verified domain)
- **From Name**: `قرشين - منصة الإقراض الرقمي`
- **Reply To**: `support@garshain.com`

#### Advanced Settings
- **Enable Reminders**: ✅ (Turn on automatic reminders)
- **Check Interval**: `24` hours (How often to check for due payments)
- **Max Attempts**: `3` (Maximum reminder attempts per loan)

### Step 3: Test Configuration
1. Go to the "Test" tab in email settings
2. Click "Send Test Email"
3. Check your backup email for the test message
4. Verify the email format and content

### Step 4: Enable the System
1. Save all settings
2. The system will automatically start checking for due payments
3. Reminders will be sent based on your configured schedule

## 📋 Email Templates

The system includes three types of reminder emails:

### 1. Upcoming Payment (قريب الاستحقاق)
- Sent 3 days before due date
- Friendly reminder tone
- Green color scheme

### 2. Overdue Payment (متأخر)
- Sent when payment is overdue
- Warning tone
- Orange color scheme
- Shows days overdue

### 3. Final Notice (إشعار نهائي)
- Sent after 7 days overdue
- Urgent tone
- Red color scheme
- Legal warning

## 🎨 Email Features

- **RTL Support**: Full Arabic language support
- **Responsive Design**: Works on all devices
- **Professional Styling**: Modern, clean design
- **Brand Consistency**: Matches your Garshain branding
- **Contact Information**: Includes support details

## 🔍 Monitoring & Analytics

The system provides real-time statistics:
- Active loans count
- Overdue loans count
- Reminders sent today
- Average days overdue

## 🛠️ Troubleshooting

### Common Issues

#### 1. "API Key Invalid" Error
- Verify your API key is correct
- Check if the key has proper permissions
- Ensure the key is not expired

#### 2. "Email Not Sending" Error
- Check your service URL
- Verify your sender email is verified
- Check your account limits/quota

#### 3. "Template Error" Error
- Ensure all required fields are filled
- Check for special characters in names
- Verify date formats

### Debug Mode
Enable debug mode in settings to see detailed logs in the browser console.

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** for unusual activity
5. **Use HTTPS** for all email service communications

## 📞 Support

If you need help with configuration:
1. Check the browser console for error messages
2. Enable debug mode for detailed logs
3. Test with a simple email first
4. Contact your email service provider's support

## 🚀 Production Deployment

For production deployment:
1. Use a verified domain for sender email
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email deliverability
4. Set up bounce handling
5. Implement proper error logging

## 📊 Performance Optimization

- **Batch Processing**: Process multiple reminders efficiently
- **Rate Limiting**: Respect email service limits
- **Retry Logic**: Handle temporary failures gracefully
- **Caching**: Cache email templates for better performance

---

## Next Steps

1. **Choose your email service provider**
2. **Set up your account and get API credentials**
3. **Configure the system using the admin interface**
4. **Test with a sample email**
5. **Enable automatic reminders**
6. **Monitor the system performance**

The email reminder system is now ready to help you maintain better communication with your borrowers and improve payment collection rates!
