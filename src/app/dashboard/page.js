"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatBot from "@/components/ChatBot";

export default function Dashboard() {
	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			<div className="flex-1 overflow-auto">
				<main className="p-6">
					<h1 className="text-2xl font-semibold text-gray-800 mb-6">
						Dashboard
					</h1>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main dashboard content - takes up 2/3 of the space on large screens */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-lg shadow-md p-6 h-full">
								<h2 className="text-xl font-medium mb-4">
									Financial Overview
								</h2>
								{/* Your financial content goes here */}
								<div className="space-y-6">
									{/* Sample content */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-indigo-50 p-4 rounded-lg">
											<h3 className="text-sm font-medium text-indigo-800">
												Total Balance
											</h3>
											<p className="text-2xl font-bold text-indigo-600">
												$24,500.00
											</p>
										</div>
										<div className="bg-green-50 p-4 rounded-lg">
											<h3 className="text-sm font-medium text-green-800">
												Monthly Income
											</h3>
											<p className="text-2xl font-bold text-green-600">
												$4,200.00
											</p>
										</div>
									</div>

									<div>
										<h3 className="text-md font-medium mb-2">
											Recent Transactions
										</h3>
										<div className="border rounded-lg divide-y">
											{/* Sample transactions */}
											{[1, 2, 3].map((i) => (
												<div key={i} className="p-3 flex justify-between">
													<div>
														<p className="font-medium">Payment #{i}</p>
														<p className="text-sm text-gray-500">
															May {10 + i}, 2023
														</p>
													</div>
													<span className="text-red-600 font-medium">
														-$120.00
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Chatbot section - takes up 1/3 of the space on large screens */}
						<div className="lg:col-span-1">
							<ChatBot />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
