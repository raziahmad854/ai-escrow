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
    maxWidth: '800px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.md}`,
  },
  
  welcomeCard: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    borderRadius: theme.borderRadius,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  
  balanceAmount: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  
  balanceLabel: {
    fontSize: '18px',
    opacity: 0.9,
    marginBottom: theme.spacing.lg,
  },
  
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: theme.borderRadius,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  
  statCard: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
    textAlign: 'center',
  },
  
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  
  statLabel: {
    fontSize: '14px',
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  sectionCard: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.sm,
    marginBottom: theme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  comingSoon: {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
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
  
  errorCard: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },

  infoBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #0ea5e9',
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },

  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: theme.spacing.sm,
  },

  infoText: {
    fontSize: '14px',
    color: '#075985',
    lineHeight: '1.5',
  },
};

export default function WalletPage() {
  const [walletData, setWalletData] = useState({
    walletBalance: 0,
    userName: '',
    stats: {
      totalDeposited: 0,
      totalRefunded: 0,
      totalGoals: 0,
      activeGoals: 0,
      completedGoals: 0,
    }
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
    fetchWalletData();
  }, [router]);

  const fetchWalletData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const response = await axios.get(`${API_URL}/goals/wallet/balance`, config);
      setWalletData(response.data);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/');
      } else {
        setError('Failed to load wallet information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
          Loading wallet information...
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
              style={styles.navLink} 
              onClick={() => navigateTo('/dashboard')}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.colors.backgroundSecondary}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
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
              style={{...styles.navLink, backgroundColor: theme.colors.backgroundSecondary}}
            >
              Wallet
            </span>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: theme.spacing.sm,
            margin: 0 
          }}>
            {walletData.userName ? `Welcome back, ${walletData.userName}!` : 'Your Wallet'}
          </h1>
          
          <div style={styles.balanceAmount}>
            {formatCurrency(walletData.walletBalance)}
          </div>
          
          <div style={styles.balanceLabel}>
            Available Balance
          </div>
          
          <button
            onClick={fetchWalletData}
            disabled={loading}
            style={{
              ...styles.refreshButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            {loading ? 'Refreshing...' : '↻ Refresh Balance'}
          </button>
        </div>

        {error && (
          <div style={styles.errorCard}>
            <strong>Error:</strong> {error}
            <br />
            <button 
              onClick={fetchWalletData}
              style={{
                backgroundColor: 'transparent',
                color: '#991b1b',
                border: '1px solid #991b1b',
                borderRadius: theme.borderRadius,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                marginTop: theme.spacing.md,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* How it Works Info Box */}
        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>💡 How Your Escrow Wallet Works</div>
          <div style={styles.infoText}>
            When you create a goal, you deposit money that gets held in escrow. As you complete milestones, 
            you receive proportional refunds back to your wallet. This creates accountability through loss aversion 
            - you're motivated to complete your goals to get your money back!
          </div>
        </div>

        {/* Wallet Statistics */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.error}}>
              {formatCurrency(walletData.stats?.totalDeposited || 0)}
            </div>
            <div style={styles.statLabel}>Total Deposited</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.success}}>
              {formatCurrency(walletData.stats?.totalRefunded || 0)}
            </div>
            <div style={styles.statLabel}>Total Refunded</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.primary}}>
              {walletData.stats?.totalGoals || 0}
            </div>
            <div style={styles.statLabel}>Total Goals</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: theme.colors.warning}}>
              {walletData.stats?.activeGoals || 0}
            </div>
            <div style={styles.statLabel}>Active Goals</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionTitle}>
            🚀 Quick Actions
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('/create-goal')}
              style={{
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: theme.borderRadius,
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = theme.colors.primaryHover;
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = theme.colors.primary;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Create New Goal
            </button>
            
            <button
              onClick={() => navigateTo('/dashboard')}
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                borderRadius: theme.borderRadius,
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = theme.colors.primary;
                e.target.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = theme.colors.primary;
              }}
            >
              View Dashboard
            </button>
          </div>
        </div>

        {/* Transaction History Section */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionTitle}>
            📊 Transaction History
          </div>
          <div style={styles.comingSoon}>
            <p style={{ margin: 0, fontSize: '16px', marginBottom: theme.spacing.sm }}>
              🚧 Coming Soon
            </p>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Detailed transaction history with deposits, refunds, and goal completions will be available here.
            </p>
          </div>
        </div>

        {/* Success Tips */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionTitle}>
            💪 Success Tips
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: theme.colors.text }}>
            <ul style={{ paddingLeft: theme.spacing.lg, margin: 0 }}>
              <li style={{ marginBottom: theme.spacing.sm }}>
                <strong>Start Small:</strong> Begin with achievable goals to build momentum and confidence.
              </li>
              <li style={{ marginBottom: theme.spacing.sm }}>
                <strong>Be Specific:</strong> The more detailed your goal description, the better our AI can create helpful milestones.
              </li>
              <li style={{ marginBottom: theme.spacing.sm }}>
                <strong>Stay Consistent:</strong> Regular progress on milestones is key to maintaining motivation.
              </li>
              <li style={{ marginBottom: 0 }}>
                <strong>Celebrate Wins:</strong> Acknowledge each completed milestone - you're getting your money back AND achieving your goals!
              </li>
            </ul>
          </div>
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