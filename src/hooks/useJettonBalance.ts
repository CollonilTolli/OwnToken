import { useState, useEffect } from 'react';
import TonWeb from 'tonweb';

const useJettonBalance = (walletAddress: string, tonAddress: string) => {
  const [jettonBalance, setJettonBalance] = useState<string | null>(null);
  const [isTokenOwnerFromBalance, setisTokenOwnerFromBalance] = useState<boolean | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [errorBalance, setErrorBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoadingBalance(true);
      setErrorBalance(null);
      try {
        const tonweb = new TonWeb(
          new TonWeb.HttpProvider(
            "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
          )
        );
        const jettonWallet = new TonWeb.token.jetton.JettonWallet(
          tonweb.provider,
          { address: new TonWeb.utils.Address(walletAddress) }
        );
        const data = await jettonWallet.getData();

        setJettonBalance(data.balance.toString());
        setisTokenOwnerFromBalance(data.ownerAddress.toString(true, true, true) === tonAddress);
      } catch (errorBalance: any) {
        setErrorBalance(errorBalance.message);
      } finally {
        setLoadingBalance(false);
      }
    };

    if (walletAddress && tonAddress) {
      fetchBalance();
    } else {
      setJettonBalance(null);
      setisTokenOwnerFromBalance(null);
    }
  }, [walletAddress, tonAddress]);

  return { jettonBalance, isTokenOwnerFromBalance, loadingBalance, errorBalance };
};

export default useJettonBalance;

