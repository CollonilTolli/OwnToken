"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [walletTokens, setWalletTokens] = useState<
    { name: string; balance: number }[]
  >([]);

  const wallet = useTonWallet();
  const address = wallet?.account?.address;

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (address) {
        const url = `https://toncenter.com/api/v2/getAddressInformation?address=${address}`;
        try {
          const response = await fetch(url);
          const data = await response.json();

          // Extract tokens from the API response
          const tokens = Object.entries(data.result.balance)
            .filter(([key, value]) => key !== "balance")
            .map(([key, value]) => ({
              name: key, //@ts-ignore
              balance: parseFloat(value) / 1e9, // Convert balance to human-readable format
            }));

          setWalletTokens(tokens);
        } catch (error) {
          console.error("Error fetching token balances:", error);
        }
      }
    };

    fetchTokenBalances();
  }, [address]);

  return walletTokens !== null ? (
    <Section header="Balance">
      {JSON.stringify(walletTokens)}
      {walletTokens.map((el) => (
        <Cell
          key={el.name}
          after={<Info type="text">{el.balance}</Info>}
          before={<Avatar size={48} />}
        >
          {el.name}
        </Cell>
      ))}
    </Section>
  ) : (
    <></>
  );
}
