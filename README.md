# AI-website-Builder
# GenWeb.ai - AI-Powered Website Builder

GenWeb.ai is a full-stack, AI-driven website builder that generates complete, production-ready, and responsive websites from text prompts. It utilizes the power of advanced language models to create stunning user interfaces seamlessly.

## 🚀 Features

- **AI Website Generation:** Describe what you want, and the AI builds a fully functional, styled, and responsive Single Page Application (SPA) instantly.
- **Live Code Editor:** Includes an integrated Monaco Editor to manually tweak or view the generated HTML, CSS, and JS.
- **Iterative Updates:** Prompt the AI to make changes or add features to your existing generated website.
- **User Dashboard:** Manage your generated websites, track your token/credit usage, deploy your sites, and generate shareable links.
- **Authentication:** Secure Google authentication powered by Firebase and JWT.
- **Billing & Credits System:** Integrated with Stripe for purchasing credits (Free, Basic, and Pro plans).
- **Modern UI:** Built with Tailwind CSS and Framer Motion for sleek, dynamic user interfaces.

## 💻 Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Animations:** Motion (Framer Motion)
- **Editor:** Monaco Editor (@monaco-editor/react)
- **Auth:** Firebase (Google Auth)

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **AI Integration:** OpenRouter API
- **Payments:** Stripe + Webhooks
- **Security:** JWT (JSON Web Tokens), Cookie Parser, CORS

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Stripe account (for billing and webhooks)
- OpenRouter API key (for AI generation)
- Firebase project (for Google Auth)

### 1. Clone the repository
```bash
git clone <repository-url>
cd WebsiteBuilder
```

### 2. Setup the Server
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLIENT_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Client
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory and configure the following variables:
```env
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
# Add other Firebase config keys as needed
```

Start the frontend development server:
```bash
npm run dev
```

## 🌐 Usage
1. Sign in with your Google account.
2. Click **Get Started** or **+ New Website** from your Dashboard.
3. Provide a detailed prompt of the website you want to build.
4. Preview the generated website, edit the code if necessary, or ask the AI to make specific updates.
5. Deploy the website and share the link!

## 📄 License
This project is licensed under the ISC License.

some websites made:
https://ai-website-builder-2-yg8d.onrender.com/site/createafooddeliverywebsite1a4b9
https://ai-website-builder-2-yg8d.onrender.com/site/createaprofessionalportfolioforafinalyrco0650e

