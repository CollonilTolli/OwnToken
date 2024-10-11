"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { fetchJettonTransfers } from "@/helpers";
import TonConnect from "@tonconnect/sdk";

export default function BalanceWallet() {
  const tonConnect = new TonConnect();
  const wallet = useTonWallet();
  const tonAddress = useTonAddress(false);
  const [jettonTransfers, setJettonTransfers] = useState<any[] | null>(null);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<any[] | null>(null);

  const jettonAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  useEffect(() => {
    if (tonAddress) {
      fetchJettonTransfers(tonAddress)
        .then((data) => {
          setJettonTransfers(data);
          const isOwner = data.some(
            (transfer: any) => transfer.jetton_master === jettonAddress
          );
          setIsTokenOwner(isOwner);
        })
        .catch((error) => {
          console.error("Error fetching jetton transfers:", error);
        });
    }
  }, [tonAddress, jettonAddress, wallet]);

  useEffect(() => {
    (async () => {
      // const balance = await tonConnect.getBalance(tonAddress, jettonAddress);
      // setTokenBalance(balance)
      const wallets = await tonConnect.getWallets();
      setTokenBalance(wallets);
      console.log(tokenBalance);
    })();
  }, [tonConnect]);
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
