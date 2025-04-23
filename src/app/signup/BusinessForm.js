// components/BusinessForm.js

import Link from "next/link";

const BusinessForm = ({ onContinue }) => (
	<div className="w-full max-w-md mx-auto p-2 bg-white rounded-lg">
		<h2 className="text-2xl font-bold mb-2 text-center">Business Name</h2>
		<p className="text-gray-600 mb-6 text-center">
			Create a business name to get your business ready for recording
		</p>

		<form
			className="w-full space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				onContinue();
			}}
		>
			<input
				type="text"
				placeholder="Business Name"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<input
				type="email"
				placeholder="Business Email"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<input
				type="text"
				placeholder="Business Type"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<input
				type="text"
				placeholder="State"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<input
				type="password"
				placeholder="Password"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<input
				type="password"
				placeholder="Confirm Password"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<button
				type="submit"
				className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors"
			>
				Continue
			</button>
		</form>
	</div>
);

export default BusinessForm;
