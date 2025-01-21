import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../homeStyles.css";

interface Document {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  collaborators: string[];
}

const HomePage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchDocuments();

    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError('');
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('https://md-editor-server-uvps.onrender.com/api/documents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(response.data);
    } catch (error: any) {
      navigate('/login');
      setError(error.response?.data?.message || 'Failed to fetch documents');
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocumentTitle.trim()) {
      setError('Document title cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        'https://md-editor-server-uvps.onrender.com/api/documents',
        { title: newDocumentTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const newDocumentId = response.data._id;
      setSuccessMessage('Document created successfully');
      setShowCreateInput(false);
      setNewDocumentTitle('');
      navigate(`/editor/${newDocumentId}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create document');
    }
  };

  const handleDocumentClick = (documentId: string) => {
    navigate(`/editor/${documentId}`);
  };

  return (
    <div className="home-container">
      <h1>My Documents</h1>
      {error && <p className="error-text">{error}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}

      <table className="documents-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc._id}>
                <td 
                  onClick={() => handleDocumentClick(doc._id)}
                  className="document-title"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleDocumentClick(doc._id);
                    }
                  }}
                >
                  {doc.title}
                </td>
                <td>{doc.createdBy}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No documents found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showCreateInput ? (
        <div className="create-document">
          <input
            type="text"
            placeholder="Enter document title"
            value={newDocumentTitle}
            onChange={(e) => setNewDocumentTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateDocument();
              }
            }}
          />
          <button onClick={handleCreateDocument}>Submit</button>
          <button onClick={() => setShowCreateInput(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowCreateInput(true)} className="create-button">
          Create New Document
        </button>
      )}
    </div>
  );
};

export default HomePage;