"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const wallet = useTonWallet();
  const walletAddress = wallet?.account?.address;
  const jettokenId =
    "0:123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  useEffect(() => {
    const url = `https://toncenter.com/api/v3/jetton/wallets?jetton=${jettokenId}`;
    if (wallet) {
      // Выполняем Fetch-запрос
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
          // Обрабатываем данные, полученные из TON Center
          console.log("Список кошельков для токена:", data);

          // Проверяем, есть ли ваш адрес в списке кошельков
          const hasWallet = data.wallets.some(
            (wallet: any) => wallet === walletAddress
          );
          if (hasWallet) {
            console.log(`Адрес ${walletAddress} найден в списке кошельков.`);
            // Можно получить информацию о балансе токена на этом адресе
          } else {
            console.log(`Адрес ${walletAddress} не найден в списке кошельков.`);
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
    }
  }, [walletAddress, walletBalance]);

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
