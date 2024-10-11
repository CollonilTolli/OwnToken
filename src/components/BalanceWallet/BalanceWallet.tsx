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
      fetchJettonTransfers("UQA8z5CRRr7-uexcyPNg1yqb310vgFCd0k3SL2mvOQeaWfQc")
        .then((data) => {
          setJettonTransfers(data);
          const tokenAddress =
            "0:09f2e59dec406ab26a5259a45d7ff23ef11f3e5c7c21de0b0d2a1cbe52b76b3d";
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
