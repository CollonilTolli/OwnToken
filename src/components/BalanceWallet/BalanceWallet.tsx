"use client";
import { useState, useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

export default function BalanceWallet() {
  const wallet = useTonWallet();
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  return (
    <Section header="Balance">
      {wallet && JSON.stringify(wallet)}
      {tokenBalance !== null && (
        <Cell
          after={
            <Info subtitle="balance" type="text">
              {tokenBalance} YOUR_TOKEN_SYMBOL
            </Info>
          }
          before={<Avatar size={48} />}
          subtitle="YOUR_TOKEN_SYMBOL"
        >
          EQAD2vAejy7hCfDmV5l246FYfA37AiV7TkWPIoR8i0EoGH2l
        </Cell>
      )}
    </Section>
  );
}
