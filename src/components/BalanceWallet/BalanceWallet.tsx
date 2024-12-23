"use client";
import { useState, useEffect, Suspense } from "react";
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

const BalanceWallet = () => {
  const tonAddress = useTonAddress(false);
  const jettonMasterAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "";
  const [isTokenOwner, setIsTokenOwner] = useState<boolean>(false);
  const [channelLink, setChannelLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [ownerCheckCompleted, setOwnerCheckCompleted] = useState(false);

  const { jettonWalletAddress, loadingWallet, errorWallet } =
    useJettonWalletAddress(jettonMasterAddress, tonAddress);

  const { jettonBalance, loadingBalance, errorBalance } = useJettonBalance(
    jettonWalletAddress || "",
    tonAddress || ""
  );
  const { jettonTransferHistory, loadingHistory, errorHistory } =
    useJettonTransferHistory(jettonWalletAddress || "");

  useEffect(() => {
    setIsLoading(loadingWallet || loadingBalance || loadingHistory); // combined loading state
  }, [loadingWallet, loadingBalance, loadingHistory]);

  const debouncedRemoveUser = useDebounce(removeUser, 100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          useJettonWalletAddress(jettonMasterAddress, tonAddress),
          useJettonBalance(jettonWalletAddress || "", tonAddress || ""),
          useJettonTransferHistory(jettonWalletAddress || ""),
        ]);
        setDataLoaded(true);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setDataLoaded(true);
      }
    };
    fetchData();
  }, [jettonMasterAddress, tonAddress, jettonWalletAddress]);

  useEffect(() => {
    if (dataLoaded && jettonBalance !== null && jettonTransferHistory !== null) {
      const isOwner =
        jettonBalance.length > 0 &&
        jettonBalance !== "0" &&
        jettonTransferHistory.length > 0;
      setIsTokenOwner(isOwner);
      setOwnerCheckCompleted(true);
      console.log("Owner check completed:", isOwner); // Debug log
    }
  }, [dataLoaded, jettonBalance, jettonTransferHistory]);

  useEffect(() => {
    if (ownerCheckCompleted && !isTokenOwner) {
      if (window) {
        //@ts-ignore
        const tg = window.Telegram.WebApp;
        console.log("Removing user:", tg.initDataUnsafe.user.id); // Debug log
        debouncedRemoveUser(tg.initDataUnsafe.user.id);
      }
    }
  }, [ownerCheckCompleted, isTokenOwner, debouncedRemoveUser]);

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

  return (
    <Suspense
      fallback={
        isLoading && (
          <div className="loaderContainer">
            <Spinner size="l" />
          </div>
        )
      }
    >
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
            </Cell>{" "}
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
    </Suspense>
  );
};
export default BalanceWallet;
