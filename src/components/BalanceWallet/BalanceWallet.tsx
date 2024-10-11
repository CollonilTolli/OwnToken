"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const wallet = useTonWallet();
  const tonAddress = useTonAddress(false);
  const [jettonTransfers, setJettonTransfers] = useState<any[] | null>(null);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [jettonBalance, setJettonBalance] = useState<string | null>(null); // Добавьте состояние для баланса
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const jettonTokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  useEffect(() => {
    const fetchTokenData = async () => {
      if (jettonTokenAddress) {
        // Получаем адрес кошелька
        const jettonWalletAddress = await fetchJettonWalletAddress(
          jettonTokenAddress,
          tonAddress
        );
        if (jettonWalletAddress) {
          setIsTokenOwner(true);

          // Получаем баланс
          const balance = await fetchJettonBalance(jettonWalletAddress);
          setJettonBalance(balance);
        }
      }
    };

    if (tonAddress) {
      fetchTokenData();
    }
  }, [tonAddress, jettonTokenAddress]);

  // Функция для получения адреса кошелька (осталась без изменений)
  const fetchJettonWalletAddress = async (
    jettonMasterAddress: string,
    ownerWalletAddress: string
  ): Promise<string | null> => {
    try {
      const TonWeb = require("tonweb");

      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );

      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        {
          address: jettonMasterAddress,
        }
      );

      const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
        new TonWeb.utils.Address(ownerWalletAddress)
      );

      const jettonWallet = new TonWeb.token.jetton.JettonWallet(
        tonweb.provider,
        {
          address: jettonWalletAddress,
        }
      );

      const jettonData = await jettonWallet.getData();

      // Verify that the Jetton Minter address matches
      if (
        jettonData.jettonMinterAddress.toString(false) !==
        jettonMinter.address.toString(false)
      ) {
        throw new Error(
          "Jetton minter address from jetton wallet does not match the expected minter address"
        );
      }

      return jettonWalletAddress.toString(true, true, true);
    } catch (error) {
      console.error("Error fetching jetton wallet address:", error);
      return null;
    }
  };

  // Функция для получения баланса Jetton
  const fetchJettonBalance = async (walletAddress: string) => {
    try {
      const TonWeb = require("tonweb");

      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/your-project-id/api/v2/jsonRPC"
        )
      );

      const jettonWallet = new TonWeb.token.jetton.JettonWallet(
        tonweb.provider,
        { address: walletAddress }
      );
      const data = await jettonWallet.getData();

      return data.balance.toString();
    } catch (error) {
      console.error("Error fetching jetton balance:", error);
      return null;
    }
  };

  return (
    <Section header="Balance">
      {isTokenOwner ? (
        <Cell
          after={<Info type="text">Owner</Info>}
          before={
            <Avatar
              size={48}
              src="https://cache.tonapi.io/imgproxy/FEqFdmn6fBXy0TLzRr1mTQOqP4E3LqBBAO6pKENYur0/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLmliYi5jby9jTGNuVHd4L2ltYWdlLmpwZw.webp"
            />
          }
        >
          WOT Token
          {jettonBalance && <Info type="text">{jettonBalance}</Info>}{" "}
          {/* Отображение баланса */}
        </Cell>
      ) : (
        <Cell
          after={<Info type="text">Not Owner</Info>}
          before={
            <Avatar
              size={48}
              src="https://cache.tonapi.io/imgproxy/FEqFdmn6fBXy0TLzRr1mTQOqP4E3LqBBAO6pKENYur0/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLmliYi5jby9jTGNuVHd4L2ltYWdlLmpwZw.webp"
            />
          }
        >
          WOT Token
        </Cell>
      )}
      {jettonTransfers &&
        jettonTransfers.map((transfer: any, index: number) => (
          <Cell
            key={index}
            after={<Info type="text">{transfer.amount}</Info>}
            before={<Avatar size={48} src={transfer.image} />}
          >
            {transfer.symbol || `Jetton ${index + 1}`}
          </Cell>
        ))}
    </Section>
  );
}
