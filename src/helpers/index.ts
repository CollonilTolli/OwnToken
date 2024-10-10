import { TonClient } from 'ton';
import { Address } from 'ton-core';

// Инициализация клиента TON
const client = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});


export async function checkTokenTransaction(walletAddress: string) {
  const tokenAddress = 'EQAD2vAejy7hCfDmV5l246FYfA37AiV7TkWPIoR8i0EoGH2l';
  try {
    // Получение данных о транзакциях
    const transactions = await client.getTransactions(Address.parse(walletAddress), { limit: 100 });

    // Проверка транзакций на наличие токена
    for (const tx of transactions) {
      console.log("TX", tx)
      //@ts-ignore
      const inMsg = tx.in_msg ? tx.in_msg : "";
      if (inMsg && inMsg.source.toString() === tokenAddress) {
        console.log('Транзакция с токеном найдена:', tx);
        return true;
      }
    }

    console.log('Транзакции с токеном не найдены.');
    return false;
  } catch (error) {
    console.error('Ошибка при проверке транзакций:', error);
    return false;
  }
}




export async function fetchJettonData(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const uniqueJettons = Array.from(new Set(data.jetton_wallets.map((jetton: any) => jetton.jetton)))
      .map(jettonAddress => data.jetton_wallets.find((jetton: any) => jetton.jetton === jettonAddress));

    console.log("Список jettons: ", uniqueJettons);

    return uniqueJettons;
  } catch (error) {
    console.log("url ", url);
    console.error("Ошибка:", error);
    return null;
  }
}

export async function fetchJettonMetadata(url: string, index: number) {
  const maxRetries = 5;
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Rate limit exceeded. Retrying after ${2 ** attempt} seconds...`);
          await delay(2 ** attempt * 1000); // Exponential backoff
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("jetton info: ", data)
      return data;
    } catch (error) {
      console.error(`Ошибка при получении метаданных для токена ${index + 1}:`, error);
      if (attempt === maxRetries - 1) {
        return null;
      }
      await delay(2 ** attempt * 1000); // Exponential backoff
    }
  }
}