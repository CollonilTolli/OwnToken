"use client";
import { useState, useEffect, useCallback } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { TonClient } from "@tonclient/core";

export default function BalanceWallet() {
  const wallet = useTonWallet();
  const client = new TonClient();
  const [walletBalance, setWalletBalance] = useState(null);
  const getBalance = useCallback(async () => {
    try {
      const result = await client.request("get_account_state", {
        address: wallet?.account.address,
      });

      if (result.account_state) {
        const balance = result.account_state.balance;
        console.log("Баланс кошелька:", balance);
        setWalletBalance(balance);
      } else {
        console.log("Ошибка: аккаунт не найден");
      }
    } catch (error) {
      console.error("Ошибка получения баланса:", error);
    }
  }, [client, wallet]);

  useEffect(() => {
    getBalance();
    console.log(wallet);
  }, [wallet, getBalance]);

  return (
    <Section header="Balance">
      {wallet && JSON.stringify(walletBalance)}
      {walletBalance !== null && (
        <Cell
          after={
            <Info subtitle="balance" type="text">
              {walletBalance} YOUR_TOKEN_SYMBOL
            </Info>
          }
          before={<Avatar size={48} />}
          subtitle=""
        >
          EQAD2vAejy7hCfDmV5l246FYfA37AiV7TkWPIoR8i0EoGH2l
        </Cell>
      )}
    </Section>
  );
}
