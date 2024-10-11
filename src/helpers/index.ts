export async function fetchJettonTransfers(JettonId: string, address: string) {
  const url = `https://tonapi.io/v2/jettons/${JettonId}/transfer/${address}/payload`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.jetton_transfers;
}