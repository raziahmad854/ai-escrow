'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '../../config/api';
const API_URL = `${API_BASE_URL}/api`;

// Theme and styles
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
  borderRadius: '8px',
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  header: {
    backgroundColor: theme.colors.background,
    borderBottom: `1px solid ${theme.colors.border}`,
    padding: `${theme.spacing.md} 0`,
    marginBottom: theme.spacing.xl,
  },
  
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.md}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.primary,
  },
  
  nav: {
    display: 'flex',
    gap: theme.spacing.md,
  },
  
  navLink: {
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.md}`,
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  
  statCard: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
  },
  
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  
  statLabel: {
    fontSize: '14px',
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.borderRadius,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    border: `1px solid ${theme.colors.primary}`,
  },
  
  buttonSuccess: {
    backgroundColor: theme.colors.success,
    color: '#ffffff',
  },
  
  buttonSmall: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    fontSize: '12px',
  },
  
  goalsGrid: {
    display: 'grid',
    gap: theme.spacing.lg,
  },
  
  goalCard: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
  },
  
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  
  goalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: '1.4',
  },
  
  goalMeta: {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    fontSize: '14px',
    color: theme.colors.textSecondary,
  },
  
  statusBadge: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  progressBar: {
    backgroundColor: theme.colors.border,
    borderRadius: '8px',
    height: '8px',
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    transition: 'width 0.3s ease',
  },
  
  milestonesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  
  milestoneItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  
  milestoneContent: {
    flex: 1,
  },
  
  milestoneDescription: {
    fontSize: '14px',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  milestonePercentage: {
    fontSize: '12px',
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    border: `1px solid ${theme.colors.border}`,
  },
  
  emptyIcon: {
    fontSize: '48px',
    marginBottom: theme.spacing.md,
    opacity: 0.5,
  },
  
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: `3px solid ${theme.colors.border}`,
    borderTop: `3px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '40px auto',
  },
};

export default function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

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

  const handleCompleteMilestone = async (goalId, milestoneId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const response = await axios.put(
        `${API_URL}/goals/${goalId}/milestones/${milestoneId}/complete`, 
        {}, 
        config
      );

      // Show success message
      alert(`🎉 Milestone completed! $${response.data.refundAmount.toFixed(2)} has been added to your wallet.`);
      
      // Refresh goals to show updated state
      fetchGoals();

    } catch (error) {
      console.error('Error completing milestone:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete milestone. Please try again.';
      alert(`❌ ${errorMessage}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'active':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'failed':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: theme.colors.border, color: theme.colors.textSecondary };
    }
  };

  const calculateProgress = (milestones) => {
    if (!milestones.length) return 0;
    const completed = milestones.filter(m => m.isCompleted);
    return Math.round((completed.length / milestones.length) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
          Loading your goals...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>AI Escrow</div>
          <nav style={styles.nav}>
            <span 
              style={{...styles.navLink, backgroundColor: theme.colors.backgroundSecondary}}
            >
              Dashboard
            </span>
            <span 
              style={styles.navLink} 
              onClick={() => navigateTo('/create-goal')}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.colors.backgroundSecondary}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Create Goal
            </span>
            <span 
              style={styles.navLink} 
              onClick={() => navigateTo('/wallet')}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.colors.backgroundSecondary}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Wallet
            </span>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.sectionHeader}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.text, margin: 0 }}>
            Your Goals Dashboard
          </h1>
          <button 
            style={styles.button}
            onClick={() => navigateTo('/create-goal')}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = theme.colors.primaryHover;
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = theme.colors.primary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            + Create New Goal
          </button>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.primary}}>
              {stats.totalGoals}
            </div>
            <div style={styles.statLabel}>Total Goals</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.warning}}>
              {stats.activeGoals}
            </div>
            <div style={styles.statLabel}>Active Goals</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.success}}>
              {stats.completedGoals}
            </div>
            <div style={styles.statLabel}>Completed Goals</div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius,
            marginBottom: theme.spacing.lg,
          }}>
            {error}
          </div>
        )}

        {/* Goals Section */}
        {goals.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎯</div>
            <h3 style={{ color: theme.colors.text, marginBottom: theme.spacing.sm }}>
              No Goals Yet
            </h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
              Start your journey by creating your first goal. Our AI will help you break it down into achievable milestones.
            </p>
            <button 
              style={styles.button}
              onClick={() => navigateTo('/create-goal')}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = theme.colors.primaryHover;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = theme.colors.primary;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div style={styles.goalsGrid}>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.milestones);
              const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
              
              return (
                <div key={goal._id} style={styles.goalCard}>
                  <div style={styles.goalHeader}>
                    <div style={{ flex: 1 }}>
                      <h3 style={styles.goalTitle}>{goal.title}</h3>
                      <div style={styles.goalMeta}>
                        <span><strong>Deposit:</strong> {formatCurrency(goal.depositAmount)}</span>
                        <span><strong>Progress:</strong> {completedMilestones}/{goal.milestones.length} milestones</span>
                        <span><strong>Created:</strong> {new Date(goal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div 
                      style={{
                        ...styles.statusBadge,
                        ...getStatusColor(goal.status)
                      }}
                    >
                      {goal.status}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${progress}%`
                      }}
                    />
                  </div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: theme.colors.textSecondary, 
                    marginBottom: theme.spacing.lg 
                  }}>
                    {progress}% Complete
                  </p>

                  {/* Milestones */}
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: theme.colors.text, 
                    marginBottom: theme.spacing.md 
                  }}>
                    Milestones
                  </h4>
                  
                  <ul style={styles.milestonesList}>
                    {goal.milestones.map((milestone, index) => (
                      <li key={milestone._id} style={styles.milestoneItem}>
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
                          marginTop: '2px',
                        }}>
                          {milestone.isCompleted && (
                            <span style={{ color: '#ffffff', fontSize: '12px' }}>✓</span>
                          )}
                        </div>
                        
                        <div style={styles.milestoneContent}>
                          <div style={{
                            ...styles.milestoneDescription,
                            textDecoration: milestone.isCompleted ? 'line-through' : 'none',
                            opacity: milestone.isCompleted ? 0.7 : 1,
                          }}>
                            {milestone.description}
                          </div>
                          <div style={styles.milestonePercentage}>
                            {milestone.percentage}% of deposit
                            {milestone.isCompleted && milestone.releasedAmount && (
                              <span style={{ color: theme.colors.success, marginLeft: theme.spacing.sm }}>
                                • {formatCurrency(milestone.releasedAmount)} refunded
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {!milestone.isCompleted && goal.status === 'active' && (
                          <button
                            onClick={() => handleCompleteMilestone(goal._id, milestone._id)}
                            style={{
                              ...styles.button,
                              ...styles.buttonSuccess,
                              ...styles.buttonSmall,
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = theme.colors.successHover;
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = theme.colors.success;
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            Complete
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Goal Actions */}
                  {goal.status === 'active' && (
                    <div style={{ 
                      marginTop: theme.spacing.lg, 
                      paddingTop: theme.spacing.md, 
                      borderTop: `1px solid ${theme.colors.border}`,
                      display: 'flex',
                      gap: theme.spacing.sm,
                    }}>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to abandon this goal? You will lose any remaining deposit.')) {
                            // Implement goal abandonment logic here
                            console.log('Goal abandoned:', goal._id);
                          }
                        }}
                        style={{
                          ...styles.button,
                          ...styles.buttonSecondary,
                          ...styles.buttonSmall,
                          color: theme.colors.error,
                          borderColor: theme.colors.error,
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = theme.colors.error;
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = theme.colors.error;
                        }}
                      >
                        Abandon Goal
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}