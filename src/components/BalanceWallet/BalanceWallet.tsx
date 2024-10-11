"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import TonWeb from "tonweb";

export default function BalanceWallet() {
  const wallet = useTonWallet();
  const tonAddress = useTonAddress(false);
  const [jettonTransfers, setJettonTransfers] = useState<any[] | null>(null);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [jettonBalance, setJettonBalance] = useState<string | null>(null);
  const [jettonInfo, setJettonInfo] = useState<any | null>(null);
  const [jettonWalletAddress, setJettonWalletAddress] = useState<string | null>(
    null
  );
  const jettonMasterAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  useEffect(() => {
    if (tonAddress && jettonMasterAddress) {
      fetchJettonMetadata(jettonMasterAddress);
      fetchJettonWalletAddress(jettonMasterAddress, tonAddress);
    }
    console.log(jettonInfo);
  }, [tonAddress]);

  useEffect(() => {
    if (jettonWalletAddress) {
      fetchJettonBalance(jettonWalletAddress);
    }
  }, [jettonWalletAddress]);

  const fetchJettonMetadata = async (jettonMasterAddress: string) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        {
          address: jettonMasterAddress,
          adminAddress: new TonWeb.utils.Address(jettonMasterAddress), // Для примера, используем тот же адрес
          jettonContentUri: "", // Пустой URI для примера
          jettonWalletCodeHex: "", // Пустой код для примера
        }
      );
      const data = await jettonMinter.getJettonData();

      setJettonInfo({
        totalSupply: data.totalSupply.toString(),
        jettonContentUri: data.jettonContentUri,
      });
    } catch (error) {
      console.error("Error fetching jetton metadata:", error);
    }
  };

  const fetchJettonWalletAddress = async (
    jettonMasterAddress: string,
    ownerWalletAddress: string
  ) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        {
          address: jettonMasterAddress,
          adminAddress: new TonWeb.utils.Address(jettonMasterAddress), // Для примера, используем тот же адрес
          jettonContentUri: "", // Пустой URI для примера
          jettonWalletCodeHex: "", // Пустой код для примера
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
        jettonMinter.address?.toString(false)
      ) {
        throw new Error(
          "Jetton minter address from jetton wallet does not match the expected minter address"
        );
      }

      setJettonWalletAddress(jettonWalletAddress.toString(true, true, true));
    } catch (error) {
      console.error("Error fetching jetton wallet address:", error);
    }
  };

  const fetchJettonBalance = async (walletAddress: string) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const jettonWallet = new TonWeb.token.jetton.JettonWallet(
        tonweb.provider,
        { address: walletAddress }
      );
      const data = await jettonWallet.getData();

      setJettonBalance(data.balance.toString());
      setIsTokenOwner(
        data.ownerAddress.toString(true, true, true) === tonAddress
      );
    } catch (error) {
      console.error("Error fetching jetton balance:", error);
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
          {jettonBalance && <Info type="text">{jettonBalance}</Info>}
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
      {jettonInfo && (
        <Cell
          after={<Info type="text">{jettonInfo.totalSupply}</Info>}
          before={<Avatar size={48} src={jettonInfo.jettonContentUri} />}
        >
          Jetton Metadata
        </Cell>
      )}
      {jettonWalletAddress && (
        <Cell after={<Info type="text">{jettonWalletAddress}</Info>}>
          Jetton Wallet Address
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
