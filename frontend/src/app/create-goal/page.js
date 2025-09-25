'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '../config/api';
const API_URL = `${API_BASE_URL}/api`;

// Theme and styles
const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    success: '#10b981',
    error: '#ef4444',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    border: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: '8px',
  shadows: {
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.md}`,
  },
  
  card: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  input: {
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    fontSize: '16px',
    backgroundColor: theme.colors.background,
    transition: 'all 0.2s ease',
  },
  
  textarea: {
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    fontSize: '16px',
    backgroundColor: theme.colors.background,
    transition: 'all 0.2s ease',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.borderRadius,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  
  alert: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius,
    marginBottom: theme.spacing.md,
    fontSize: '14px',
    fontWeight: '500',
  },
  
  alertError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
  },
  
  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #86efac',
  },
  
  balanceInfo: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    border: '1px solid #93c5fd',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius,
    fontSize: '14px',
    marginBottom: theme.spacing.lg,
  },
  
  lowBalanceWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fcd34d',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius,
    fontSize: '14px',
    marginBottom: theme.spacing.lg,
  },
  
  helpText: {
    fontSize: '12px',
    color: theme.colors.textSecondary,
    marginTop: '4px',
  },
};

export default function CreateGoalPage() {
  const [formData, setFormData] = useState({
    title: '',
    depositAmount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const response = await axios.get(`${API_URL}/goals/wallet/balance`, config);
      setUserBalance(response.data.walletBalance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to load wallet balance. Please refresh the page.');
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a goal description');
      return false;
    }
    
    if (formData.title.trim().length < 10) {
      setError('Goal description should be at least 10 characters long');
      return false;
    }
    
    if (!formData.depositAmount) {
      setError('Please enter a deposit amount');
      return false;
    }
    
    const amount = parseFloat(formData.depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid deposit amount');
      return false;
    }
    
    if (amount > userBalance) {
      setError(`Insufficient balance. You have $${userBalance.toFixed(2)} available`);
      return false;
    }
    
    if (amount < 1) {
      setError('Minimum deposit amount is $1');
      return false;
    }
    
    if (amount > 10000) {
      setError('Maximum deposit amount is $10,000');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a goal');
        router.push('/');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const response = await axios.post(`${API_URL}/goals/create`, {
        title: formData.title.trim(),
        depositAmount: parseFloat(formData.depositAmount)
      }, config);

      setSuccess('Goal created successfully! AI has generated your milestones.');
      setFormData({ title: '', depositAmount: '' });
      
      // Update balance after successful goal creation
      if (response.data.remainingBalance !== undefined) {
        setUserBalance(response.data.remainingBalance);
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error creating goal:', error);
      const errorMessage = error.response?.data?.message || 'Error creating goal. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  // Show loading state while fetching balance
  if (balanceLoading) {
    return (
      <div style={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: theme.spacing.md
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${theme.colors.border}`,
            borderTop: `3px solid ${theme.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: theme.colors.textSecondary }}>Loading...</p>
        </div>
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
              style={styles.navLink} 
              onClick={() => navigateTo('/dashboard')}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.colors.backgroundSecondary}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Dashboard
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
        <div style={styles.card}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: theme.colors.text, 
            marginBottom: theme.spacing.sm,
            textAlign: 'center'
          }}>
            Create New Goal
          </h1>
          
          <p style={{ 
            color: theme.colors.textSecondary, 
            textAlign: 'center', 
            marginBottom: theme.spacing.xl,
            lineHeight: '1.5'
          }}>
            Set a goal and deposit money to stay committed. Our AI will create milestones to help you succeed.
          </p>

          {userBalance > 0 ? (
            <div style={styles.balanceInfo}>
              <strong>Available Balance: ${userBalance.toFixed(2)}</strong>
            </div>
          ) : (
            <div style={styles.lowBalanceWarning}>
              <strong>⚠️ Low Balance: ${userBalance.toFixed(2)}</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                You need funds to create goals. In a real app, you would add money to your wallet here.
              </p>
            </div>
          )}

          {error && (
            <div style={{...styles.alert, ...styles.alertError}}>
              {error}
            </div>
          )}

          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Goal Description</label>
              <textarea
                name="title"
                placeholder="Describe your goal in detail (e.g., 'I want to read 12 books in 3 months to improve my knowledge in business and personal development')"
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  ...styles.textarea,
                  borderColor: formData.title.length >= 10 ? theme.colors.success : theme.colors.border
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => e.target.style.borderColor = formData.title.length >= 10 ? theme.colors.success : theme.colors.border}
              />
              <div style={styles.helpText}>
                Be specific about what you want to achieve. The AI will create better milestones with more detail.
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Deposit Amount ($)</label>
              <input
                type="number"
                name="depositAmount"
                placeholder="50"
                value={formData.depositAmount}
                onChange={handleInputChange}
                min="1"
                max={Math.max(userBalance, 1)} // Ensure max is at least 1 to avoid validation error
                step="0.01"
                style={{
                  ...styles.input,
                  borderColor: formData.depositAmount && parseFloat(formData.depositAmount) <= userBalance && parseFloat(formData.depositAmount) >= 1 
                    ? theme.colors.success 
                    : theme.colors.border
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => {
                  const amount = parseFloat(e.target.value);
                  e.target.style.borderColor = amount && amount <= userBalance && amount >= 1 
                    ? theme.colors.success 
                    : theme.colors.border;
                }}
                disabled={userBalance <= 0}
              />
              <div style={styles.helpText}>
                {userBalance > 0 
                  ? 'This amount will be held in escrow. You\'ll get it back as you complete milestones.'
                  : 'You need a positive balance to create goals. Please add funds to your wallet first.'
                }
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || userBalance <= 0}
              style={{
                ...styles.button,
                backgroundColor: (loading || userBalance <= 0) ? '#94a3b8' : theme.colors.primary,
                cursor: (loading || userBalance <= 0) ? 'not-allowed' : 'pointer',
                transform: (loading || userBalance <= 0) ? 'none' : 'scale(1)',
              }}
              onMouseOver={(e) => {
                if (!loading && userBalance > 0) {
                  e.target.style.backgroundColor = theme.colors.primaryHover;
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && userBalance > 0) {
                  e.target.style.backgroundColor = theme.colors.primary;
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff40',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Creating Goal...
                </>
              ) : userBalance <= 0 ? (
                'Insufficient Balance'
              ) : (
                'Create Goal & Generate Milestones'
              )}
            </button>
          </form>

          {userBalance <= 0 && (
            <div style={{
              marginTop: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: theme.borderRadius,
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#0c4a6e',
                marginBottom: theme.spacing.sm
              }}>
                <strong>💡 Demo Note:</strong> In a production app, you would have options to add funds to your wallet.
              </p>
              <button
                onClick={() => navigateTo('/wallet')}
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}`,
                  borderRadius: theme.borderRadius,
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                View Wallet
              </button>
            </div>
          )}
        </div>
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