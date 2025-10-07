"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import API_BASE_URL from "../../config/api";
const API_URL = `${API_BASE_URL}/api`;

const theme = {
 colors: {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  success: "#10b981",
  error: "#ef4444",
  background: "#ffffff",
  backgroundSecondary: "#f8fafc",
  border: "#e2e8f0",
  text: "#1e293b",
  textSecondary: "#64748b",
  textLight: "#94a3b8",
 },
 spacing: {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
 },
 borderRadius: "8px",
 shadows: {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
 },
};

export default function WalletPage() {
 const [walletData, setWalletData] = useState({
  walletBalance: 0,
  userName: "",
  stats: {
   totalDeposited: 0,
   totalRefunded: 0,
   totalGoals: 0,
   activeGoals: 0,
   completedGoals: 0,
  },
 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const router = useRouter();

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
   router.push("/");
   return;
  }
  fetchWalletData();
 }, [router]);

 const fetchWalletData = async () => {
  try {
   setError("");
   setLoading(true);

   const token = localStorage.getItem("token");
   if (!token) {
    router.push("/");
    return;
   }

   const config = {
    headers: { Authorization: `Bearer ${token}` },
   };

   const response = await axios.get(`${API_URL}/goals/wallet/balance`, config);
   setWalletData(response.data);
  } catch (error) {
   console.error("Error fetching wallet data:", error);
   if (error.response?.status === 401) {
    localStorage.clear();
    router.push("/");
   } else {
    setError("Failed to load wallet information. Please try again.");
   }
  } finally {
   setLoading(false);
  }
 };

 const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
   style: "currency",
   currency: "USD",
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
  }).format(amount);
 };

 const navigateTo = (path) => {
  router.push(path);
 };

 if (loading) {
  return (
   <div
    style={{
     minHeight: "100vh",
     display: "flex",
     justifyContent: "center",
     alignItems: "center",
    }}
   >
    <div
     style={{
      width: "32px",
      height: "32px",
      border: `3px solid ${theme.colors.border}`,
      borderTop: `3px solid ${theme.colors.primary}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
     }}
    ></div>
    <style jsx>{`
     @keyframes spin {
      0% {
       transform: rotate(0deg);
      }
      100% {
       transform: rotate(360deg);
      }
     }
    `}</style>
   </div>
  );
 }

 return (
  <div
   style={{
    minHeight: "100vh",
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily:
     '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
   }}
  >
   <header
    style={{
     backgroundColor: theme.colors.background,
     borderBottom: `1px solid ${theme.colors.border}`,
     padding: "12px 0",
     marginBottom: "24px",
    }}
   >
    <div
     style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
     }}
    >
     <div
      style={{
       fontSize: "18px",
       fontWeight: "700",
       color: theme.colors.primary,
      }}
     >
      AI Escrow
     </div>
     <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <span
       style={{
        color: theme.colors.textSecondary,
        fontSize: "13px",
        fontWeight: "500",
        padding: "6px 12px",
        borderRadius: theme.borderRadius,
        cursor: "pointer",
        whiteSpace: "nowrap",
       }}
       onClick={() => navigateTo("/dashboard")}
      >
       Dashboard
      </span>
      <span
       style={{
        color: theme.colors.textSecondary,
        fontSize: "13px",
        fontWeight: "500",
        padding: "6px 12px",
        borderRadius: theme.borderRadius,
        cursor: "pointer",
        whiteSpace: "nowrap",
       }}
       onClick={() => navigateTo("/create-goal")}
      >
       Create Goal
      </span>
      <span
       style={{
        color: theme.colors.textSecondary,
        fontSize: "13px",
        fontWeight: "500",
        padding: "6px 12px",
        borderRadius: theme.borderRadius,
        backgroundColor: theme.colors.backgroundSecondary,
        cursor: "pointer",
        whiteSpace: "nowrap",
       }}
      >
       Wallet
      </span>
     </nav>
    </div>
   </header>

   <main
    style={{
     maxWidth: "800px",
     margin: "0 auto",
     padding: "0 12px",
    }}
   >
    <div
     style={{
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "#ffffff",
      borderRadius: theme.borderRadius,
      padding: "24px",
      marginBottom: "24px",
      textAlign: "center",
     }}
    >
     <h1
      style={{
       fontSize: "20px",
       fontWeight: "700",
       marginBottom: "8px",
       margin: 0,
      }}
     >
      {walletData.userName
       ? `Welcome back, ${walletData.userName}!`
       : "Your Wallet"}
     </h1>

     <div
      style={{
       fontSize: "36px",
       fontWeight: "700",
       marginTop: "16px",
       marginBottom: "8px",
      }}
     >
      {formatCurrency(walletData.walletBalance)}
     </div>

     <div
      style={{
       fontSize: "14px",
       opacity: 0.9,
       marginBottom: "16px",
      }}
     >
      Available Balance
     </div>

     <button
      onClick={fetchWalletData}
      disabled={loading}
      style={{
       backgroundColor: "rgba(255, 255, 255, 0.2)",
       color: "#ffffff",
       border: "1px solid rgba(255, 255, 255, 0.3)",
       borderRadius: theme.borderRadius,
       padding: "8px 16px",
       fontSize: "13px",
       fontWeight: "500",
       cursor: loading ? "not-allowed" : "pointer",
       opacity: loading ? 0.6 : 1,
      }}
     >
      {loading ? "Refreshing..." : "↻ Refresh Balance"}
     </button>
    </div>

    {error && (
     <div
      style={{
       backgroundColor: "#fee2e2",
       color: "#991b1b",
       border: "1px solid #fca5a5",
       borderRadius: theme.borderRadius,
       padding: "12px",
       marginBottom: "20px",
       textAlign: "center",
       fontSize: "14px",
      }}
     >
      <strong>Error:</strong> {error}
      <br />
      <button
       onClick={fetchWalletData}
       style={{
        backgroundColor: "transparent",
        color: "#991b1b",
        border: "1px solid #991b1b",
        borderRadius: theme.borderRadius,
        padding: "6px 12px",
        marginTop: "8px",
        cursor: "pointer",
        fontSize: "13px",
       }}
      >
       Try Again
      </button>
     </div>
    )}

    <div
     style={{
      backgroundColor: "#f0f9ff",
      border: "1px solid #0ea5e9",
      borderRadius: theme.borderRadius,
      padding: "16px",
      marginBottom: "24px",
     }}
    >
     <div
      style={{
       fontWeight: "600",
       color: "#0c4a6e",
       marginBottom: "8px",
       fontSize: "14px",
      }}
     >
      💡 How Your Escrow Wallet Works
     </div>
     <div style={{ fontSize: "13px", color: "#075985", lineHeight: "1.5" }}>
      When you create a goal, you deposit money that gets held in escrow. As you
      complete milestones, you receive proportional refunds back to your wallet.
      This creates accountability through loss aversion!
     </div>
    </div>

    <div
     style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
     }}
    >
     <div
      style={{
       backgroundColor: theme.colors.background,
       border: `1px solid ${theme.colors.border}`,
       borderRadius: theme.borderRadius,
       padding: "16px",
       boxShadow: theme.shadows.sm,
       textAlign: "center",
      }}
     >
      <div
       style={{
        fontSize: "20px",
        fontWeight: "700",
        color: theme.colors.error,
        marginBottom: "4px",
       }}
      >
       {formatCurrency(walletData.stats?.totalDeposited || 0)}
      </div>
      <div
       style={{
        fontSize: "12px",
        color: theme.colors.textSecondary,
        fontWeight: "500",
       }}
      >
       Total Deposited
      </div>
     </div>

     <div
      style={{
       backgroundColor: theme.colors.background,
       border: `1px solid ${theme.colors.border}`,
       borderRadius: theme.borderRadius,
       padding: "16px",
       boxShadow: theme.shadows.sm,
       textAlign: "center",
      }}
     >
      <div
       style={{
        fontSize: "20px",
        fontWeight: "700",
        color: theme.colors.success,
        marginBottom: "4px",
       }}
      >
       {formatCurrency(walletData.stats?.totalRefunded || 0)}
      </div>
      <div
       style={{
        fontSize: "12px",
        color: theme.colors.textSecondary,
        fontWeight: "500",
       }}
      >
       Total Refunded
      </div>
     </div>

     <div
      style={{
       backgroundColor: theme.colors.background,
       border: `1px solid ${theme.colors.border}`,
       borderRadius: theme.borderRadius,
       padding: "16px",
       boxShadow: theme.shadows.sm,
       textAlign: "center",
      }}
     >
      <div
       style={{
        fontSize: "20px",
        fontWeight: "700",
        color: theme.colors.primary,
        marginBottom: "4px",
       }}
      >
       {walletData.stats?.totalGoals || 0}
      </div>
      <div
       style={{
        fontSize: "12px",
        color: theme.colors.textSecondary,
        fontWeight: "500",
       }}
      >
       Total Goals
      </div>
     </div>

     <div
      style={{
       backgroundColor: theme.colors.background,
       border: `1px solid ${theme.colors.border}`,
       borderRadius: theme.borderRadius,
       padding: "16px",
       boxShadow: theme.shadows.sm,
       textAlign: "center",
      }}
     >
      <div
       style={{
        fontSize: "20px",
        fontWeight: "700",
        color: "#f59e0b",
        marginBottom: "4px",
       }}
      >
       {walletData.stats?.activeGoals || 0}
      </div>
      <div
       style={{
        fontSize: "12px",
        color: theme.colors.textSecondary,
        fontWeight: "500",
       }}
      >
       Active Goals
      </div>
     </div>
    </div>

    <div
     style={{
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius,
      padding: "20px",
      boxShadow: theme.shadows.sm,
      marginBottom: "20px",
     }}
    >
     <div
      style={{
       fontSize: "16px",
       fontWeight: "600",
       color: theme.colors.text,
       marginBottom: "12px",
      }}
     >
      🚀 Quick Actions
     </div>
     <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <button
       onClick={() => navigateTo("/create-goal")}
       style={{
        backgroundColor: theme.colors.primary,
        color: "#ffffff",
        border: "none",
        borderRadius: theme.borderRadius,
        padding: "10px 16px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
       }}
      >
       Create New Goal
      </button>

      <button
       onClick={() => navigateTo("/dashboard")}
       style={{
        backgroundColor: "transparent",
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
        borderRadius: theme.borderRadius,
        padding: "10px 16px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
       }}
      >
       View Dashboard
      </button>
     </div>
    </div>

    <div
     style={{
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius,
      padding: "20px",
      boxShadow: theme.shadows.sm,
      marginBottom: "20px",
     }}
    >
     <div
      style={{
       fontSize: "16px",
       fontWeight: "600",
       color: theme.colors.text,
       marginBottom: "12px",
      }}
     >
      📊 Transaction History
     </div>
     <div
      style={{
       textAlign: "center",
       padding: "32px 16px",
       color: theme.colors.textSecondary,
       fontStyle: "italic",
       fontSize: "14px",
      }}
     >
      <p style={{ margin: 0, marginBottom: "8px", fontSize: "16px" }}>
       🚧 Coming Soon
      </p>
      <p style={{ margin: 0 }}>
       Detailed transaction history with deposits, refunds, and goal completions
       will be available here.
      </p>
     </div>
    </div>

    <div
     style={{
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius,
      padding: "20px",
      boxShadow: theme.shadows.sm,
     }}
    >
     <div
      style={{
       fontSize: "16px",
       fontWeight: "600",
       color: theme.colors.text,
       marginBottom: "12px",
      }}
     >
      💪 Success Tips
     </div>
     <div
      style={{ fontSize: "14px", lineHeight: "1.6", color: theme.colors.text }}
     >
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
       <li style={{ marginBottom: "8px" }}>
        <strong>Start Small:</strong> Begin with achievable goals to build
        momentum.
       </li>
       <li style={{ marginBottom: "8px" }}>
        <strong>Be Specific:</strong> Detailed goal descriptions help AI create
        better milestones.
       </li>
       <li style={{ marginBottom: "8px" }}>
        <strong>Stay Consistent:</strong> Regular progress is key to maintaining
        motivation.
       </li>
       <li style={{ marginBottom: 0 }}>
        <strong>Celebrate Wins:</strong> Acknowledge each completed milestone!
       </li>
      </ul>
     </div>
    </div>
   </main>

   <style jsx>{`
    @keyframes spin {
     0% {
      transform: rotate(0deg);
     }
     100% {
      transform: rotate(360deg);
     }
    }
   `}</style>
  </div>
 );
}