"use client";
import { useState, useEffect } from "react";
import {
  Section,
  Cell,
  Info,
  Avatar,
  Button,
} from "@telegram-apps/telegram-ui";
import { useTonAddress } from "@tonconnect/ui-react";
import TonWeb from "tonweb";
import { getInviteLink, removeUser } from "@/helpers";

export default function BalanceWallet() {
  const tonAddress = useTonAddress(false);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [jettonBalance, setJettonBalance] = useState<string | null>(null);
  const [channelLink, setChannelLink] = useState("");
  const [jettonWalletAddress, setJettonWalletAddress] = useState<string | null>(
    null
  );
  const [userData, setUserData] = useState(null);
  const [jettonTransferHistory, setJettonTransferHistory] = useState<
    any[] | null
  >(null);
  const jettonMasterAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  useEffect(() => {
    if (window) {
      //@ts-ignore
      let tg = window.Telegram.WebApp;
      if (!isTokenOwner) {
        removeUser(tg.initDataUnsafe.user.id);
        return;
      }
    }
  }, [isTokenOwner]);

  useEffect(() => {
    if (tonAddress && jettonMasterAddress) {
      fetchJettonMetadata(jettonMasterAddress);
      fetchJettonWalletAddress(jettonMasterAddress, tonAddress);
    }
  }, [tonAddress, jettonMasterAddress]);

  useEffect(() => {
    if (jettonWalletAddress) {
      fetchJettonBalance(jettonWalletAddress);
      fetchJettonTransferHistory(jettonWalletAddress);
    }
  }, [jettonWalletAddress]);

  useEffect(() => {
    if (isTokenOwner) {
      const getLink = async () => {
        try {
          const link = await getInviteLink();
          setChannelLink(link);
        } catch (error) {
          console.error("Ошибка при получении ссылки:", error);
        }
      };
      getLink();
    }
  }, [isTokenOwner]);

  const fetchJettonMetadata = async (jettonMasterAddress: string) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        {
          address: new TonWeb.utils.Address(jettonMasterAddress),
          adminAddress: new TonWeb.utils.Address(jettonMasterAddress),
          jettonContentUri: "",
          jettonWalletCodeHex: "",
        }
      );
      const data = await jettonMinter.getJettonData();
    } catch (error) {
      console.error("Error fetching jetton metadata:", error);
    }
  };

  const fetchJettonWalletAddress = async (
    jettonMasterAddress: string,
    ownerWalletAddress: string
  ) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        {
          address: new TonWeb.utils.Address(jettonMasterAddress),
          adminAddress: new TonWeb.utils.Address(jettonMasterAddress), // Для примера, используем тот же адрес
          jettonContentUri: "", // Пустой URI для примера
          jettonWalletCodeHex: "", // Пустой код для примера
        }
      );

      const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
        new TonWeb.utils.Address(ownerWalletAddress)
      );

      const jettonWallet = new TonWeb.token.jetton.JettonWallet(
        tonweb.provider,
        {
          address: jettonWalletAddress,
        }
      );

      const jettonData = await jettonWallet.getData();

      // Verify that the Jetton Minter address matches
      if (
        jettonData.jettonMinterAddress.toString(false) !==
        jettonMinter.address?.toString(false)
      ) {
        throw Error(
          "Jetton minter address from jetton wallet does not match the expected minter address"
        );
      }

      setJettonWalletAddress(jettonWalletAddress.toString(true, true, true));
    } catch (error) {
      console.error("Error fetching jetton wallet address:", error);
    }
  };

  const fetchJettonBalance = async (walletAddress: string) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const jettonWallet = new TonWeb.token.jetton.JettonWallet(
        tonweb.provider,
        { address: new TonWeb.utils.Address(walletAddress) }
      );
      const data = await jettonWallet.getData();

      setJettonBalance(data.balance.toString());
      setIsTokenOwner(
        data.ownerAddress.toString(true, true, true) === tonAddress
      );
    } catch (error) {
      console.error("Error fetching jetton balance:", error);
    }
  };

  const fetchJettonTransferHistory = async (jettonWalletAddress: string) => {
    try {
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
          "https://ton-mainnet.core.chainstack.com/7d3fbedb3a3fe58eee4db369bec8cfec/api/v2/jsonRPC"
        )
      );
      const limit = 10;
      const transactions = await tonweb.provider.getTransactions(
        jettonWalletAddress,
        limit
      );

      setJettonTransferHistory(transactions);
    } catch (error) {
      console.error("Error fetching jetton transfer history:", error);
    }
  };

  return (
    <Section header="Balance">
      <Button
        Component="button"
        onClick={() => setIsTokenOwner(!isTokenOwner)}
        mode="bezeled"
        size="m"
      >
        Owner?
      </Button>
      {isTokenOwner ? (
        <>
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
            {jettonBalance && <Info type="text">{jettonBalance}</Info>}
          </Cell>
          <Cell>
            <Button
              Component="a"
              href={channelLink}
              mode="filled"
              size="l"
              target="_blank"
            >
              Private Telegram Chammel
            </Button>{" "}
          </Cell>
        </>
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
      {jettonWalletAddress && (
        <Cell after={<Info type="text">{jettonWalletAddress}</Info>}>
          Jetton Wallet Address
        </Cell>
      )}

      {jettonTransferHistory &&
        jettonTransferHistory.map((tx: any, index: number) => (
          <Cell
            key={index}
            after={
              <Info type="text">{new Date(tx.utime * 1000).toISOString()}</Info>
            }
            before={
              <Avatar
                size={48}
                src="https://cache.tonapi.io/imgproxy/FEqFdmn6fBXy0TLzRr1mTQOqP4E3LqBBAO6pKENYur0/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLmliYi5jby9jTGNuVHd4L2ltYWdlLmpwZw.webp"
              />
            }
          >
            Transaction {index + 1}
          </Cell>
        ))}
    </Section>
  );
}
