// // CollaboratorsPanel.tsx
// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const CollaboratorsPanel: React.FC<{ docId: string }> = ({ docId }) => {
//   const [collaborators, setCollaborators] = useState<any[]>([]);
//   const [socket, setSocket] = useState<any>(null);

//   useEffect(() => {
//     // Set up Socket.IO connection for real-time presence updates
//     const socketConnection = io("http://localhost:5000");

//     socketConnection.emit("joinDocument", docId); // Emit the document ID to the server

//     // Listen for 'newCollaborator' event
//     socketConnection.on("newCollaborator", (collaborator: any) => {
//       setCollaborators((prevState) => [...prevState, collaborator]);
//     });

//     // Listen for 'removeCollaborator' event
//     socketConnection.on("removeCollaborator", (collaboratorId: string) => {
//       setCollaborators((prevState) =>
//         prevState.filter((collab) => collab.id !== collaboratorId)
//       );
//     });

//     // Cleanup socket connection on component unmount
//     return () => {
//       socketConnection.disconnect();
//     };
//   }, [docId]);

//   return (
//     <div className="collaborators-panel">
//       <h3>Collaborators</h3>
//       <ul>
//         {collaborators.map((collaborator) => (
//           <li key={collaborator.id}>
//             {collaborator.name} {collaborator.isTyping && "(Typing...)"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CollaboratorsPanel;
