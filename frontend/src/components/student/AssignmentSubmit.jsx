import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { FaPlus, FaExternalLinkAlt, FaCheck, FaClock, FaBook } from 'react-icons/fa';

const AssignmentSubmit = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments/student');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions/student');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/submissions/submit', {
        assignmentId: selectedAssignment._id,
        githubUrl
      });
      setShowForm(false);
      setGithubUrl('');
      setSelectedAssignment(null);
      fetchSubmissions();
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment: ' + (error.response?.data?.message || error.message));
    }
  };

  const getSubmissionStatus = (assignmentId) => {
    const submission = submissions.find(sub => sub.assignment._id === assignmentId);
    return submission ? submission.status : 'Not Submitted';
  };

  const getSubmissionDetails = (assignmentId) => {
    return submissions.find(sub => sub.assignment._id === assignmentId);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Not Submitted': { class: 'status-pending', text: 'Not Submitted' },
      'Pending': { class: 'status-pending', text: 'Pending Review' },
      'Approved': { class: 'status-approved', text: 'Approved' },
      'Rejected': { class: 'status-rejected', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig['Not Submitted'];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const isAssignmentDue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Assignments</h1>

      {showForm && selectedAssignment && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Submit Assignment: {selectedAssignment.title}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">GitHub Repository URL *</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/your-username/assignment-repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn-primary">
                Submit Assignment
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setSelectedAssignment(null);
                  setGithubUrl('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {assignments.map((assignment) => {
          const status = getSubmissionStatus(assignment._id);
          const submission = getSubmissionDetails(assignment._id);
          const isDue = isAssignmentDue(assignment.dueDate);

          return (
            <div key={assignment._id} className="glass-card" style={{ 
              padding: '20px',
              borderLeft: isDue ? '4px solid #ef4444' : '4px solid var(--accent-1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '10px' }}>{assignment.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    {assignment.description}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                      <FaBook style={{ color: 'var(--text-secondary)' }} />
                      <span>{assignment.course?.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                      <FaClock style={{ color: isDue ? '#ef4444' : 'var(--text-secondary)' }} />
                      <span style={{ color: isDue ? '#ef4444' : 'var(--text-secondary)' }}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        {isDue && ' (Overdue)'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {getStatusBadge(status)}
                  {submission?.githubUrl && (
                    <a 
                      href={submission.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-1)' }}
                    >
                      <FaExternalLinkAlt size={14} />
                    </a>
                  )}
                  {status === 'Not Submitted' && !isDue && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowForm(true);
                      }}
                    >
                      <FaPlus style={{ marginRight: '5px' }} />
                      Submit
                    </button>
                  )}
                  {status === 'Rejected' && !isDue && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowForm(true);
                      }}
                    >
                      <FaPlus style={{ marginRight: '5px' }} />
                      Resubmit
                    </button>
                  )}
                </div>
              </div>

              {/* Submission Details */}
              {submission && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  background: 'var(--secondary-bg)', 
                  borderRadius: '8px'
                }}>
                  <h5 style={{ marginBottom: '10px' }}>Your Submission:</h5>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>GitHub URL:</strong>{' '}
                    <a 
                      href={submission.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-1)' }}
                    >
                      {submission.githubUrl}
                    </a>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Submitted on: {new Date(submission.submittedAt).toLocaleString()}
                  </div>
                  
                  {/* Feedback */}
                  {submission.feedback && (
                    <div style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '6px',
                      borderLeft: '3px solid var(--accent-1)'
                    }}>
                      <strong>Feedback from Instructor:</strong>
                      <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <FaBook size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '10px' }}>No Assignments</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            There are no assignments available for your courses at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmit;