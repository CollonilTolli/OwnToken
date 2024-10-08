"use client";
import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { TonClient } from "@tonclient/core";

export default function BalanceWallet() {
  const wallet = useTonWallet();
  const [walletBalance, setWalletBalance] = useState<any | null>(null);
  const userAddress = wallet?.account.address;
  const DappServer = "net.ton.dev";
  const client = new TonClient({ network: { endpoints: [DappServer] } });

  let getBalance = async function (address: string) {
    try {
      console.log("address data", address);
      const batchQueryResult = (
        await client.net.batch_query({
          operations: [
            {
              type: "QueryCollection",
              collection: "accounts",
              filter: {
                id: {
                  eq: address,
                },
              },
              result: "balance",
            },
          ],
        })
      ).results;
      if (!batchQueryResult[0][0]) {
        throw Error;
      } else {
        let yourNumber = parseInt(batchQueryResult[0][0].balance, 16);
        console.log("Balance of wallet 1 is " + yourNumber + " grams");
        setWalletBalance(batchQueryResult);
        return { address: address, balance: yourNumber };
      }
    } catch (error: any) {
      console.error(error);
      throw [error.name, error.message];
    }
  };

  useEffect(() => {
    getBalance(userAddress || "");
  }, [userAddress]);

  return (
    <Section header="Balance">
      {JSON.parse(walletBalance)}
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
