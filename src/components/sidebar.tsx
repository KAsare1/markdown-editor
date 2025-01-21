// // Sidebar.tsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Sidebar = ({ onDocumentSelect }) => {
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     // Fetch the user's documents
//     axios.get('/api/documents') // Replace with your endpoint
//       .then(response => setDocuments(response.data))
//       .catch(error => console.error('Error fetching documents:', error));
//   }, []);

//   const handleCreateDocument = async () => {
//     const title = prompt("Enter document title:");
//     if (title) {
//       const response = await axios.post('/api/documents', { title, content: "" });
//       setDocuments(prevDocs => [...prevDocs, response.data]);
//     }
//   };

//   return (
//     <div className="w-1/4 bg-gray-100 p-4">
//       <button onClick={handleCreateDocument} className="mb-4 p-2 bg-blue-500 text-white rounded">Create Document</button>
//       <ul>
//         {documents.map(doc => (
//           <li key={doc._id} onClick={() => onDocumentSelect(doc)} className="cursor-pointer p-2 hover:bg-gray-200">
//             {doc.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
