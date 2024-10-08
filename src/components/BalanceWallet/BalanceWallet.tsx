"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { useTonWallet } from "@tonconnect/ui-react";
import { TonClient, WalletContractV4 } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

export default function BalanceWallet() {
  const [walletBalance, setWalletBalance] = useState<any | null>(null);
  const wallet = useTonWallet();

  (async function () {
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });
    if (wallet) {
      // Convert workchain to a number
      const workchain = parseInt(wallet.account.chain, 10); // Assuming chain is a string

      // Create publicKey Buffer if it's defined
      let publicKeyBuffer;
      if (wallet.account.publicKey !== undefined) {
        publicKeyBuffer = Buffer.from(wallet.account.publicKey, "hex"); // Assuming publicKey is a hex string
      }

      let wallet1 = WalletContractV4.create({
        workchain: workchain,
        publicKey: publicKeyBuffer ?? Buffer.alloc(32), // Default value if undefined
      });
      // Handle the case where publicKeyBuffer is undefined
      if (publicKeyBuffer === undefined) {
        console.error("Wallet public key is not available.");
        return; // Or handle the situation differently
      }

      let walletContract = client.open(wallet1);
      let balance: bigint = await walletContract.getBalance();
      setWalletBalance(balance);
    }
  })();

  return (
    <Section header="Balance">
      {JSON.stringify(walletBalance)}
      <Cell
        after={
          <Info subtitle="balance" type="text">
            {walletBalance ? walletBalance : "Loading..."}
          </Info>
        }
        before={<Avatar size={48} />}
        subtitle=""
      />
    </Section>
  );
}
