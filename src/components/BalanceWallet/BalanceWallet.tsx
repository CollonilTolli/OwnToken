"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  const wallet = useTonWallet();
  const address = wallet?.account?.address;

  useEffect(() => {
    const url = `https://toncenter.com/api/v2/getAddressInformation?address=${address}`;
    if (address) {
      fetch(url)
        .then(async (response: any) => {
          const res = await response.json();
          console.log(res);
          setWalletBalance(parseFloat(res.result.balance) / 1e9);

          // Запрос информации о токенах
          const tokensUrl = `https://toncenter.com/api/v2/getAddressTokens?address=${address}`;
          fetch(tokensUrl)
            .then(async (tokensResponse: any) => {
              const tokensRes = await tokensResponse.json();
              console.log(tokensRes);
              setTokens(tokensRes.result);
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    }
  }, [address, walletBalance]);

  return walletBalance !== null ? (
    <Section header="Balance">
      <Cell
        after={<Info type="text">{walletBalance}</Info>}
        before={<Avatar size={48} />}
      >
        TON
      </Cell>
      {tokens.map((token, index) => (
        <Cell
          key={index}
          after={<Info type="text">{token.balance}</Info>}
          before={<Avatar size={48} />}
        >
          {token.name}
        </Cell>
      ))}
    </Section>
  ) : (
    <></>
  );
}
