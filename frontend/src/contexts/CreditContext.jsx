import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Create the context
const CreditContext = createContext();

// Custom hook to use the credit context
export const useCredits = () => {
  return useContext(CreditContext);
};

// Provider component
export const CreditProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch credits data if user is authenticated
    if (isAuthenticated && currentUser) {
      // Set initial credits from user data
      setCredits(currentUser.credits || 0);
      // Fetch transaction history (would be an API call in a real app)
      fetchTransactionHistory();
    } else {
      setCredits(0);
      setTransactions([]);
    }
    setLoading(false);
  }, [isAuthenticated, currentUser]);

  // Mock transactions for frontend development
  const mockTransactions = [
    {
      id: "1",
      type: "earned",
      amount: 15,
      description: "Shared: Introduction to GraphQL",
      date: "2025-04-25T14:30:00Z",
    },
    {
      id: "2",
      type: "earned",
      amount: 5,
      description: "Commented on: Machine Learning Basics",
      date: "2025-04-23T09:15:00Z",
    },
    {
      id: "3",
      type: "earned",
      amount: 1,
      description: "Upvoted: JavaScript ES2025 Features",
      date: "2025-04-21T16:45:00Z",
    },
    {
      id: "4",
      type: "spent",
      amount: 200,
      description: "Purchased: Advanced React Patterns Course",
      date: "2025-04-19T11:20:00Z",
    },
  ];

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    try {
      // This would be an API call in a real app
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  // Earn credits function
  const earnCredits = async (amount, description) => {
    try {
      // This would be an API call in a real app
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new transaction
      const newTransaction = {
        id: Date.now().toString(),
        type: "earned",
        amount,
        description,
        date: new Date().toISOString(),
      };

      // Update state
      setCredits((prev) => prev + amount);
      setTransactions((prev) => [newTransaction, ...prev]);

      return { success: true };
    } catch (error) {
      console.error("Error earning credits:", error);
      return { success: false, error: error.message };
    }
  };

  // Spend credits function
  const spendCredits = async (amount, description) => {
    try {
      // Check if user has enough credits
      if (credits < amount) {
        throw new Error("Insufficient credits");
      }

      // This would be an API call in a real app
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new transaction
      const newTransaction = {
        id: Date.now().toString(),
        type: "spent",
        amount,
        description,
        date: new Date().toISOString(),
      };

      // Update state
      setCredits((prev) => prev - amount);
      setTransactions((prev) => [newTransaction, ...prev]);

      return { success: true };
    } catch (error) {
      console.error("Error spending credits:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    credits,
    transactions,
    loading,
    earnCredits,
    spendCredits,
  };

  return (
    <CreditContext.Provider value={value}>{children}</CreditContext.Provider>
  );
};

export default CreditContext;
