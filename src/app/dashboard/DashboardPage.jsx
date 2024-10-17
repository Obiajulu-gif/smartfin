// pages/dashboard/page.js
import Link from "next/link";
export default function DashboardPage() {
	return (
		<div className="container mx-auto p-8 ">
			<h2 className="text-2xl font-bold text-gray-800 mb-2 text-center ">
				Welcome, Emmanuel
			</h2>
			<p className="text-gray-600 mb-8 text-center">
				What would you like to do with SmartFin today?
			</p>

			{/* Transactions Card */}
			<div className="border border-gray-200 rounded-lg mb-6 shadow-sm p-6 flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">
						Transactions
					</h3>
					<h4 className="text-xl font-semibold text-gray-800">
						Record Daily Transactions
					</h4>
					<p className="text-gray-600">
						Getting insights out of your business activities with SmartFin
						starts here.
					</p>
				</div>
				<Link href="/transactions">
					<button className="px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50">
						Transact
					</button>
				</Link>
			</div>

			{/* Inventory Card */}
			<div className="border border-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">Inventory</h3>
					<h4 className="text-xl font-semibold text-gray-800">
						Know your Business
					</h4>
					<p className="text-gray-600">
						Your business is as good as your inventory; manage it best with
						SmartFin.
					</p>
				</div>
				<button className="px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50">
					Manage
				</button>
			</div>
		</div>
	);
}
