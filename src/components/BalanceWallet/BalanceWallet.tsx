"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import TonWeb from "tonweb";

export default function BalanceWallet() {
  const tonweb = new TonWeb();
  const wallet = useTonWallet();

  const [jettonArray, setJettonArray] = useState<any[] | null>(null);
  const walletAddress = wallet?.account?.address;

  useEffect(() => {
    const url = `https://toncenter.com/api/v3/jetton/wallets?jetton=${walletAddress}`;
    if (wallet) {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setJettonArray(data.jetton_wallets);
          console.log("Список кошельков для токена:", jettonArray);
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
    }
  }, [walletAddress, wallet]);

  useEffect(() => {
    if (jettonArray !== null && jettonArray.length) {
      jettonArray.forEach((element) => {
        tonweb.provider
          //@ts-ignore
          .call("getJettonData", { address: element.jetton })
          .then((result) => {
            console.log("Информация о кошельке: ", result);
            // Обработка данных о токене
          });
      });
    }
  }, [jettonArray]);

  return (
    <Section header="Balance">
      {JSON.stringify(wallet)}
      <Cell after={<Info type="text">aaa</Info>} before={<Avatar size={48} />}>
        TON
      </Cell>
    </Section>
  );
}
