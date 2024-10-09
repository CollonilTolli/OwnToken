"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<any | null>(null);

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
  }, [address, walletBalance]);

  return walletBalance ? (
    <Section header="Balance">
      {JSON.stringify(walletBalance)}
      <Cell
        after={<Info type="text">{walletBalance}</Info>}
        before={<Avatar size={48} />}
      >
        TON
      </Cell>
    </Section>
  ) : (
    <></>
  );
}
