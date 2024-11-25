import { useState, useEffect } from "react";
import TonWeb from "tonweb";

const useJettonMetadata = (jettonMasterAddress: string) => {
  const [jettonData, setJettonData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);
      try {
        const tonweb = new TonWeb(
          new TonWeb.HttpProvider(
            "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
          )
        );
        const jettonMinter = new TonWeb.token.jetton.JettonMinter(
          tonweb.provider,
          {
            address: new TonWeb.utils.Address(jettonMasterAddress),
            adminAddress: new TonWeb.utils.Address(jettonMasterAddress),
            jettonContentUri: "",
            jettonWalletCodeHex: "",
          }
        );
        const data = await jettonMinter.getJettonData();
        setJettonData(data);
      } catch (error: any) {
        setError(error.message); // More specific error handling
      } finally {
        setLoading(false);
      }
    };

    if (jettonMasterAddress) {
      fetchMetadata();
    } else {
      setJettonData(null); // Clear data if address is empty
    }
  }, [jettonMasterAddress]);

  return { jettonData, loading, error };
};

export default useJettonMetadata;
