import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminViewResults = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch available sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/sessions"
        );
        setSessions(response.data);
      } catch (error) {
        displayError("Failed to fetch sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const fetchResults = async (sessionId) => {
    setLoading(true);
    setResults([]);
    setFilteredResults([]);
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/results/student",
        {
          params: { sessionId }, // Check if this is passing the correct session ID
        }
      );
      setResults(response.data);
      setFilteredResults(response.data);
    } catch (error) {
      displayError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filteredData = results.filter(
      (result) =>
        result.studentId1.toLowerCase().includes(lowercasedTerm) ||
        result.studentName.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredResults(filteredData);
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>View Results</h2>

      {/* Session Dropdown */}
      <div className="mb-3">
        <label>Select Session</label>
        <select
          className="form-control"
          value={selectedSession}
          onChange={(e) => {
            const sessionId = e.target.value;
            setSelectedSession(sessionId);
            if (sessionId) {
              fetchResults(sessionId);
            } else {
              setResults([]);
              setFilteredResults([]);
            }
          }}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      {selectedSession && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Student ID or Name"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <div>Loading...</div>
      ) : selectedSession && filteredResults.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Grade Point</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => (
              <tr key={result.studentId}>
                <td>{result.studentId1}</td>
                <td>{result.studentName}</td>
                <td>{result.gpa}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(
                        `/admin/view-grades/${result.studentId}/${selectedSession}`
                      )
                    }
                  >
                    View Grade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedSession ? (
        <p>No results found for the selected session.</p>
      ) : (
        <p>Please select a session to view results.</p>
      )}
    </div>
  );
};

export default AdminViewResults;
