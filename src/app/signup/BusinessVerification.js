// eslint-disable-next-line react/no-unescaped-entities
"use client";
import { useState } from "react";

const BusinessVerification = ({ onContinue }) => {
	const [selectedOption, setSelectedOption] = useState(
		"Certificate of Company Registration"
	);

	const handleOptionChange = (event) => {
		setSelectedOption(event.target.value);
	};

	return (
		<div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg">
			<h2 className="text-2xl font-bold mb-2 text-center">
				Business verification
			</h2>
			<p className="text-gray-600 mb-6 text-center">
				We ensure recorder who choose to record on our platform are verified for
				safety reasons
			</p>

			<form
				className="w-full space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					onContinue();
				}}
			>
				<div className="space-y-2">
					<label className="w-full p-3 border border-gray-300 rounded-lg flex items-center hover:border-indigo-900 transition-colors">
						<input
							type="radio"
							value="Personal Recording"
							checked={selectedOption === "Personal Recording"}
							onChange={handleOptionChange}
							className="mr-2"
						/>
						Personal Recording
					</label>

					<label className="w-full p-3 border border-gray-300 rounded-lg flex items-center hover:border-indigo-800 transition-colors">
						<input
							type="radio"
							value="Small Business"
							checked={selectedOption === "Small Business"}
							onChange={handleOptionChange}
							className="mr-2"
						/>
						Small Business
					</label>

					<label className="w-full p-3 border border-gray-300 rounded-lg flex items-center hover:border-indigo-700 transition-colors">
						<input
							type="radio"
							value="Enterprise"
							checked={selectedOption === "Enterprise"}
							onChange={handleOptionChange}
							className="mr-2"
						/>
						Enterprise
					</label>

					<label className="w-full p-3 border border-gray-300 rounded-lg flex items-center hover:border-indigo-600 transition-colors">
						<input
							type="radio"
							value="Organisation Recording"
							checked={selectedOption === "Organisation Recording"}
							onChange={handleOptionChange}
							className="mr-2"
						/>
						Organisation Recording
					</label>
				</div>

				<button
					type="button"
					onClick={onContinue}
					className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-800 transition-colors mt-4"
				>
					Continue
				</button>
			</form>
		</div>
	);
};

export default BusinessVerification;
