import { useState, useEffect } from "react";
import TonWeb from "tonweb";

const useJettonWalletAddress = (
  jettonMasterAddress: string,
  ownerWalletAddress: string
) => {
  const [jettonWalletAddress, setJettonWalletAddress] = useState<string | null>(
    null
  );
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [errorWallet, setErrorWallet] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      setLoadingWallet(true);
      setErrorWallet(null);
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

        const jettonWalletAddressResult =
          await jettonMinter.getJettonWalletAddress(
            new TonWeb.utils.Address(ownerWalletAddress)
          );

        if (jettonWalletAddressResult) {
          // Проверка на null или undefined
          const jettonWallet = new TonWeb.token.jetton.JettonWallet(
            tonweb.provider,
            { address: jettonWalletAddressResult }
          );
          try {
            const jettonData = await jettonWallet.getData();
            if (
              jettonData.jettonMinterAddress.toString(false) !==
              jettonMinter.address?.toString(false)
            ) {
              throw new Error("Jetton minter address mismatch");
            }
            setJettonWalletAddress(jettonWalletAddressResult.toString(true)); // Изменено на toString(true)
          } catch (getDataError: any) {
            setErrorWallet(
              `Error getting jetton wallet data: ${getDataError.message}`
            );
          }
        } else {
          setErrorWallet("Jetton wallet address not found");
        }
      } catch (error: any) {
        setErrorWallet(
          `Error fetching jetton wallet address: ${error.message}`
        );
      } finally {
        setLoadingWallet(false);
      }
    };

    if (jettonMasterAddress && ownerWalletAddress) {
      fetchWalletAddress();
    } else {
      setJettonWalletAddress(null);
    }
  }, [jettonMasterAddress, ownerWalletAddress]);

  return { jettonWalletAddress, loadingWallet, errorWallet };
};

export default useJettonWalletAddress;
