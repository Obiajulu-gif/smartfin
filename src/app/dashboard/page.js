import React from "react";
import DashboardPage from "./DashboardPage";

export const metadata = {
	title: "Dashboard",
	description:
		"SmartFin is a user-friendly app for tracking daily profits, expenses, and transactions. Experience personalized AI-driven insights and a virtual assistant to optimize your financial decisions.",
	icons: {
		icon: "/images/logo.svg",
	},
	openGraph: {
		title: "SmartFin - AI-Powered Financial Management",
		description:
			"Easily track profits, expenses, and transactions with SmartFin. Benefit from AI-driven insights and a virtual assistant to streamline your financial management.",
		url: "https://smartfin-two.vercel.app/",
		type: "website",
		images: [
			{
				url: "/images/logo.svg",
				width: 1200,
				height: 630,
				alt: "SmartFin Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@SmartFinApp",
		title: "SmartFin - AI-Powered Financial Management & Booking App",
		description:
			"Take control of your business finances with AI-driven insights and a virtual assistant from SmartFin.",
		image: "/images/logo.svg",
	},
};

const MainDashboard = async () => {

	return (
		<>
<<<<<<< HEAD
			<DashboardPage session={session} />
			<Logout />
=======
			<DashboardPage />
>>>>>>> 44ed9b5 (authentication aand dashboard options done)
		</>
	);
};

export default MainDashboard;
