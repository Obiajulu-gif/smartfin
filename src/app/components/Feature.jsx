// components/Features.jsx
import { FaRobot, FaChartLine, FaUsers, FaClipboardList } from "react-icons/fa";

export default function Features() {
	return (
		<section className="bg-gradient-to-br from-gray-50 to-indigo-50 py-16 px-8 md:px-24 text-center animate-fadeIn">
			<div className="max-w-2xl mx-auto px-4 text-center">
				<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
					The only AI-powered financial management tool you’ll ever need for
					your business
				</h2>
				<p className="text-gray-600 mb-12">
					SmartFin is an all-in-one financial management platform that leverages
					artificial intelligence to help businesses track income and expenses,
					manage inventory, generate reports, and more.
				</p>
			</div>

			<div className="grid gap-8 md:grid-cols-4">
				<div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r hover:from-yellow-100 hover:to-yellow-300 transition-all duration-300">
					<div className="flex justify-center mb-4">
						<FaClipboardList className="text-4xl text-yellow-500" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900">
						Effortless Transaction Recording
					</h3>
					<p className="text-gray-600 mt-2">
						Say goodbye to manual bookkeeping. SmartFin's AI streamlines the
						process, making it a breeze to record every transaction accurately.
					</p>
				</div>
				<div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-indigo-300 transition-all duration-300">
					<div className="flex justify-center mb-4">
						<FaRobot className="text-4xl text-indigo-600" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900">
						Smart Inventory Management
					</h3>
					<p className="text-gray-600 mt-2">
						AI-driven insights make inventory management effortless. Track stock
						levels, reorder points, and trends, ensuring you’re always stocked
						and ready.
					</p>
				</div>
				<div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-300 transition-all duration-300">
					<div className="flex justify-center mb-4">
						<FaUsers className="text-4xl text-gray-900" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900">
						Manage Multiple Businesses and Staff
					</h3>
					<p className="text-gray-600 mt-2">
						Effortlessly manage multiple businesses and transactions. AI
						provides controlled access for staff, making collaboration seamless.
					</p>
				</div>
				<div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-300 transition-all duration-300">
					<div className="flex justify-center mb-4">
						<FaChartLine className="text-4xl text-purple-600" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900">
						Powerful Reporting
					</h3>
					<p className="text-gray-600 mt-2">
						Get AI-generated insights into your financial health. Make
						data-driven decisions with clear, easy-to-understand reports.
					</p>
				</div>
			</div>
		</section>
	);
}
