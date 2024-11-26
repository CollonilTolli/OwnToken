import { useState, useEffect } from "react";
import TonWeb from "tonweb";

const useJettonTransferHistory = (jettonWalletAddress: string) => {
  const [jettonTransferHistory, setJettonTransferHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false); // Initialize to false
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    const fetchTransferHistory = async () => {
      setLoadingHistory(true);
      setErrorHistory(null);
      let transactions: any[] = []; // Initialize to an empty array

      try {
        const tonweb = new TonWeb(
          new TonWeb.HttpProvider(
            "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
          )
        );
        transactions = await tonweb.provider.getTransactions(
          jettonWalletAddress,
          limit
        );
      } catch (error: any) {
        setErrorHistory(error.message);
        // Log the error for debugging purposes
        console.error("Error fetching transaction history:", error);
      } finally {
        setJettonTransferHistory(transactions); // Set the transactions even if there's an error
        setLoadingHistory(false);
      }
    };

    if (jettonWalletAddress) {
      fetchTransferHistory();
    } else {
      setJettonTransferHistory([]);
      setLoadingHistory(false); // Set loading to false when no address is provided
    }
  }, [jettonWalletAddress]);

  return { jettonTransferHistory, loadingHistory, errorHistory };
};

export default useJettonTransferHistory;
