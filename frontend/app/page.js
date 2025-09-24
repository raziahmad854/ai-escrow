'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:5000/api';

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
    textLight: '#94a3b8',
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
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadows.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: '400px',
  },

  header: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },

  logo: {
    fontSize: '32px',
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: '16px',
    lineHeight: '1.5',
  },

  tabContainer: {
    display: 'flex',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius,
    padding: '4px',
    marginBottom: theme.spacing.xl,
  },

  tab: {
    flex: 1,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: theme.borderRadius,
    transition: 'all 0.2s ease',
    border: 'none',
    backgroundColor: 'transparent',
  },

  activeTab: {
    backgroundColor: theme.colors.background,
    color: theme.colors.primary,
    boxShadow: theme.shadows.md,
  },

  inactiveTab: {
    color: theme.colors.textSecondary,
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

  features: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border}`,
  },

  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },

  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: '14px',
    color: theme.colors.textSecondary,
  },

  featureIcon: {
    color: theme.colors.success,
    fontWeight: '600',
  },
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
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
    if (activeTab === 'register') {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return false;
      }
      if (formData.name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return false;
      }
    }

    if (!formData.email) {
      setError('Please enter your email address');
      return false;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }

    if (activeTab === 'register') {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = activeTab === 'login' ? '/auth/login' : '/auth/register';
      const payload = activeTab === 'login' 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name.trim(), email: formData.email, password: formData.password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setSuccess(response.data.message || 'Success!');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError('Authentication failed. Please try again.');
      }

    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error.response?.data?.message || 
        `${activeTab === 'login' ? 'Login' : 'Registration'} failed. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>AI Escrow</div>
          <div style={styles.subtitle}>
            Turn your goals into reality with AI-powered milestones and escrow accountability
          </div>
        </div>

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'login' ? styles.activeTab : styles.inactiveTab)
            }}
            onClick={() => handleTabChange('login')}
          >
            Sign In
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'register' ? styles.activeTab : styles.inactiveTab)
            }}
            onClick={() => handleTabChange('register')}
          >
            Sign Up
          </button>
        </div>

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
          {activeTab === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  borderColor: formData.name.length >= 2 ? theme.colors.success : theme.colors.border
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => e.target.style.borderColor = formData.name.length >= 2 ? theme.colors.success : theme.colors.border}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                borderColor: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) ? theme.colors.success : theme.colors.border
              }}
              onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
              onBlur={(e) => {
                const isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value);
                e.target.style.borderColor = isValid ? theme.colors.success : theme.colors.border;
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder={activeTab === 'register' ? "Create a password (min. 6 characters)" : "Enter your password"}
              value={formData.password}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                borderColor: activeTab === 'register' 
                  ? (formData.password.length >= 6 ? theme.colors.success : theme.colors.border)
                  : theme.colors.border
              }}
              onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
              onBlur={(e) => {
                if (activeTab === 'register') {
                  e.target.style.borderColor = formData.password.length >= 6 ? theme.colors.success : theme.colors.border;
                } else {
                  e.target.style.borderColor = theme.colors.border;
                }
              }}
            />
          </div>

          {activeTab === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  borderColor: formData.confirmPassword && formData.password === formData.confirmPassword 
                    ? theme.colors.success 
                    : theme.colors.border
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => {
                  const matches = formData.confirmPassword && formData.password === formData.confirmPassword;
                  e.target.style.borderColor = matches ? theme.colors.success : theme.colors.border;
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#94a3b8' : theme.colors.primary,
              cursor: loading ? 'not-allowed' : 'pointer',
              transform: loading ? 'none' : 'scale(1)',
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = theme.colors.primaryHover;
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
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
                {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              activeTab === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div style={styles.features}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
            textAlign: 'center'
          }}>
            Why Choose AI Escrow?
          </h3>
          <ul style={styles.featuresList}>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              AI-generated SMART milestones for your goals
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Escrow system keeps you accountable
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Get refunds as you complete milestones
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Track progress with detailed analytics
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              {activeTab === 'register' ? 'Start with $100 free balance!' : 'Secure and private'}
            </li>
          </ul>
        </div>
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