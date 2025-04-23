"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	FaUser, FaBuilding, FaUserTie, FaPhone, FaEnvelope, 
	FaPlus, FaFilter, FaSearch, FaEllipsisV, FaFileInvoiceDollar,
	FaTrash, FaEdit, FaChartLine, FaSort, FaSortUp, FaSortDown 
} from "react-icons/fa";

export default function ContactsPage() {
	const [contacts, setContacts] = useState([]);
	const [filteredContacts, setFilteredContacts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
	const [contactStats, setContactStats] = useState({});
	const [activeTab, setActiveTab] = useState("all");

	// Fetch contacts
	useEffect(() => {
	const fetchContacts = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				const userId = localStorage.getItem("localId");
			if (!userId) {
					setError("User not authenticated. Please log in to continue.");
					setIsLoading(false);
				return;
			}
			
				const response = await fetch(`/api/contacts?userId=${userId}`);
				const data = await response.json();
				
				if (!response.ok) throw new Error(data.message || data.error || response.statusText);
				
				// Add some financial metrics to contacts (this would ideally come from your API)
				const processedContacts = data.map(contact => ({
					...contact,
					totalTransactions: Math.floor(Math.random() * 20),
					outstandingBalance: Math.floor(Math.random() * 1000) * 100,
					lastActivityDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
					revenueGenerated: contact.type === 'client' ? Math.floor(Math.random() * 5000) * 100 : 0,
					expenseAmount: contact.type === 'supplier' ? Math.floor(Math.random() * 3000) * 100 : 0,
				}));
				
				setContacts(processedContacts);
				setFilteredContacts(processedContacts);
				
				// Calculate stats
				const stats = {
					total: processedContacts.length,
					clients: processedContacts.filter(c => c.type?.toLowerCase() === 'client').length,
					suppliers: processedContacts.filter(c => c.type?.toLowerCase() === 'supplier').length,
					others: processedContacts.filter(c => c.type?.toLowerCase() !== 'client' && c.type?.toLowerCase() !== 'supplier').length,
					revenueGenerated: processedContacts.reduce((sum, contact) => sum + (contact.revenueGenerated || 0), 0),
					totalExpenses: processedContacts.reduce((sum, contact) => sum + (contact.expenseAmount || 0), 0),
				};
				
				setContactStats(stats);
				setIsLoading(false);
		} catch (err) {
			console.error("Error fetching contacts:", err);
				setError(`Failed to load contacts: ${err.message}`);
				setIsLoading(false);
			}
		};
		
		fetchContacts();
	}, []);
	
	// Filter and sort contacts
	useEffect(() => {
		let result = [...contacts];
		
		// Filter by type
		if (filterType !== "all") {
			result = result.filter(contact => 
				contact.type?.toLowerCase() === filterType.toLowerCase()
			);
		}
		
		// Filter by tab
		if (activeTab === "clients") {
			result = result.filter(contact => contact.type?.toLowerCase() === 'client');
		} else if (activeTab === "suppliers") {
			result = result.filter(contact => contact.type?.toLowerCase() === 'supplier');
		} else if (activeTab === "outstanding") {
			result = result.filter(contact => (contact.outstandingBalance || 0) > 0);
		}
		
		// Filter by search term
		if (searchTerm) {
			const lowercasedSearch = searchTerm.toLowerCase();
			result = result.filter(contact => 
				contact.name?.toLowerCase().includes(lowercasedSearch) || 
				contact.email?.toLowerCase().includes(lowercasedSearch) ||
				contact.phone?.toLowerCase().includes(lowercasedSearch) ||
				contact.company?.toLowerCase().includes(lowercasedSearch)
			);
		}
		
		// Sort contacts
		if (sortConfig.key) {
			result.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
		
		setFilteredContacts(result);
	}, [contacts, searchTerm, filterType, sortConfig, activeTab]);
	
	const handleSort = (key) => {
		let direction = 'ascending';
		if (sortConfig.key === key) {
			direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
		}
		setSortConfig({ key, direction });
	};
	
	const getSortIcon = (key) => {
		if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
		return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1 text-indigo-600" /> : <FaSortDown className="ml-1 text-indigo-600" />;
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Contacts</h1>
					<p className="text-gray-600">Manage your clients, suppliers, and business relationships</p>
				</div>
				
				<Link href="/dashboard/contacts/new">
					<button className="mt-4 md:mt-0 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300">
						<FaPlus className="mr-2" /> Add New Contact
					</button>
				</Link>
			</div>
			
			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">TOTAL CONTACTS</p>
							<p className="text-2xl font-bold text-gray-800">{contactStats.total || 0}</p>
						</div>
						<div className="bg-indigo-100 p-3 rounded-full">
							<FaUser className="text-indigo-500" />
						</div>
					</div>
				</div>
				
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">CLIENTS</p>
							<p className="text-2xl font-bold text-gray-800">{contactStats.clients || 0}</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<FaUserTie className="text-green-500" />
						</div>
					</div>
				</div>
				
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">REVENUE GENERATED</p>
							<p className="text-2xl font-bold text-gray-800">₦{(contactStats.revenueGenerated || 0).toLocaleString('en-NG')}</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<FaChartLine className="text-blue-500" />
						</div>
					</div>
				</div>
				
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">SUPPLIERS</p>
							<p className="text-2xl font-bold text-gray-800">{contactStats.suppliers || 0}</p>
						</div>
						<div className="bg-yellow-100 p-3 rounded-full">
							<FaBuilding className="text-yellow-500" />
						</div>
					</div>
				</div>
			</div>
			
			{/* Filter & Search */}
			<div className="bg-white p-4 rounded-lg shadow mb-6">
				<div className="flex flex-col md:flex-row justify-between mb-4">
					{/* Tabs */}
					<div className="flex space-x-4 overflow-x-auto pb-2 mb-4 md:mb-0">
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('all')}
						>
							All Contacts
						</button>
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'clients' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('clients')}
						>
							Clients
						</button>
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'suppliers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('suppliers')}
						>
							Suppliers
						</button>
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'outstanding' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('outstanding')}
						>
							Outstanding Balance
						</button>
					</div>
					
					{/* Search & Filter */}
					<div className="flex flex-col sm:flex-row gap-2">
						<div className="relative">
							<input
								type="text"
								className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
								placeholder="Search contacts..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
								<FaSearch className="text-gray-400" />
							</div>
						</div>
						
						<div className="relative">
							<select
								className="appearance-none pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
							>
								<option value="all">All Types</option>
								<option value="client">Clients</option>
								<option value="supplier">Suppliers</option>
								<option value="other">Others</option>
							</select>
							<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
								<FaFilter className="text-gray-400" />
							</div>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			{/* Loading and Error States */}
			{isLoading && (
				<div className="text-center p-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading contacts...</p>
				</div>
			)}
			
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
					<p>{error}</p>
				</div>
			)}

			{/* Contacts Table */}
			{!isLoading && !error && (
				<div className="bg-white rounded-lg shadow overflow-hidden">
					{filteredContacts.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
											<div className="flex items-center">
												Name
												{getSortIcon('name')}
											</div>
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('type')}>
											<div className="flex items-center">
												Type
												{getSortIcon('type')}
											</div>
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Contact Info
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('outstandingBalance')}>
											<div className="flex items-center">
												Financial
												{getSortIcon('outstandingBalance')}
											</div>
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lastActivityDate')}>
											<div className="flex items-center">
												Last Activity
												{getSortIcon('lastActivityDate')}
											</div>
										</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredContacts.map((contact) => (
										<tr key={contact.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
														{contact.type?.toLowerCase() === 'client' ? (
															<FaUserTie className="text-indigo-600" />
														) : contact.type?.toLowerCase() === 'supplier' ? (
															<FaBuilding className="text-indigo-600" />
														) : (
															<FaUser className="text-indigo-600" />
														)}
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900">{contact.name}</div>
														<div className="text-sm text-gray-500">{contact.company}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
													${contact.type?.toLowerCase() === 'client' ? 'bg-green-100 text-green-800' : 
														contact.type?.toLowerCase() === 'supplier' ? 'bg-yellow-100 text-yellow-800' : 
														'bg-gray-100 text-gray-800'}`}>
													{contact.type || 'Unknown'}
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="text-sm text-gray-900 flex items-center mb-1">
													<FaEnvelope className="text-gray-400 mr-2" />
													{contact.email || 'N/A'}
												</div>
												<div className="text-sm text-gray-900 flex items-center">
													<FaPhone className="text-gray-400 mr-2" />
													{contact.phone || 'N/A'}
			</div>
											</td>
											<td className="px-6 py-4">
												{contact.type?.toLowerCase() === 'client' ? (
													<>
														<div className="text-sm text-gray-900">Revenue: ₦{(contact.revenueGenerated || 0).toLocaleString('en-NG')}</div>
														<div className={`text-sm ${contact.outstandingBalance > 0 ? 'text-red-600' : 'text-gray-500'}`}>
															Outstanding: ₦{(contact.outstandingBalance || 0).toLocaleString('en-NG')}
					</div>
													</>
												) : contact.type?.toLowerCase() === 'supplier' ? (
													<>
														<div className="text-sm text-gray-900">Expenses: ₦{(contact.expenseAmount || 0).toLocaleString('en-NG')}</div>
														<div className="text-sm text-gray-500">Transactions: {contact.totalTransactions || 0}</div>
													</>
												) : (
													<div className="text-sm text-gray-500">No financial data</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{contact.lastActivityDate || 'Never'}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<div className="flex justify-end">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
										<FaEdit />
									</button>
													<button className="text-red-600 hover:text-red-900 mr-3">
														<FaTrash />
													</button>
													<button className="text-green-600 hover:text-green-900 mr-3">
														<FaFileInvoiceDollar />
													</button>
													<div className="relative group">
														<button className="text-gray-500 hover:text-gray-900">
															<FaEllipsisV />
									</button>
														<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
															<Link href={`/dashboard/contacts/${contact.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Details</Link>
															<Link href={`/dashboard/transactions/new?contact=${contact.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">New Transaction</Link>
															<button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Statement</button>
														</div>
													</div>
								</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="text-center py-8">
							<FaUser className="mx-auto text-gray-300 text-4xl mb-4" />
							<h3 className="text-lg font-medium text-gray-900">No contacts found</h3>
							<p className="text-gray-500 mt-1">Try adjusting your search criteria or add new contacts.</p>
							<Link href="/dashboard/contacts/new">
								<button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
									<FaPlus className="mr-2" /> Add New Contact
								</button>
							</Link>
						</div>
				)}
			</div>
			)}
		</div>
	);
}
