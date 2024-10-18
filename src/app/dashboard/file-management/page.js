"use client";
import { useState } from "react";
import { FaFolderOpen, FaFileAlt, FaUpload, FaTrash } from "react-icons/fa";

const FileManagementPage = () => {
	const [files, setFiles] = useState([
		{ id: 1, name: "Invoice-January.pdf", type: "PDF", size: "1.2 MB" },
		{ id: 2, name: "Receipt-February.jpg", type: "Image", size: "500 KB" },
	]);

	const handleUpload = (e) => {
		const uploadedFile = e.target.files[0];
		if (uploadedFile) {
			const newFile = {
				id: files.length + 1,
				name: uploadedFile.name,
				type: uploadedFile.type.split("/")[1].toUpperCase(),
				size: (uploadedFile.size / 1024).toFixed(2) + " KB",
			};
			setFiles([...files, newFile]);
		}
	};

	const handleDelete = (id) => {
		const updatedFiles = files.filter((file) => file.id !== id);
		setFiles(updatedFiles);
	};

	return (
		<div className="container mx-auto p-8 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">File Management</h1>
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
					<FaFolderOpen className="mr-2 text-indigo-600" /> Manage Your Documents
				</h2>

				{/* Upload Section */}
				<div className="mb-6">
					<label className="flex items-center cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
						<FaUpload className="mr-2" />
						<span>Upload File</span>
						<input type="file" className="hidden" onChange={handleUpload} />
					</label>
				</div>

				{/* File List */}
				<div className="overflow-auto">
					<table className="min-w-full bg-white border border-gray-200">
						<thead>
							<tr>
								<th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">
									File Name
								</th>
								<th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">
									Type
								</th>
								<th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">
									Size
								</th>
								<th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{files.map((file) => (
								<tr key={file.id}>
									<td className="p-3 border-b text-gray-800">{file.name}</td>
									<td className="p-3 border-b text-gray-800">{file.type}</td>
									<td className="p-3 border-b text-gray-800">{file.size}</td>
									<td className="p-3 border-b text-gray-800">
										<button
											className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center"
											onClick={() => handleDelete(file.id)}
										>
											<FaTrash className="mr-2" /> Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Empty State */}
					{files.length === 0 && (
						<p className="text-center text-gray-500 mt-6">No files uploaded yet.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default FileManagementPage;
