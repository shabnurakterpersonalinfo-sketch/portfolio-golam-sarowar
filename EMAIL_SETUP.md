# Contact Form Email Setup Guide

This project includes a fully functional contact form that sends emails to **mohammad.sarowar06@gmail.com** when users submit messages through either the contact page (`/contact`) or the home page contact section.

## Features

- ✅ Professional email delivery via Resend
- ✅ Beautiful HTML email template
- ✅ Form validation and error handling
- ✅ Loading states and success/error notifications
- ✅ Works on both Contact page and Home page
- ✅ Free tier: 100 emails per day, 3,000 per month

## Setup Instructions

### 1. Get a Resend API Key

1. Visit [https://resend.com/signup](https://resend.com/signup)
2. Sign up for a free account
3. Once logged in, go to **API Keys** section
4. Click **Create API Key**
5. Give it a name (e.g., "Portfolio Contact Form")
6. Copy the API key (starts with `re_...`)

### 2. Add Environment Variable

Add your Resend API key to your project:

**Option A: Via v0 Interface**
1. Click the **Vars** section in the in-chat sidebar
2. Add the environment variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (starts with `re_...`)

**Option B: Via Vercel Dashboard**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
4. Click **Save**

### 3. Test the Contact Form

1. Visit your deployed site or preview
2. Navigate to the **Contact** page or scroll to the contact section on the home page
3. Fill out the form with:
   - Your name
   - Your email address
   - A test message
4. Click **Submit Form**
5. Check the inbox at **mohammad.sarowar06@gmail.com** for the email

## Email Details

The email sent includes:

- **Subject**: "New Contact Form Submission - Mohammad Golam Sarowar Portfolio"
- **From**: Portfolio Contact <onboarding@resend.dev>
- **To**: mohammad.sarowar06@gmail.com
- **Content**: Professional HTML template with:
  - Sender's full name
  - Sender's email address
  - Message content

## Important Notes

### Why use onboarding@resend.dev?

Resend's test email `onboarding@resend.dev` is pre-verified and works immediately without domain setup. This means:

- ✅ Works right away with just an API key
- ✅ No domain verification needed
- ✅ Perfect for portfolios and small projects

### Want to use a custom domain?

If you want emails to come from your own domain (e.g., `contact@yourdomain.com`):

1. Add your domain in Resend dashboard
2. Verify DNS records
3. Update the `from` field in `/app/api/contact/route.ts`

## Component Structure

- **`/app/api/contact/route.ts`** - API route handler that sends emails via Resend
- **`/components/contact-form.tsx`** - Reusable contact form component with state management
- **`/app/contact/page.tsx`** - Contact page using ContactForm component
- **`/app/page.tsx`** - Home page with embedded ContactForm component

## Troubleshooting

### Email not sending?

1. **Check API key**: Verify `RESEND_API_KEY` is set correctly in environment variables
2. **Check console**: Look for error logs in the browser developer console
3. **Check spam folder**: Initial emails might land in spam
4. **Verify Resend account**: Make sure your Resend account is active

### "403 validation_error" - Domain not verified?

This happens if you try to send from an unverified custom domain. Solution:
- Use `onboarding@resend.dev` as the `from` address (already set)
- Or verify your custom domain in Resend dashboard

### Form not submitting?

1. **Check network tab**: Look for failed API requests to `/api/contact`
2. **Verify all fields**: Ensure name, email, and message are filled
3. **Check browser console**: Look for JavaScript errors

### Rate limiting?

Resend free tier includes:
- 100 emails per day
- 3,000 emails per month

For higher volumes, upgrade at [resend.com/pricing](https://resend.com/pricing)

## Customization

### Change recipient email

Edit `/app/api/contact/route.ts`:

\`\`\`typescript
to: "newemail@example.com",
\`\`\`

### Customize email subject

Edit `/app/api/contact/route.ts`:

\`\`\`typescript
subject: "Your Custom Subject Line",
\`\`\`

### Add more form fields

Update `/components/contact-form.tsx`:

1. Add new field to `formData` state
2. Add input element in the form
3. Update API route to include new field in the request body

## Why Resend?

- **Modern API** - Clean, simple, developer-friendly
- **Reliable delivery** - High deliverability rates
- **Beautiful emails** - Full HTML support
- **Free tier** - Generous for portfolio sites
- **Great documentation** - Easy to integrate and customize

## Security Notes

- API key is stored in environment variables (never committed to code)
- Form includes validation on both client and server
- Resend provides built-in spam protection
- Rate limiting prevents abuse

## Support

For issues with:
- **Resend service**: Visit [resend.com/support](https://resend.com/support)
- **v0 deployment**: Contact Vercel support at vercel.com/help
