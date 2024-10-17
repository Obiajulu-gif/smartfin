import React from "react";
import DashboardPage from "./DashboardPage";
import { auth } from '../auth';
import { getServerSession } from 'next-auth';
import authOptions from '../auth'; // Import auth options
import { redirect } from 'next/navigation';
import Logout from '../components/Logout';


const MainDashboard = async () => {
	const session = await getServerSession(authOptions); // Use getServerSession to retrieve session

    if (!session?.user){ redirect('/login');}
	return (
		<>
			<DashboardPage />
			<Logout />
		</>
	);
};

export default MainDashboard;
