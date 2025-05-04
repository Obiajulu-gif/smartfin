// components/FaqSection.js
"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function FaqSection() {
	const [openIndex, setOpenIndex] = useState(null);

	const faqs = [
		{
			question: "What is SmartFin, and how does it benefit my business?",
			answer:
				"SmartFin is a financial management app designed to help businesses track income, expenses, and make informed decisions based on real-time data. It provides tools for invoicing, expense tracking, and comprehensive financial reporting.",
		},
		{
			question: "Is my financial data secure with SmartFin?",
			answer:
				"Yes, SmartFin uses top-notch security measures, including encryption and secure access controls, to ensure that your financial data is safe and protected.",
		},
		{
			question: "Can I manage multiple businesses with one SmartFin account?",
			answer:
				"Absolutely! SmartFin supports multiple businesses, allowing you to manage each one within a single account with seamless navigation and tracking.",
		},
		{
			question: "Does SmartFin offer customer support if I need help?",
			answer:
				"Yes, SmartFin offers various support options, including live chat, email support, and a help center with comprehensive documentation and tutorials.",
		},
		{
			question: "Can I control the access of my staff to specific data?",
			answer:
				"Yes, SmartFin allows you to set custom permissions for your staff, enabling them to access only the data they need without compromising sensitive financial information.",
		},
	];

	const toggleFaq = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	// Add gradient background and smooth accordion animations
	return (
		<section className="bg-gradient-to-br from-gray-50 to-indigo-50 py-16 px-8 md:px-24">
			<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
				Frequently Asked Questions
			</h2>
			<div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
				{faqs.map((faq, index) => (
					<div key={index} className="border-b border-gray-200">
						<button
							onClick={() => toggleFaq(index)}
							className="w-full py-4 text-left flex items-center justify-between bg-white text-gray-900 font-medium hover:text-indigo-600 focus:outline-none transition-all duration-300 ease-in-out"
						>
							<span>{faq.question}</span>
							{openIndex === index ? (
								<FaChevronDown className="text-gray-600" />
							) : (
								<FaChevronRight className="text-gray-600" />
							)}
						</button>
						{openIndex === index && (
							<div className="p-4 text-gray-700 bg-gray-50 transition-all duration-300 ease-in-out">
								{faq.answer}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
