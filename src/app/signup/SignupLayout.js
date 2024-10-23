// components/SignUpLayout.js
"use client";
import { useState } from "react";
import Image from "next/image";
import EmailForm from "./EmailForm.js";
import BusinessForm from "./BusinessForm.js";
import BusinessVerification from "./BusinessVerification.js";
import SuccessMessage from "./SuccessMessage";

const SignUpLayout = () => {
	const [currentStep, setCurrentStep] = useState(1);

	const renderStepComponent = () => {
		switch (currentStep) {
			case 1:
				return <EmailForm onContinue={() => setCurrentStep(2)} />;
			case 2:
				return <BusinessForm onContinue={() => setCurrentStep(3)} />;
			case 3:
				return <BusinessVerification onContinue={() => setCurrentStep(4)} />;
			case 4:
				return <SuccessMessage />;

			default:
				return <EmailForm onContinue={() => setCurrentStep(2)} />;
		}
	};

	return (
		<div className="flex flex-col lg:flex-row items-center justify-center h-screen ">
			{/* Form Section */}
			<div className="lg:w-1/2 bg-white p-8 rounded-lg  flex flex-col items-center lg:mx-8 max-w-md lg:max-w-none lg:flex-1">
				{renderStepComponent()}
			</div>

			{/* Persistent Image Section */}
			<div className="hidden lg:flex w-1/2 items-center justify-center">
				<Image
					src="/images/hero.png"
					alt="Sign Up"
					width={1000}
					height={1500}
					className="rounded-lg shadow-lg "
					priority
					quality={100}
				/>
			</div>
		</div>
	);
};

export default SignUpLayout;
