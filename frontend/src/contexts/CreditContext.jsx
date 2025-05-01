import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { creditService } from "../services/api";

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
      // Fetch current credit balance and transaction history
      fetchCreditData();
    } else {
      setCredits(0);
      setTransactions([]);
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // Fetch credit balance and transaction history
  const fetchCreditData = async () => {
    try {
      setLoading(true);

      // Get credit balance
      const balanceResponse = await creditService.getBalance();
      if (balanceResponse.data.success) {
        setCredits(balanceResponse.data.balance);
      }

      // Get transaction history
      const transactionResponse = await creditService.getTransactions();
      if (transactionResponse.data.success) {
        setTransactions(transactionResponse.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching credit data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Earn credits function - this would be handled by backend logic
  // Frontend just needs to refresh the credit data
  const refreshCreditData = async () => {
    await fetchCreditData();
  };

  // Spend credits function
  const spendCredits = async (amount, description) => {
    try {
      // Check if user has enough credits
      if (credits < amount) {
        throw new Error("Insufficient credits");
      }

      const response = await creditService.redeemCredits({
        amount,
        description,
      });

      if (response.data.success) {
        // Refresh credit data to get updated balance and transactions
        await fetchCreditData();
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Error spending credits:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  };

  const value = {
    credits,
    transactions,
    loading,
    refreshCreditData,
    spendCredits,
  };

  return (
    <CreditContext.Provider value={value}>{children}</CreditContext.Provider>
  );
};

export default CreditContext;
