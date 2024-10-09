"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import TonWeb from "tonweb";
import { fetchJettonData } from "@/helpers";

export default function BalanceWallet() {
  const tonweb = new TonWeb();
  const wallet = useTonWallet();

  const [jettonArray, setJettonArray] = useState<any[] | null>(null);
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
    console.log("aaaa");
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
