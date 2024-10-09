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
    console.log("Список jettons: ", data.jetton_wallets)
    return data.jetton_wallets
  } catch (error) {
    console.log("url ", url)
    console.error("Ошибка:", error);
    return null
  }
}


export async function fetchJettonMetadata(url: string) {
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
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
}