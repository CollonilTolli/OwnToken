"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import TonConnect from "@tonconnect/sdk";
import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<any | null>(null);
  const [wallets, setWallets] = useState<any | null>(null);
  const connector = new TonConnect();

  const wallet = useTonWallet();
  const address = wallet?.account?.address;
  useEffect(() => {
    const url = `https://toncenter.com/api/v2/getAddressInformation?address=${address}`;
    if (address) {
      fetch(url)
        .then(async (response: any) => {
          const res = await response.json();
          console.log(res);
          setWalletBalance(parseFloat(res.result.balance) / 1e9);
        })
        .catch((error) => console.error(error));
    }
  }, [address]);
  (async () => {
    const wallets = await connector.getWallets();
    setWallets(wallets);
  })();
  return (
    <Section header="Balance">
      {JSON.stringify(wallets)}
      <Cell
        after={
          <Info subtitle="balance" type="text">
            {walletBalance}
          </Info>
        }
        before={<Avatar size={48} />}
        subtitle=""
      >
        TON
      </Cell>
    </Section>
  );
}
