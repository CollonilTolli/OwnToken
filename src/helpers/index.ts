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