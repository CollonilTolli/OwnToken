"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import { fetchJettonData, fetchJettonMetadata } from "@/helpers";

export default function BalanceWallet() {
  const wallet = useTonWallet();

  const [jettonArray, setJettonArray] = useState<any[] | null>(null);
  const [jettonMetadata, setJettonMetadata] = useState<any[] | null>(null);
  const walletAddress = wallet?.account?.address;

  useEffect(() => {
    const url = `https://tonapi.io/v2/jettons/${walletAddress}`;
    if (wallet) {
      (async () => {
        setJettonArray(await fetchJettonData(url));
      })();
    }
  }, [walletAddress, wallet]);

  useEffect(() => {
    if (jettonArray) {
      (async () => {
        const metadataPromises = jettonArray.map(async (jetton) => {
          const metadataUrl = `https://tonapi.io/v2/jetton/metadata?address=${jetton.jetton}`;
          const metadata = await fetchJettonMetadata(metadataUrl);
          return metadata;
        });

        const metadataArray = await Promise.all(metadataPromises);
        setJettonMetadata(metadataArray);
      })();
    }
  }, [jettonArray]);

  return (
    <Section header="Balance">
      {JSON.stringify(wallet)}
      {jettonMetadata &&
        jettonMetadata.map((metadata, index) => (
          <Cell
            key={index}
            after={<Info type="text">{metadata.balance}</Info>}
            before={<Avatar size={48} src={metadata.image} />}
          >
            {metadata.symbol || `Jetton ${index + 1}`}
          </Cell>
        ))}
    </Section>
  );
}
