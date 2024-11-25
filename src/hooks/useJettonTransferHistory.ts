import { useState, useEffect } from "react";
import TonWeb from "tonweb";

const useJettonTransferHistory = (jettonWalletAddress: string) => {
  const [jettonTransferHistory, setJettonTransferHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    const fetchTransferHistory = async () => {
      setLoadingHistory(true);
      setErrorHistory(null);
      try {
        const tonweb = new TonWeb(
          new TonWeb.HttpProvider(
            "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
          )
        );
        const transactions = await tonweb.provider.getTransactions(
          jettonWalletAddress,
          limit
        );
        setJettonTransferHistory(transactions);
      } catch (errorHistory: any) {
        setErrorHistory(errorHistory.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (jettonWalletAddress) {
      fetchTransferHistory();
    } else {
      setJettonTransferHistory([]);
    }
  }, [jettonWalletAddress]);

  return { jettonTransferHistory, loadingHistory, errorHistory };
};

export default useJettonTransferHistory;
