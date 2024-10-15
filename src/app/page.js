import Image from "next/image";
import Hero from "./components/Hero";
import Features from "./components/Feature";
import FeatureSections from "./components/FeatureSections";
import Testimonials from "./components/Testimonial";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
export const metadata = {
	title: "SmartFin - AI-Powered Financial Management & Booking App",
	description:
		"SmartFin is a user-friendly app for tracking daily profits, expenses, and transactions. Experience personalized AI-driven insights and a virtual assistant to optimize your financial decisions.",
	icons: {
		icon: "/images/logo.svg",
	},
};
export default function Home() {
	return (
		<main>
				<Hero />
				<Features />
				<FeatureSections />
				<Testimonials />
				<FaqSection />
				<Footer />
		</main>
	);
}
