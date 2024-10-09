"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const wallet = useTonWallet();
  const address = wallet?.account?.address;
  useEffect(() => {
    const url = `https://tonapi.io/v2/jettons/${address}/holders`;
    if (address) {
      fetch(url)
        .then(async (response: any) => {
          const res = await response.json();
          console.log(res);
          setWalletBalance(res.result.balance);
        })
        .catch((error) => console.error(error));
    }
  }, [address, walletBalance]);

  return walletBalance !== null ? (
    <Section header="Balance">
      {JSON.stringify(wallet)}
      <Cell
        after={<Info type="text">{walletBalance}</Info>}
        before={<Avatar size={48} />}
      >
        TON
      </Cell>
    </Section>
  ) : (
    <>{JSON.stringify(wallet)}</>
  );
}
