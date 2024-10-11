"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { fetchJettonTransfers } from "@/helpers";

export default function BalanceWallet() {
  const wallet = useTonWallet();
  const tonAddress = useTonAddress();
  const [jettonTransfers, setJettonTransfers] = useState<any[] | null>(null);
  const [isTokenOwner, setIsTokenOwner] = useState(false);

  const walletAddress = wallet?.account?.address;

  useEffect(() => {
    if (walletAddress) {
      fetchJettonTransfers(walletAddress)
        .then((data) => {
          setJettonTransfers(data);
          const tokenAddress =
            "0:03daf01e8f2ee109f0e6579976e3a1587c0dfb02257b4e458f22847c8b412818";
          const isOwner = data.some(
            (transfer: any) => transfer.jetton_master === tokenAddress
          );
          setIsTokenOwner(isOwner);
        })
        .catch((error) => {
          console.error("Error fetching jetton transfers:", error);
        });
    }
  }, [walletAddress, wallet]);

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
