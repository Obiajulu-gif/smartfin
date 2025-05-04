import Image from "next/image";
import Hero from "./components/Hero";
import Features from "./components/Feature";
import FeatureSections from "./components/FeatureSections";
import Testimonials from "./components/Testimonial";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
export const metadata = {
	title: "SmartFin - AI-Powered Financial Management & Booking App",
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

export default function Home() {
	return (
		<main>
				<Hero />
				<Features />
				<FeatureSections />
				<Pricing />
				<Testimonials />
				<FaqSection />
				<Footer />
		</main>
	);
}
