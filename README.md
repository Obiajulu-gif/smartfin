# 🌟 SmartFin - AI-Powered Financial Management 🌟

Welcome to **SmartFin**, your ultimate AI-powered financial management tool designed to streamline financial tracking and decision-making for businesses. With SmartFin, users can effortlessly track daily profits, expenses, and transactions. This app leverages artificial intelligence to provide personalized insights and includes a virtual assistant that helps businesses make informed financial decisions.

![Hero Page Image](image.png)

## ✨ Features

- 📊 **Comprehensive Financial Management:** Track income, expenses, and transactions in real-time.
- 🤖 **AI-Driven Insights:** Receive personalized financial advice tailored to your business needs.
- 📦 **Inventory & Product Management:** Manage products, inventory and services efficiently.
- 📈 **Detailed Reports:** Generate easy-to-read reports on financial performance.
- 💬 **Smart AI Chatbot:** Interact with an AI financial assistant using natural language.
- 🔒 **Secure Authentication:** Secure login and user management with Firebase Authentication.
- 💻 **Responsive UI:** Beautiful and intuitive user interface powered by Tailwind CSS.
- 📊 **Data Visualization:** View financial data in engaging charts powered by Recharts.

## 🔥 Latest Updates

- **Enhanced AI Chatbot Interface**: Completely redesigned chatbot with message animations, visual indicators, and quick suggestions
- **Conversation History**: Your chat history is now saved and can be retrieved between sessions
- **Improved API Integration**: Better error handling and response streaming for a more natural conversation flow
- **New Product Management**: Easily add, edit, and manage your products with the new product management interface

## 🛠️ Tech Stack

The project leverages the following technologies:

- ⚛️ **Next.js 14:** A React framework for building server-rendered applications
- 🍃 **MongoDB:** A NoSQL database for storing and managing data
- 🔥 **Firebase:** Authentication and real-time data management
- 🎨 **Tailwind CSS:** A utility-first CSS framework for responsive and mobile-friendly design
- 🤖 **Google Generative AI (Gemini):** Powers our AI financial assistant
- 📊 **Recharts:** A composable charting library for React
- 🔄 **LangChain.js:** For AI conversation orchestration and context management

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have the following installed:
- 🟢 **Node.js** (v18 or above)
- 🔥 **Firebase** account
- 🍃 **MongoDB** Atlas account or local MongoDB instance

### ⚙️ Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Ekenesamuel8/smartfin.git
    cd smartfin
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment variables:**
    - Copy the `.env.example` file to `.env.local`
    - Update the variables with your own values:
    ```bash
    cp .env.example .env.local
    ```

4. **Set up the database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5. **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🌐 Environment Variables

Create a `.env.local` file in the root directory with the following variables (see `.env.example` for a template):

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/smartfin

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# SmartFin AI API
NEXT_PUBLIC_API_URL=https://smartfin-ai-api.onrender.com

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📁 Project Structure

```plaintext
smartfin/
├── README.md      
├── .env.example
├── curl
├── image.png      
├── jsconfig.json  
├── next-env.d.ts  
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── public
│   └── images
│       ├── hero.png
│       ├── laptop.png
│       ├── logo.png
│       ├── logo.svg
│       ├── tablet.png
│       └── track.png
├── src
│   ├── app
│   │   ├── PrivateRoute.js
│   │   ├── api
│   │   │   ├── addTransaction
│   │   │   │   └── route.js
│   │   │   ├── chatbot
│   │   │   │   └── route.js
│   │   │   ├── conversation
│   │   │   │   └── [userId]
│   │   │   │       └── route.js
│   │   │   ├── mongodb-expenses
│   │   │   │   └── route.js
│   │   │   ├── mongodb-products
│   │   │   │   └── route.js
│   │   │   ├── notifications
│   │   │   │   └── route.js
│   │   │   └── products
│   │   │       └── route.js
│   │   ├── components
│   │   │   ├── Chatbot.jsx
│   │   │   ├── FaqSection.jsx
│   │   │   ├── Feature.jsx
│   │   │   ├── FeatureSections.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Testimonial.jsx
│   │   │   └── trans.jsx
│   │   ├── dashboard
│   │   │   ├── DashboardLayout.js
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── accounting
│   │   │   │   └── page.js
│   │   │   ├── chat
│   │   │   │   └── page.js
│   │   │   ├── contacts
│   │   │   │   └── page.js
│   │   │   ├── expenses
│   │   │   │   └── page.js
│   │   │   ├── file-management
│   │   │   │   └── page.js
│   │   │   ├── message
│   │   │   │   └── page.js
│   │   │   ├── notifications
│   │   │   │   └── page.js
│   │   │   ├── page.js
│   │   │   ├── pos
│   │   │   │   └── page.js
│   │   │   ├── products
│   │   │   │   ├── new
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   ├── settings
│   │   │   │   └── page.js
│   │   │   ├── transact
│   │   │   │   └── page.js
│   │   │   └── transactions
│   │   │       ├── new
│   │   │       │   └── page.js
│   │   │       └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── login
│   │   │   └── page.js
│   │   ├── page.js
│   │   └── signup
│   │       ├── BusinessForm.js
│   │       ├── BusinessVerification.js
│   │       ├── EmailForm.js
│   │       ├── SignupLayout.js
│   │       ├── SuccessMessage.js
│   │       └── page.js
│   └── lib
│       ├── firebaseAuth.js
│       ├── financialCalculations.js
│       ├── mongodb.js
│       └── prisma.js
├── tailwind.config.js
└── tsconfig.json
```

## 💬 SmartFin-AI Chatbot Integration

The application integrates with the SmartFin-AI API to provide personalized financial advice:

1. **Data Collection**: Gathers user data from MongoDB (profile, transactions, expenses, contacts, products)
2. **Context-aware Conversations**: Sends data along with user queries to the AI for personalized responses
3. **Conversation Memory**: Saves chat history for continuity between sessions
4. **Interactive UI**: Features a modern interface with typing animations, message grouping, and quick suggestions

### Chatbot Features:

- **Streaming Responses**: AI responses appear with a typing effect for a more natural feel
- **Copy to Clipboard**: Easily copy AI responses with a single click
- **Message History**: View and continue previous conversations
- **Quick Suggestions**: Get started with pre-defined financial questions
- **Visual Feedback**: Clear loading states and user/assistant indicators

## 🌟 Contributors

This project is made possible thanks to the efforts of the following contributors:

- [**Obiajulu-gif**](https://github.com/Obiajulu-gif/) - **Okoye Emmanuel Obiajulu**
- [**Ekenesamuel8**](https://github.com/Ekenesamuel8/) - **Ekene Samuel Chinwendu**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to improve the project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
