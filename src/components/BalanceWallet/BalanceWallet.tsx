"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { useTonWallet } from "@tonconnect/ui-react";
export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<any | null>(null);
  const wallet = useTonWallet();
  useEffect(() => {
    fetch("https://ton.org/services/jsonrpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "get_balance",
        params: [wallet?.account.address],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        setWalletBalance(data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [wallet]);
  return (
    <Section header="Balance">
      {JSON.parse(walletBalance)}
      <Cell
        after={
          <Info subtitle="balance" type="text">
            {walletBalance ? walletBalance : "Loading..."}
          </Info>
        }
        before={<Avatar size={48} />}
        subtitle=""
      />
    </Section>
  );
}
