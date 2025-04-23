"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import { 
	FaBox, FaPlus, FaSearch, FaFilter, FaSortAmountDown, 
	FaSortAmountUp, FaEdit, FaTrash, FaChartLine, FaTag,
	FaExclamationTriangle, FaBarcode, FaBoxOpen, FaMoneyBillWave,
	FaShoppingCart, FaAngleDown, FaLayerGroup
} from "react-icons/fa";
import { 
	BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
	XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [viewMode, setViewMode] = useState("grid");
	const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
	const [inventoryStats, setInventoryStats] = useState({});
	const [productCategories, setProductCategories] = useState([]);
	const [activeTab, setActiveTab] = useState("all");
	const [salesData, setSalesData] = useState([]);
	
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
	
	// Fetch products
	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				const userId = localStorage.getItem("localId");
				if (!userId) {
					setError("User not authenticated. Please log in to continue.");
					setIsLoading(false);
					return;
				}

				const response = await fetch(`/api/products?userId=${userId}`);
				const data = await response.json();
				
				if (!response.ok) throw new Error(data.message || data.error || response.statusText);
				
				// Add some mock financial metrics (this would ideally come from your API)
				const processedProducts = data.map(product => ({
					...product,
					totalSales: Math.floor(Math.random() * 50) * 10,
					revenue: Math.floor(Math.random() * 1000) * 100,
					profit: Math.floor(Math.random() * 500) * 100,
					costPrice: product.price ? (product.price * 0.6).toFixed(2) : 0,
					profitMargin: Math.floor(Math.random() * 40) + 10, // 10-50%
					stockLevel: Math.floor(Math.random() * 100),
					reorderPoint: 15,
					lastRestockDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
				}));
				
				// Extract unique categories
				const categories = [...new Set(processedProducts.map(p => p.category).filter(Boolean))];
				setProductCategories(categories);
				
				setProducts(processedProducts);
				setFilteredProducts(processedProducts);
				
				// Generate mock sales data
				const mockSalesData = [];
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
				
				months.forEach(month => {
					mockSalesData.push({
						name: month,
						sales: Math.floor(Math.random() * 5000) + 1000,
						profit: Math.floor(Math.random() * 2500) + 500,
					});
				});
				
				setSalesData(mockSalesData);
				
				// Calculate inventory stats
				const stats = {
					totalProducts: processedProducts.length,
					totalValue: processedProducts.reduce((sum, product) => sum + (parseFloat(product.price || 0) * (product.stockLevel || 0)), 0),
					lowStock: processedProducts.filter(p => (p.stockLevel || 0) <= (p.reorderPoint || 10)).length,
					outOfStock: processedProducts.filter(p => (p.stockLevel || 0) === 0).length,
					categories: categories.length,
					topProduct: processedProducts.sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0] || null,
					totalRevenue: processedProducts.reduce((sum, product) => sum + (product.revenue || 0), 0),
					totalProfit: processedProducts.reduce((sum, product) => sum + (product.profit || 0), 0),
				};
				
				setInventoryStats(stats);
				setIsLoading(false);
			} catch (err) {
				console.error("Error fetching products:", err);
				setError(`Failed to load products: ${err.message}`);
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// Filter and sort products
	useEffect(() => {
		let result = [...products];
		
		// Filter by category
		if (categoryFilter !== "all") {
			result = result.filter(product => product.category === categoryFilter);
		}
		
		// Filter by active tab
		if (activeTab === "low-stock") {
			result = result.filter(product => (product.stockLevel || 0) <= (product.reorderPoint || 10) && (product.stockLevel || 0) > 0);
		} else if (activeTab === "out-of-stock") {
			result = result.filter(product => (product.stockLevel || 0) === 0);
		} else if (activeTab === "best-selling") {
			result = result.sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0)).slice(0, 20);
		}
		
		// Filter by search term
		if (searchTerm) {
			const lowercasedSearch = searchTerm.toLowerCase();
			result = result.filter(product => 
				product.name?.toLowerCase().includes(lowercasedSearch) || 
				product.description?.toLowerCase().includes(lowercasedSearch) ||
				product.category?.toLowerCase().includes(lowercasedSearch) ||
				(product.sku && product.sku.toLowerCase().includes(lowercasedSearch))
			);
		}
		
		// Sort products
		if (sortConfig.key) {
			result.sort((a, b) => {
				let aValue = a[sortConfig.key] || 0;
				let bValue = b[sortConfig.key] || 0;
				
				// Handle string values
				if (typeof aValue === 'string') aValue = aValue.toLowerCase();
				if (typeof bValue === 'string') bValue = bValue.toLowerCase();
				
				if (aValue < bValue) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}
		
		setFilteredProducts(result);
	}, [products, searchTerm, categoryFilter, sortConfig, activeTab]);
	
	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key) {
			direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
		}
		setSortConfig({ key, direction });
	};
	
	// Prepare category data for pie chart
	const prepareCategoryData = () => {
		const categoryCount = {};
		products.forEach(product => {
			const category = product.category || 'Uncategorized';
			categoryCount[category] = (categoryCount[category] || 0) + 1;
		});
		
		return Object.entries(categoryCount)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Products & Inventory</h1>
					<p className="text-gray-600">Manage your products, monitor inventory, and track sales performance</p>
				</div>
				
				<Link href="/dashboard/products/new">
					<button className="mt-4 md:mt-0 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300">
						<FaPlus className="mr-2" /> Add New Product
					</button>
				</Link>
			</div>
			
			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">TOTAL PRODUCTS</p>
							<p className="text-2xl font-bold text-gray-800">{inventoryStats.totalProducts || 0}</p>
						</div>
						<div className="bg-indigo-100 p-3 rounded-full">
							<FaBox className="text-indigo-500" />
						</div>
					</div>
				</div>
				
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">INVENTORY VALUE</p>
							<p className="text-2xl font-bold text-gray-800">₦{(inventoryStats.totalValue || 0).toLocaleString('en-NG')}</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<FaMoneyBillWave className="text-green-500" />
						</div>
					</div>
				</div>
				
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">LOW STOCK ITEMS</p>
							<p className="text-2xl font-bold text-gray-800">{inventoryStats.lowStock || 0}</p>
						</div>
						<div className="bg-yellow-100 p-3 rounded-full">
							<FaExclamationTriangle className="text-yellow-500" />
						</div>
					</div>
				</div>
				
				<div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm font-medium text-gray-500">TOTAL REVENUE</p>
							<p className="text-2xl font-bold text-gray-800">₦{(inventoryStats.totalRevenue || 0).toLocaleString('en-NG')}</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<FaChartLine className="text-blue-500" />
						</div>
					</div>
				</div>
			</div>
			
			{/* Dashboard Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				{/* Sales Trends */}
				<div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Performance</h2>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={salesData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip formatter={(value) => `₦${value.toLocaleString('en-NG')}`} />
								<Legend />
								<Bar dataKey="sales" name="Sales Revenue" fill="#8884d8" />
								<Bar dataKey="profit" name="Profit" fill="#82ca9d" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				
				{/* Category Breakdown */}
				<div className="bg-white p-4 rounded-lg shadow">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">Product Categories</h2>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={prepareCategoryData()}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{prepareCategoryData().map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
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
							All Products
						</button>
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'low-stock' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('low-stock')}
						>
							Low Stock
						</button>
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'out-of-stock' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('out-of-stock')}
						>
							Out of Stock
						</button>
						<button 
							className={`px-4 py-2 whitespace-nowrap font-medium ${activeTab === 'best-selling' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
							onClick={() => setActiveTab('best-selling')}
						>
							Best Selling
						</button>
					</div>
					
					{/* Search & Filters */}
					<div className="flex flex-col sm:flex-row gap-2">
						<div className="relative">
					<input
						type="text"
								className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
								placeholder="Search products..."
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
								value={categoryFilter}
								onChange={(e) => setCategoryFilter(e.target.value)}
							>
								<option value="all">All Categories</option>
								{productCategories.map(category => (
									<option key={category} value={category}>{category}</option>
								))}
							</select>
							<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
								<FaTag className="text-gray-400" />
							</div>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<FaAngleDown className="text-gray-400" />
							</div>
						</div>
						
						<div className="flex">
							<button 
								className={`p-2 border border-r-0 rounded-l-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
								onClick={() => setViewMode('grid')}
							>
								<FaLayerGroup />
							</button>
							<button 
								className={`p-2 border rounded-r-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
								onClick={() => setViewMode('list')}
							>
								<FaList />
							</button>
						</div>
						
					<button
							className="flex items-center justify-center px-4 py-2 border rounded-md bg-white"
							onClick={() => handleSort(sortConfig.key === 'price' && sortConfig.direction === 'asc' ? { key: 'price', direction: 'desc' } : { key: 'price', direction: 'asc' })}
					>
							{sortConfig.key === 'price' && sortConfig.direction === 'asc' ? (
								<FaSortAmountUp className="mr-2 text-gray-600" />
						) : (
								<FaSortAmountDown className="mr-2 text-gray-600" />
						)}
							<span>Price</span>
					</button>
					</div>
				</div>
			</div>

			{/* Loading and Error States */}
			{isLoading && (
				<div className="text-center p-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading products...</p>
				</div>
			)}
			
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
					<p>{error}</p>
				</div>
			)}
			
			{/* Products Display */}
			{!isLoading && !error && (
				<>
					{filteredProducts.length > 0 ? (
						viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{filteredProducts.map((product) => (
									<div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
										<div className="relative h-48 mb-4">
											<Image
												src={product.imageUrl || '/images/default-product.jpg'}
												alt={product.name}
												fill
												className="object-cover rounded-t-lg"
											/>
										</div>
										<div className="p-4">
											<div className="flex justify-between items-start">
												<h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
												{(product.stockLevel || 0) <= (product.reorderPoint || 10) && (
													<span className={`px-2 py-1 text-xs rounded-full ${product.stockLevel === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
														{product.stockLevel === 0 ? 'Out of Stock' : 'Low Stock'}
													</span>
												)}
											</div>
											<p className="text-gray-600 text-sm mt-1 truncate">{product.description}</p>
											<div className="mt-3 flex justify-between items-center">
												<span className="text-xl font-bold text-gray-800">₦{parseFloat(product.price).toLocaleString('en-NG')}</span>
												<span className="text-sm text-gray-500">Stock: {product.stockLevel || 0}</span>
											</div>
											<div className="mt-2 text-sm text-gray-600">
												<div className="flex items-center">
													<FaTag className="mr-1" /> 
													<span>{product.category || 'Uncategorized'}</span>
												</div>
												<div className="flex items-center mt-1">
													<FaBarcode className="mr-1" /> 
													<span>{product.sku || 'No SKU'}</span>
												</div>
											</div>
											<div className="mt-3 pt-3 border-t">
												<div className="flex justify-between items-center">
													<div className="text-sm">
														<span className="font-medium">Profit:</span> 
														<span className="text-green-600 ml-1">₦{(product.profit || 0).toLocaleString('en-NG')}</span>
													</div>
													<div className="text-sm">
														<span className="font-medium">Margin:</span> 
														<span className={`ml-1 ${(product.profitMargin || 0) > 30 ? 'text-green-600' : 'text-orange-600'}`}>
															{product.profitMargin || 0}%
														</span>
													</div>
												</div>
											</div>
											<div className="mt-4 flex space-x-2">
												<button className="flex-1 py-2 px-3 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
													Edit
												</button>
												<button className="py-2 px-3 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
													<FaShoppingCart />
												</button>
												<button className="py-2 px-3 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
													<FaBoxOpen />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-white rounded-lg shadow overflow-hidden">
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
													<div className="flex items-center">
														Product Name
														{sortConfig.key === 'name' && (
															sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
														)}
													</div>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
													<div className="flex items-center">
														Category
														{sortConfig.key === 'category' && (
															sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
														)}
													</div>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
													<div className="flex items-center">
														Price
														{sortConfig.key === 'price' && (
															sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
														)}
													</div>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stockLevel')}>
													<div className="flex items-center">
														Stock
														{sortConfig.key === 'stockLevel' && (
															sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
														)}
													</div>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalSales')}>
													<div className="flex items-center">
														Sales
														{sortConfig.key === 'totalSales' && (
															sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
														)}
													</div>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('profitMargin')}>
													<div className="flex items-center">
														Margin
														{sortConfig.key === 'profitMargin' && (
															sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
														)}
													</div>
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{filteredProducts.map((product) => (
												<tr key={product.id} className="hover:bg-gray-50">
													<td className="px-6 py-4">
														<div className="flex items-center">
															<div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
																<Image
																	src={product.imageUrl || '/images/default-product.jpg'}
																	alt={product.name}
																	width={40}
																	height={40}
																	className="h-10 w-10 rounded-md object-cover"
																/>
															</div>
															<div className="ml-4">
																<div className="text-sm font-medium text-gray-900">{product.name}</div>
																<div className="text-sm text-gray-500">{product.sku || 'No SKU'}</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="text-sm text-gray-900">{product.category || 'Uncategorized'}</div>
													</td>
													<td className="px-6 py-4">
														<div className="text-sm font-medium text-gray-900">₦{parseFloat(product.price).toLocaleString('en-NG')}</div>
														<div className="text-xs text-gray-500">Cost: ₦{parseFloat(product.costPrice).toLocaleString('en-NG')}</div>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-center">
															{product.stockLevel === 0 ? (
																<span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out of Stock</span>
															) : (product.stockLevel || 0) <= (product.reorderPoint || 10) ? (
																<span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Low: {product.stockLevel}</span>
															) : (
																<span className="text-sm text-gray-900">{product.stockLevel}</span>
															)}
								</div>
													</td>
													<td className="px-6 py-4">
														<div className="text-sm text-gray-900">{product.totalSales} units</div>
														<div className="text-xs text-gray-500">₦{(product.revenue || 0).toLocaleString('en-NG')}</div>
													</td>
													<td className="px-6 py-4">
														<span className={`px-2 py-1 text-xs rounded-full ${
															(product.profitMargin || 0) > 30 ? 'bg-green-100 text-green-800' : 
															(product.profitMargin || 0) > 15 ? 'bg-blue-100 text-blue-800' : 
															'bg-orange-100 text-orange-800'
														}`}>
															{product.profitMargin || 0}%
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
														<div className="flex justify-end space-x-2">
															<button className="text-indigo-600 hover:text-indigo-900">
										<FaEdit />
									</button>
															<button className="text-red-600 hover:text-red-900">
																<FaTrash />
															</button>
															<button className="text-green-600 hover:text-green-900">
																<FaChartLine />
															</button>
															<button className="text-yellow-600 hover:text-yellow-900">
																<FaBoxOpen />
									</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)
					) : (
						<div className="text-center py-8 bg-white rounded-lg shadow">
							<FaBox className="mx-auto text-gray-300 text-4xl mb-4" />
							<h3 className="text-lg font-medium text-gray-900">No products found</h3>
							<p className="text-gray-500 mt-1">Try adjusting your search criteria or add new products.</p>
							<Link href="/dashboard/products/new">
								<button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
									<FaPlus className="mr-2" /> Add New Product
								</button>
							</Link>
						</div>
					)}
				</>
			)}
		</div>
	);
}

const FaList = ({ className }) => (
	<svg 
		className={className} 
		fill="currentColor" 
		viewBox="0 0 512 512"
		height="1em"
		width="1em"
	>
		<path d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" />
	</svg>
);
