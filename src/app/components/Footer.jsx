// components/Footer.js
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-50 py-8 md:py-12">
			<div className="container mx-auto px-8 md:flex md:justify-between md:items-start">
				{/* Logo and Description */}
				<div className="mb-8 md:mb-0 md:w-1/4">
					<div className="flex items-center space-x-2 mb-2">
						<Image
							src="/images/logo.svg"
							alt="SmartFin Logo"
							width={32}
							height={32}
						/>
						<h2 className="text-xl font-bold text-indigo-600">SmartFin</h2>
					</div>
					<p className="text-gray-600">
						A more productive, efficient, and faster way to work with your
						finances.
					</p>
				</div>

				{/* Product Links */}
				<div className="mb-8 md:mb-0 md:w-1/4">
					<h3 className="text-gray-800 font-semibold mb-4">Product</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="#record-keeping"
								className="text-gray-600 hover:text-indigo-600"
							>
								Record Keeping
							</Link>
						</li>
						<li>
							<Link
								href="#inventory-management"
								className="text-gray-600 hover:text-indigo-600"
							>
								Inventory Management
							</Link>
						</li>
						<li>
							<Link href="#pos" className="text-gray-600 hover:text-indigo-600">
								Point of Sale
							</Link>
						</li>
						<li>
							<Link
								href="#invoicing"
								className="text-gray-600 hover:text-indigo-600"
							>
								Invoicing
							</Link>
						</li>
					</ul>
				</div>

				{/* Legal Links */}
				<div className="mb-8 md:mb-0 md:w-1/4">
					<h3 className="text-gray-800 font-semibold mb-4">Legal</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="#terms"
								className="text-gray-600 hover:text-indigo-600"
							>
								Terms & Conditions
							</Link>
						</li>
						<li>
							<Link
								href="#privacy"
								className="text-gray-600 hover:text-indigo-600"
							>
								Privacy Policy
							</Link>
						</li>
					</ul>
				</div>

				{/* Blog Link */}
				<div className="md:w-1/4">
					<h3 className="text-gray-800 font-semibold mb-4">Blog</h3>
					<p className="text-gray-600 mb-4">
						Our blog section is a hub for expert analysis, informative articles,
						and thought-provoking discussions on the most pressing topics in the
						industry.
					</p>
					<Link href="#blog" className="text-indigo-600 hover:underline">
						View more
					</Link>
				</div>
			</div>

			{/* Copyright */}
			<div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-600 text-sm">
				&copy; {currentYear} SmartFin Inc. All Rights Reserved.
			</div>
		</footer>
	);
}
