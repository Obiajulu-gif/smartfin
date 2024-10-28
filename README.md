# 🌟 SmartFin - AI-Powered Financial Management🌟

Welcome to **SmartFin**, your ultimate AI-powered financial management tool designed to streamline financial tracking and decision-making for businesses. With SmartFin, users can effortlessly track daily profits, expenses, and transactions. This app leverages artificial intelligence to provide personalized insights and includes a virtual assistant that helps businesses make informed financial decisions.

![Hero Page Image](image.png)
## ✨ Features

- 📊 **Comprehensive Financial Management:** Track income, expenses, and transactions in real-time.
- 🤖 **AI-Driven Insights:** Receive personalized financial advice tailored to your business needs.
- 📦 **Inventory Management:** Manage product inventory and services efficiently.
- 📈 **Detailed Reports:** Generate easy-to-read reports on financial performance.
- 🔒 **Secure Authentication:** Secure login and user management with NextAuth.
- 💻 **Responsive UI:** Beautiful and intuitive user interface powered by Tailwind CSS.
- 📊 **Data Visualization:** View financial data in engaging charts powered by Chart.js.
## 🛠️ Tech Stack

The project leverages the following technologies:

- ⚛️ **Next.js:** A React framework for building server-rendered applications.
- 🍃 **MongoDB:** A NoSQL database for storing and managing data.
- 🎨 **Tailwind CSS:** A utility-first CSS framework for responsive and mobile-friendly design.
- 🔐 **NextAuth:** A robust authentication library for Next.js applications.
- 📊 **Chart.js:** A JavaScript library for data visualization and charts.

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have the following installed:
- 🟢 **Node.js** (v14 or above)
- 🔥 **Firebase**
- 🍃 **MongoDB**
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
    Create a `.env` file in the root directory and add the necessary environment variables:
    ```env
    MONGODB_URI=<your_mongodb_connection_string>
    NEXTAUTH_SECRET=<your_nextauth_secret>
    OPENAI_API_KEY=<your_openai_api_key>
    ```

4. **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.
## Project Structure
```plaintext
smartfin/
├── README.md      
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
│   │   │   └── chatbot
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
│       └── prisma.js
├── tailwind.config.js
└── tsconfig.json

26 directories, 64 files
```

## 🌟 Contributors

This project is made possible thanks to the efforts of the following contributors:

- [**Obiajulu-gif**](https://github.com/Obiajulu-gif/) - **Okoye Emmanuel Obiajulu**
- [**Ekenesamuel8**](https://github.com/Ekenesamuel8/) - **Ekene Samuel Chinwendu**

If you would like to contribute, please feel free to submit a pull request! If you would like to contribute, please feel free to submit a pull request!
