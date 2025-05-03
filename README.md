# 🌟 SmartFin - Hedera-Powered Financial Management via Telegram 🌟

**SmartFin** is a cutting-edge AI-driven financial management platform enhanced with **Hedera Hashgraph** and an interactive **Telegram bot**, empowering businesses to manage finances, send tokens, create airdrops, and reward customers seamlessly through chat.

---

![Hero Page Image](image.png)

## 💸 Key Capabilities

### 1. Hedera-Powered Transactions

* 🔁 **Instant HBAR Transfers:** Send HBAR tokens to any customer in your database directly from Telegram.
* 🎁 **Automated Airdrops:** Schedule or trigger token distributions to user segments or your entire customer base.
* 🎉 **Custom Gifting:** Create personalized token gifts to thank or incentivize individual customers.
* ⚡ **Micro-fee Efficiency:** Leverage Hedera’s low transaction fees for cost-effective micropayments.

### 2. AI-Driven Financial Insights

* 📊 **Real-Time Tracking:** Monitor incomes, expenses, and transaction flows with live dashboards.
* 🤖 **Smart Recommendations:** Receive AI-powered suggestions for budgeting, expense reduction, and growth strategies.
* 📈 **Custom Reports:** Generate downloadable analytics and visualizations for stakeholders.

### 3. Telegram Bot Integration

Interact with **@Finnebulabot** on Telegram for a fully conversational financial experience:

* 💬 **Chat Commands:** Intuitive commands to manage tokens, check balances, and review history.
* 🔔 **Notifications:** Automated alerts for incoming payments, upcoming airdrops, and low balances.

🔗 **Launch the bot:** [@Finnebulabot](https://web.telegram.org/k/#@Finnebulabot)

🎥 **Watch Demo:** [SmartFin Hedera Bot in Action](https://drive.google.com/file/d/17QDPs2Vqb1I4J_QfHm2QycKxABLwNYIF/view?usp=sharing)

---

## 🛠️ Architecture Overview

```plaintext
[User via Telegram] <--> [Finnebulabot Service (NestJS)] <--> [SmartFin API (Next.js)]
                                                |         |
                                                |         --> [Hedera Hashgraph Network]
                                                |         --> [MongoDB Database]
                                                |
                                                --> [AI Insights Engine (Node.js/Python)]
```

* **Finnebulabot Service:** Receives and processes Telegram commands, validates user sessions, and routes requests to SmartFin API.
* **SmartFin API:** Core backend in Next.js handling business logic, AI integrations, and Hedera SDK interactions.
* **Hedera Network:** Executes token operations—transfers, airdrops, token minting via Hedera Token Service.
* **MongoDB:** Stores user profiles, transaction logs, bot settings, and AI-generated insights.

---

## 🔧 Tech Stack

| Layer              | Technology                    |
| ------------------ | ----------------------------- |
| Frontend           | Next.js, React, Tailwind CSS  |
| Backend API        | Next.js (API Routes), Node.js |
| Database           | MongoDB                       |
| Authentication     | Firebase                      |
| AI Insights        | OpenAI API, Germini Model     |
| Hedera Integration | Hedera JavaScript SDK         |
| Bot Framework      | NestJS,granny                 |
| Charts & Reports   | Chart.js                      |

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** v14 or above
* **MongoDB** instance (local or Atlas)
* **Hedera Account:** Operator ID & Private Key
* **Telegram Bot:** Token from BotFather

### Setup & Installation

1. **Clone repository:**

   ```bash
   git clone https://github.com/Ekenesamuel8/smartfin.git
   cd smartfin
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Environment variables:** Create a `.env` file in the project root with:

   ```env
   MONGODB_URI=<your_mongodb_uri>
   NEXTAUTH_SECRET=<your_nextauth_secret>
   OPENAI_API_KEY=<your_openai_api_key>
   HEDERA_OPERATOR_ID=<your_hedera_account_id>
   HEDERA_OPERATOR_KEY=<your_hedera_private_key>
   TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
   GOOGLE_API_KEY=<your_google_api_key>
   ```
4. **Start SmartFin API & Web:**

   ```bash
   npm run dev
   ```
5. **Launch Telegram Bot Service:**

   ```bash
   cd bot
   npm install
   npm run test-telegram
   ```
6. **Interact with SmartFin:** Open Telegram and chat with [@Finnebulabot](https://web.telegram.org/k/#@Finnebulabot).

---

## 📂 Project Structure

```
smartfin/
├── pages/                    # Next.js web app routes and pages
├── components/               # React UI components
├── lib/                      # Integration helpers (Hedera, Telegram)
├── ai/                       # AI insights engine (optional Python services)
├── prisma/                   # Prisma schema & migrations
├── public/                   # Static assets (images, icons)
├── styles/                   # Tailwind CSS configuration
├── scripts/                  # Utility scripts (migrations, seeds)
├── .env.example              # Example environment variables
├── next.config.js
├── package.json
└── README.md
```

---

## 🌟 Contributors

* **Okoye Emmanuel Obiajulu** ([Obiajulu-gif](https://github.com/Obiajulu-gif/))
* **Ekene Samuel Chinwendu** ([Ekenesamuel8](https://github.com/Ekenesamuel8/))
* **Okeoma Amaobi** ([OkeyAmy](https://github.com/OkeyAmy))

Contributions welcome! Fork the repo, open a pull request, and join us in revolutionizing financial automation.

---

*Empower your business with AI, Hedera, and Telegram — SmartFin makes finance seamless!*
