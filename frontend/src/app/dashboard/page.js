'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import API_BASE_URL from '../../config/api';
const API_URL = `${API_BASE_URL}/api`;

const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    success: '#10b981',
    successHover: '#059669',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    border: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
    textLight: '#94a3b8',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: '8px'
};

// Proof Submission Modal Component
function MilestoneProofModal({ milestone, goalId, onClose, onSuccess }) {
  const [proofDescription, setProofDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [selfCertify, setSelfCertify] = useState(false);
  const [selfCertificationReason, setSelfCertificationReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSubmit = async () => {
    setError('');
    
    if (!selfCertify && !proofDescription.trim()) {
      setError('Please provide proof description');
      return;
    }
    
    if (selfCertify && !selfCertificationReason.trim()) {
      setError('Please provide reason for self-certification');
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/goals/${goalId}/milestones/${milestone._id}/submit-proof`,
        {
          proofDescription,
          proofUrl,
          selfCertify,
          selfCertificationReason
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setVerificationResult(response.data.verification);

      if (response.data.refundAmount) {
        setTimeout(() => {
          onSuccess(response.data);
        }, 2000);
      } else {
        setTimeout(() => {
          onClose();
        }, 3000);
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }} onClick={(e) => e.stopPropagation()}>
        
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: theme.colors.text }}>
          Submit Milestone Proof
        </h2>
        <p style={{ color: theme.colors.textSecondary, marginBottom: '24px', lineHeight: '1.5' }}>
          {milestone.description}
        </p>

        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ fontWeight: '600', color: '#0c4a6e', marginBottom: '8px', fontSize: '14px' }}>
            Verification Requirements:
          </div>
          <div style={{ fontSize: '14px', color: '#075985', lineHeight: '1.5' }}>
            {milestone.verificationCriteria || 'Provide proof of completion'}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#0c4a6e' }}>
            Required proof type: <strong>{milestone.requiredProofType || 'any'}</strong>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {verificationResult && (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: verificationResult.verified ? '#dcfce7' : '#fef3c7',
            border: `2px solid ${verificationResult.verified ? '#86efac' : '#fcd34d'}`,
            color: verificationResult.verified ? '#166534' : '#92400e'
          }}>
            <div style={{ fontWeight: '600',marginBottom: '8px', fontSize: '16px' }}>
              {verificationResult.verified ? '✓ Verification Successful!' : 'Verification Result'}
            </div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              Confidence: {verificationResult.confidence}%
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{verificationResult.analysis}</div>
            {verificationResult.suggestions && (
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
                Suggestion: {verificationResult.suggestions}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!selfCertify && (
            <>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>
                  Proof URL (optional)
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://example.com/proof.jpg"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>
                  Proof Description *
                </label>
                <textarea
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Describe what you did and how you completed this milestone..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    minHeight: '120px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '8px'
          }}>
            <input
              type="checkbox"
              checked={selfCertify}
              onChange={(e) => setSelfCertify(e.target.checked)}
              id="selfCertify"
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="selfCertify" style={{ fontSize: '14px', color: '#92400e', cursor: 'pointer' }}>
              I want to self-certify this milestone
            </label>
          </div>

          {selfCertify && (
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px', color: theme.colors.text }}>
                Self-Certification Reason *
              </label>
              <textarea
                value={selfCertificationReason}
                onChange={(e) => setSelfCertificationReason(e.target.value)}
                placeholder="Explain why you're self-certifying (e.g., proof is personal/private)..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'transparent',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: theme.colors.textSecondary
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (!selfCertify && !proofDescription.trim()) || (selfCertify && !selfCertificationReason.trim())}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loading ? '#94a3b8' : theme.colors.primary,
                color: '#ffffff',
                cursor: (loading || (!selfCertify && !proofDescription.trim()) || (selfCertify && !selfCertificationReason.trim())) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Submitting...' : selfCertify ? 'Self-Certify & Complete' : 'Submit Proof'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({ totalGoals: 0, activeGoals: 0, completedGoals: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchGoals();
  }, [router]);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const userId = JSON.parse(atob(token.split('.')[1])).user.id;
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      const response = await axios.get(`${API_URL}/goals/user/${userId}`, config);
      setGoals(response.data.goals || []);
      setStats({
        totalGoals: response.data.totalGoals || 0,
        activeGoals: response.data.activeGoals || 0,
        completedGoals: response.data.completedGoals || 0
      });
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to load goals. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProofModal = (goalId, milestone) => {
    setSelectedGoalId(goalId);
    setSelectedMilestone(milestone);
    setShowProofModal(true);
  };

  const handleCloseProofModal = () => {
    setShowProofModal(false);
    setSelectedMilestone(null);
    setSelectedGoalId(null);
  };

  const handleProofSuccess = (data) => {
    if (data.refundAmount) {
      alert(`Milestone verified and completed! $${data.refundAmount.toFixed(2)} added to your wallet.`);
    } else {
      alert(`Proof submitted! ${data.message}`);
    }
    handleCloseProofModal();
    fetchGoals();
  };

  const calculateProgress = (milestones) => {
    if (!milestones.length) return 0;
    const completed = milestones.filter(m => m.isCompleted);
    return Math.round((completed.length / milestones.length) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const navigateTo = (path) => router.push(path);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.backgroundSecondary, fontFamily: 'system-ui, sans-serif' }}>
      <header style={{
        backgroundColor: theme.colors.background,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '16px 0',
        marginBottom: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: theme.colors.primary }}>AI Escrow</div>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <span style={{
              color: theme.colors.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: theme.colors.backgroundSecondary,
              cursor: 'pointer'
            }}>Dashboard</span>
            <span onClick={() => navigateTo('/create-goal')} style={{
              color: theme.colors.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>Create Goal</span>
            <span onClick={() => navigateTo('/wallet')} style={{
              color: theme.colors.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>Wallet</span>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.text, margin: 0 }}>Your Goals Dashboard</h1>
          <button onClick={() => navigateTo('/create-goal')} style={{
            backgroundColor: theme.colors.primary,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>+ Create New Goal</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.colors.primary, marginBottom: '4px' }}>
              {stats.totalGoals}
            </div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500' }}>Total Goals</div>
          </div>
          <div style={{
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.colors.warning, marginBottom: '4px' }}>
              {stats.activeGoals}
            </div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500' }}>Active Goals</div>
          </div>
          <div style={{
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.colors.success, marginBottom: '4px' }}>
              {stats.completedGoals}
            </div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500' }}>Completed Goals</div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>{error}</div>
        )}

        {goals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: theme.colors.background,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🎯</div>
            <h3 style={{ color: theme.colors.text, marginBottom: '8px' }}>No Goals Yet</h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: '24px' }}>
              Start your journey by creating your first goal.
            </p>
            <button onClick={() => navigateTo('/create-goal')} style={{
              backgroundColor: theme.colors.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>Create Your First Goal</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.milestones);
              const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
              
              return (
                <div key={goal._id} style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  padding: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '8px', lineHeight: '1.4' }}>
                        {goal.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: theme.colors.textSecondary }}>
                        <span><strong>Deposit:</strong> {formatCurrency(goal.depositAmount)}</span>
                        <span><strong>Progress:</strong> {completedMilestones}/{goal.milestones.length} milestones</span>
                        <span><strong>Created:</strong> {new Date(goal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      backgroundColor: goal.status === 'completed' ? '#dcfce7' : goal.status === 'active' ? '#dbeafe' : '#fee2e2',
                      color: goal.status === 'completed' ? '#166534' : goal.status === 'active' ? '#1e40af' : '#991b1b'
                    }}>
                      {goal.status}
                    </div>
                  </div>

                  <div style={{ backgroundColor: theme.colors.border, borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', backgroundColor: theme.colors.success, width: `${progress}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <p style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '24px' }}>
                    {progress}% Complete
                  </p>

                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>Milestones</h4>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {goal.milestones.map((milestone) => (
                      <li key={milestone._id} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        padding: '8px 0',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${milestone.isCompleted ? theme.colors.success : theme.colors.border}`,
                          backgroundColor: milestone.isCompleted ? theme.colors.success : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {milestone.isCompleted && <span style={{ color: '#ffffff', fontSize: '12px' }}>✓</span>}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            color: theme.colors.text,
                            marginBottom: '4px',
                            textDecoration: milestone.isCompleted ? 'line-through' : 'none',
                            opacity: milestone.isCompleted ? 0.7 : 1
                          }}>
                            {milestone.description}
                          </div>
                          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                            {milestone.percentage}% of deposit
                            {milestone.isCompleted && milestone.releasedAmount && (
                              <span style={{ color: theme.colors.success, marginLeft: '8px' }}>
                                • {formatCurrency(milestone.releasedAmount)} refunded
                              </span>
                            )}
                          </div>
                          {milestone.verificationCriteria && !milestone.isCompleted && (
                            <div style={{
                              fontSize: '12px',
                              color: '#075985',
                              backgroundColor: '#f0f9ff',
                              padding: '8px',
                              borderRadius: '4px',
                              marginTop: '8px'
                            }}>
                              <strong>Required:</strong> {milestone.verificationCriteria}
                            </div>
                          )}
                        </div>
                        
                        {!milestone.isCompleted && goal.status === 'active' && (
                          <button
                            onClick={() => handleOpenProofModal(goal._id, milestone)}
                            style={{
                              backgroundColor: theme.colors.success,
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Submit Proof
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showProofModal && selectedMilestone && (
        <MilestoneProofModal
          milestone={selectedMilestone}
          goalId={selectedGoalId}
          onClose={handleCloseProofModal}
          onSuccess={handleProofSuccess}
        />
      )}
    </div>
  );
}