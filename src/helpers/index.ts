export async function fetchJettonTransfers(address: string) {
  const url = new URL('https://toncenter.com/api/v3/jetton/transfers');
  url.searchParams.append('owner_address', address);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.jetton_transfers;
}