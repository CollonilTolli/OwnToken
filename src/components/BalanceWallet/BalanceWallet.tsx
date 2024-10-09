"use client";
import { useState, useEffect } from "react";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
import { TonConnectUI } from "@tonconnect/ui-react";
import { TonConnect } from "@tonconnect/sdk"; // Импортируем только TonConnect

export default function BalanceWallet() {
  const [tokens, setTokens] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const connect = async () => {
      try {
        // Инициализация TonConnect
        const tonConnect = new TonConnect();

        // Запуск UI-компонента для авторизации
        const connected = await tonConnect.connect({
          autoDetect: true,
        });

        // Получение клиента Ton
        const client = tonConnect.client; // Используем TonConnect.client
        setClient(client);

        // Проверка на подключение
        if (connected) {
          setIsConnected(true);
          // Получение информации о токенах
          getTokens(client);
        }
      } catch (error) {
        console.error("Ошибка подключения:", error);
      }
    };

    connect();
  }, []);

  const getTokens = async (client) => {
    try {
      const address = await client.getAccount().getAddress();
      const tokensData = await client.getTokens({ address });
      setTokens(tokensData);
    } catch (error) {
      console.error("Ошибка получения токенов:", error);
    }
  };

  return tokens !== null ? (
    <Section header="Balance">
      {JSON.stringify(tokens)}
      <Cell
        after={<Info type="text">{tokens}</Info>}
        before={<Avatar size={48} />}
      >
        TON
      </Cell>
    </Section>
  ) : (
    <></>
  );
}
