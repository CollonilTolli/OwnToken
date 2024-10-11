export async function fetchJettonTransfers(JettonId: string, address: string) {
  const url = `https://tonapi.io/v2/jettons/${address}/holders`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  if (data.addresses === null) {
    return [];
  } else {
    return data.addresses;
  }
}