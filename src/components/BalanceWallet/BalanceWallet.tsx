"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import { TonClient } from "@ton/ton";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<any | null>(null);
  const wallet = useTonWallet();
  const address = wallet?.account?.address;

  useEffect(() => {
    const url = `https://toncenter.com/api/v2/getAddressInformation?address=${address}`;
    if (address) {
      fetch(url)
        .then(async (response: any) => {
          const res = response.json();
          console.log(res);
          setWalletBalance(parseFloat(res.result.balance) / 1e9);
        })
        .catch((error) => console.error(error));
    }
  }, [address]);

  return (
    <Section header="Balance">
      {JSON.stringify(walletBalance)}
      <Cell
        after={
          <Info subtitle="balance" type="text">
            {walletBalance ? walletBalance : "Loading..."}
          </Info>
        }
        before={<Avatar size={48} />}
        subtitle="TON"
      />
    </Section>
  );
}
