# Email Setup Guide

This project uses **Resend** for sending emails. Follow these steps to set up email functionality.

## 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your API Key

1. Once logged in, go to the **API Keys** section
2. Click **Create API Key**
3. Give it a name (e.g., "Nova Net Production")
4. Copy the API key (it starts with `re_`)

## 3. Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. Go to **Domains** in your Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `novanet.ca`)
4. Follow the DNS setup instructions to add the required records
5. Once verified, you can use emails like `noreply@novanet.ca`

## 4. Set Up Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=info@yourdomain.com
```

### Environment Variables Explained:

- **RESEND_API_KEY**: Your Resend API key (starts with `re_`)
- **EMAIL_FROM**: The sender email address for all outgoing emails (must be verified in Resend)
  - This is NOT the user's email from the form
  - This is the "from" address that appears in emails (e.g., "Nova Net <noreply@novanet.ca>")
  - For testing: You can use Resend's test domain: `onboarding@resend.dev`
  - For production: Use your verified domain (e.g., `noreply@novanet.ca`)
- **EMAIL_TO**: The email address where you receive notifications (your business email)
  - Contact form submissions are sent here
  - Job applications are sent here
  - This is where YOU receive the notifications

**Important**: The user's email (entered in the form) is used as the "to" address for confirmation emails sent to them. EMAIL_FROM is the sender address for all emails sent by your application.

## 5. Testing

### Using Resend's Test Domain (No Verification Needed)

For quick testing, you can use Resend's test domain:

```env
EMAIL_FROM=onboarding@resend.dev
EMAIL_TO=your-email@gmail.com
```

**Note**: Emails sent from `onboarding@resend.dev` will only be delivered to the email address you used to sign up for Resend.

### Using Your Own Domain (Production)

1. Verify your domain in Resend
2. Use your domain email addresses:

```env
EMAIL_FROM=noreply@novanet.ca
EMAIL_TO=info@novanet.ca
```

## 6. Email Features

The contact form sends two emails:

1. **Notification Email** (to `EMAIL_TO`): 
   - Sent to your business email
   - Contains all form submission details
   - Formatted HTML email

2. **Confirmation Email** (to the client):
   - Sent to the person who submitted the form
   - Confirms their submission was received
   - Professional thank you message

## Troubleshooting

### Emails Not Sending

1. Check that `RESEND_API_KEY` is set correctly
2. Verify the `EMAIL_FROM` domain is verified in Resend (or use test domain)
3. Check the server logs for error messages
4. Make sure the email addresses are valid

### Rate Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day

For higher limits, upgrade your Resend plan.

## Alternative: Using Other Email Services

If you prefer a different email service, you can replace Resend with:

- **SendGrid**: Popular email service
- **Mailgun**: Developer-friendly email API
- **AWS SES**: Amazon's email service
- **Nodemailer**: Direct SMTP sending

The code structure in `app/api/submitContact/route.ts` can be easily adapted to use any of these services.
