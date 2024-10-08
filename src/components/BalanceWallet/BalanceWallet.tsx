"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import { TonClient } from "@ton/ton";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<any | null>(null);
  const wallet = useTonWallet(); // Получаем объект кошелька
  useEffect(() => {
    if (wallet) {
      const client = new TonClient({ endpoint: "https://mainnet.ton.dev" }); // Создаём TON Client для mainnet (замените на нужный endpoint)

      const address = wallet.account.address;

      client
        // @ts-ignore
        .getBalance(address)
        .then((balance) => {
          console.log("Баланс кошелька:", balance.toString());
          setWalletBalance(balance);
        })
        .catch((error) => {
          console.error("Ошибка при получении баланса:", error);
        });
    }
  }, [wallet, walletBalance]);
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
        subtitle=""
      />
    </Section>
  );
}
