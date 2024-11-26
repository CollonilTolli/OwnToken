"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import {
  Section,
  Cell,
  Info,
  Avatar,
  Button,
  Spinner,
} from "@telegram-apps/telegram-ui";
import { useTonAddress } from "@tonconnect/ui-react";
import { getInviteLink, removeUser } from "@/helpers";
import useJettonBalance from "@/hooks/useJettonBalance";
import useJettonTransferHistory from "@/hooks/useJettonTransferHistory";
import useJettonWalletAddress from "@/hooks/useJettonWalletAddress";
import { useDebounce } from "@/hooks/useDebounce";

export default function BalanceWallet() {
  const tonAddress = useTonAddress(false);
  const jettonMasterAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "";
  const [isTokenOwner, setIsTokenOwner] = useState<boolean>(false);
  const [channelLink, setChannelLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { jettonWalletAddress, loadingWallet, errorWallet } =
    useJettonWalletAddress(jettonMasterAddress, tonAddress);

  const { jettonBalance, loadingBalance, errorBalance } = useJettonBalance(
    jettonWalletAddress || "",
    tonAddress || ""
  );
  const { jettonTransferHistory, loadingHistory, errorHistory } =
    useJettonTransferHistory(jettonWalletAddress || "");

  useLayoutEffect(() => {
    setIsLoading(loadingBalance || loadingHistory);
  }, [loadingBalance, loadingHistory]);

  useEffect(() => {
    if (!loadingBalance && !loadingHistory && !loadingWallet) {
      if (
        jettonBalance !== "0" &&
        jettonBalance !== null &&
        jettonTransferHistory !== null
      ) {
        setIsTokenOwner(
          jettonBalance.length > 0 && jettonTransferHistory.length > 0
        );
      } else {
        setIsTokenOwner(false);
      }
    }
  }, [jettonBalance, jettonTransferHistory, loadingBalance, loadingHistory]);

  const debouncedRemoveUser = useDebounce(removeUser, 10000);

  useLayoutEffect(() => {
    if (window && !isLoading) {
      //@ts-ignore
      const tg = window.Telegram.WebApp;
      if (!isTokenOwner && tg.initDataUnsafe) {
        debouncedRemoveUser(tg.initDataUnsafe.user.id);
      }
    }
  }, [isLoading, isTokenOwner, debouncedRemoveUser]);

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

  if (isLoading) {
    return (
      <div className="loaderContainer">
        <Spinner size="l" />
      </div>
    );
  } else {
    return (
      <Section header="Balance">
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
                Private Telegram Channel
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
        {jettonTransferHistory &&
          jettonTransferHistory.map((tx: any, index: number) => (
            <Cell
              key={index}
              after={
                <Info type="text">
                  {new Date(tx.utime * 1000).toISOString()}
                </Info>
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
}
