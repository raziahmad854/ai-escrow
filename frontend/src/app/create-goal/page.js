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
      
      if (response.data.remainingBalance !== undefined) {
        setUserBalance(response.data.remainingBalance);
      }
      
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

  if (balanceLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
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
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: theme.colors.backgroundSecondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        backgroundColor: theme.colors.background,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '12px 0',
        marginBottom: '24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: theme.colors.primary }}>AI Escrow</div>
          <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span 
              style={{
                color: theme.colors.textSecondary,
                fontSize: '13px',
                fontWeight: '500',
                padding: '6px 12px',
                borderRadius: theme.borderRadius,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onClick={() => navigateTo('/dashboard')}
            >
              Dashboard
            </span>
            <span 
              style={{
                color: theme.colors.textSecondary,
                fontSize: '13px',
                fontWeight: '500',
                padding: '6px 12px',
                borderRadius: theme.borderRadius,
                backgroundColor: theme.colors.backgroundSecondary,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Create Goal
            </span>
            <span 
              style={{
                color: theme.colors.textSecondary,
                fontSize: '13px',
                fontWeight: '500',
                padding: '6px 12px',
                borderRadius: theme.borderRadius,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onClick={() => navigateTo('/wallet')}
            >
              Wallet
            </span>
          </nav>
        </div>
      </header>

      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 12px',
      }}>
        <div style={{
          backgroundColor: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius,
          padding: '20px',
          boxShadow: theme.shadows.md,
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: theme.colors.text, 
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Create New Goal
          </h1>
          
          <p style={{ 
            color: theme.colors.textSecondary, 
            textAlign: 'center', 
            marginBottom: '24px',
            lineHeight: '1.5',
            fontSize: '14px'
          }}>
            Set a goal and deposit money to stay committed. Our AI will create milestones to help you succeed.
          </p>

          {userBalance > 0 ? (
            <div style={{
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #93c5fd',
              padding: '12px',
              borderRadius: theme.borderRadius,
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <strong>Available Balance: ${userBalance.toFixed(2)}</strong>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fcd34d',
              padding: '12px',
              borderRadius: theme.borderRadius,
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <strong>⚠️ Low Balance: ${userBalance.toFixed(2)}</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                You need funds to create goals.
              </p>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '12px',
              borderRadius: theme.borderRadius,
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '12px',
              borderRadius: theme.borderRadius,
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                Goal Description
              </label>
              <textarea
                name="title"
                placeholder="Describe your goal in detail (e.g., 'I want to read 12 books in 3 months')"
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  padding: '12px',
                  border: `1px solid ${formData.title.length >= 10 ? theme.colors.success : theme.colors.border}`,
                  borderRadius: theme.borderRadius,
                  fontSize: '14px',
                  backgroundColor: theme.colors.background,
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                Be specific about what you want to achieve. The AI will create better milestones with more detail.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                Deposit Amount ($)
              </label>
              <input
                type="number"
                name="depositAmount"
                placeholder="50"
                value={formData.depositAmount}
                onChange={handleInputChange}
                min="1"
                max={Math.max(userBalance, 1)}
                step="0.01"
                disabled={userBalance <= 0}
                style={{
                  padding: '12px',
                  border: `1px solid ${formData.depositAmount && parseFloat(formData.depositAmount) <= userBalance && parseFloat(formData.depositAmount) >= 1 ? theme.colors.success : theme.colors.border}`,
                  borderRadius: theme.borderRadius,
                  fontSize: '14px',
                  backgroundColor: userBalance <= 0 ? '#f3f4f6' : theme.colors.background
                }}
              />
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                {userBalance > 0 
                  ? 'This amount will be held in escrow. You\'ll get it back as you complete milestones.'
                  : 'You need a positive balance to create goals.'
                }
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || userBalance <= 0}
              style={{
                backgroundColor: (loading || userBalance <= 0) ? '#94a3b8' : theme.colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: theme.borderRadius,
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (loading || userBalance <= 0) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
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
          </div>

          {userBalance <= 0 && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: theme.borderRadius,
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#0c4a6e',
                marginBottom: '8px'
              }}>
                <strong>💡 Demo Note:</strong> In a production app, you would have options to add funds.
              </p>
              <button
                onClick={() => navigateTo('/wallet')}
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}`,
                  borderRadius: theme.borderRadius,
                  padding: '8px 16px',
                  fontSize: '13px',
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