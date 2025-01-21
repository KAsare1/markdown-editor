import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Split from "react-split";
import { io } from "socket.io-client";
import axios from "axios";
import "../styles.css";

const API_URL = "https://md-editor-server-uvps.onrender.com";

const MarkdownEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [markdown, setMarkdown] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [collaboratorCount, setCollaboratorCount] = useState<number>(1);
  const [collaboratorEmail, setCollaboratorEmail] = useState<string>(""); // New state for the email input
  const token = localStorage.getItem("authToken");

  // Initialize socket connection and fetch document
  useEffect(() => {
    const socketConnection = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up socket event handlers
    socketConnection.on("connect", () => {
      console.log("Connected to server");
      socketConnection.emit("joinDocument", documentId);
    });

    socketConnection.on("markdownUpdated", ({ content, sender }) => {
      if (sender !== socketConnection.id) {
        setMarkdown(content);
      }
    });

    socketConnection.on("collaboratorUpdate", ({ count }) => {
      setCollaboratorCount(count);
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Fetch initial document content
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/documents/${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMarkdown(response.data.content || "");
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
    setSocket(socketConnection);

    // Cleanup function
    return () => {
      socketConnection.disconnect();
    };
  }, [documentId, token]);

  // Auto-save document changes
  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (!markdown || !socket) return;

      try {
        await axios.put(
          `${API_URL}/api/documents/${documentId}`,
          { content: markdown },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [markdown, documentId, token, socket]);

  // Handle markdown content changes
  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    setMarkdown(newContent);

    if (socket) {
      socket.emit("updateMarkdown", documentId, {
        content: newContent,
        timestamp: new Date().toISOString()
      });
      socket.emit("typing", documentId);
    }
  }, [socket, documentId]);

  // Handle inviting collaborators
  const inviteCollaborator = async () => {
    try {
      if (!collaboratorEmail.trim()) {
        alert("Please enter a valid email address.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/documents/${documentId}/invite`,
        { collaboratorEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Collaborator invited successfully.");
      setCollaboratorEmail(""); // Clear the input field
    } catch (error: any) {
      console.error("Error inviting collaborator:", error);
      alert(
        error.response?.data?.message || "An error occurred while inviting the collaborator."
      );
    }
  };

  return (
    <div className="app-container">
      {collaboratorCount > 1 && (
        <div className="text-sm text-gray-500 p-2">
          {collaboratorCount - 1} other {collaboratorCount - 1 === 1 ? "person" : "people"} viewing
        </div>
      )}

      <div className="invite-collaborator">
        <input
          type="email"
          value={collaboratorEmail}
          onChange={(e) => setCollaboratorEmail(e.target.value)}
          placeholder="Enter collaborator's email"
          className="collaborator-input"
        />
        <button onClick={inviteCollaborator} className="invite-button">
          Invite Collaborator
        </button>
      </div>

      <Split
        className="split-container"
        sizes={[50, 50]}
        minSize={200}
        gutterSize={10}
      >
        <div className="editor-pane">
          <textarea
            value={markdown}
            onChange={handleChange}
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="preview-pane">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </Split>
    </div>
  );
};

export default MarkdownEditor;
