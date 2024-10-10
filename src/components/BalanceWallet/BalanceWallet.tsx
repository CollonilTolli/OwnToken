"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import TonWeb from "tonweb";
import { fetchJettonData, fetchJettonMetadata } from "@/helpers";

export default function BalanceWallet() {
  const tonweb = new TonWeb();
  const wallet = useTonWallet();
  const tonAddress = useTonAddress();

  const [jettonArray, setJettonArray] = useState<any[] | null>(null);
  const [jettonMetadata, setJettonMetadata] = useState<any[] | null>(null);
  const walletAddress = wallet?.account?.address;
  useEffect(() => {
    const url = `https://toncenter.com/api/v3/jetton/wallets?jetton=${walletAddress}`;
    if (wallet) {
      (async () => {
        setJettonArray(await fetchJettonData(url));
      })();
    }
  }, [walletAddress, wallet]);

  useEffect(() => {
    if (jettonArray) {
      (async () => {
        const metadataPromises = jettonArray.map(async (jetton, index) => {
          const metadataUrl = `https://toncenter.com/api/v3/jetton/masters?address=${jetton.jetton}`;
          return fetchJettonMetadata(metadataUrl, index);
        });

        const metadataArray = await Promise.all(metadataPromises);
        setJettonMetadata(metadataArray);
      })();
    }
  }, [jettonArray]);

  return (
    <Section header="Balance">
      {JSON.stringify(wallet)}
      {JSON.stringify(tonAddress)}
      {/* {jettonMetadata &&
        jettonMetadata.map((metadata, index) => (
          <Cell
            key={index}
            after={<Info type="text">{metadata.balance}</Info>}
            before={<Avatar size={48} src={metadata.image} />}
          >
            {metadata.symbol || `Jetton ${index + 1}`}
          </Cell>
        ))} */}
    </Section>
  );
}
