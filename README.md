# ChatGPT Pro

A modern web application that provides an AI-powered chatbot with undetectable text generation capabilities.

## Features

- AI-powered chatbot with natural language processing
- Undetectable text generation algorithm
- User authentication and authorization
- Subscription management with Stripe integration
- Free trial with 3 prompts
- Modern and responsive UI

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Stripe account
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatgpt_pro"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_PRICE_ID="your-stripe-price-id"
OPENAI_API_KEY="your-openai-api-key"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatgpt-pro.git
cd chatgpt-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create a product and price in the Stripe dashboard
3. Set up webhooks in the Stripe dashboard:
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
