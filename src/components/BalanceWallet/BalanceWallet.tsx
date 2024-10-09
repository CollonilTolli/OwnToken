"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [wallets, setWallets] = useState<any[] | null>(null);

  const wallet = useTonWallet();
  const address = wallet?.account?.address;
  useEffect(() => {
    const url = `https://toncenter.com/api/v3/walletStates?address=${address}`;
    if (address) {
      fetch(url)
        .then(async (response: any) => {
          const res = await response.json();
          console.log(res);
          setWallets(res.wallets);
        })
        .catch((error) => console.error(error));
    }
  }, [address]);

  return wallets?.length ? (
    <Section header="Balance">
      {JSON.stringify(wallets)}
      {wallets.map((token) => (
        <Cell
          key={token.address}
          after={<Info type="text">{token.balance}</Info>}
          before={<Avatar size={48} />}
        >
          TON
        </Cell>
      ))}
    </Section>
  ) : (
    <></>
  );
}
