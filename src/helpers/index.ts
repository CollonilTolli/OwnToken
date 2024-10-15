import { NextApiRequest } from 'next';

export async function fetchJettonTransfers(JettonId: string, address: string) {
  const url = `https://tonapi.io/v2/jettons/${address}/holders`;
  const response = await fetch(url);
  if (!response.ok) {
    throw Error('Network response was not ok');
  }
  const data = await response.json();
  if (data.addresses === null) {
    return [];
  } else {
    return data.addresses;
  }
}

export async function getInviteLink() {
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY
  const apiEndpoint = '/api/public_invite';

  try {
    const response = await fetch(`${apiEndpoint}?public_key=${publicKey}`);
    if (!response.ok) {
      throw Error(`Ошибка запроса: ${response.status}`);
    }
    const data = await response.json();
    return data.inviteLink;
  } catch (error) {
    console.error('Ошибка при получении ссылки на приглашение:', error);
    return null;
  }
}
export async function removeUser(userId: number) {
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY
  const apiEndpoint = '/admin/kick';
  try {
    const response = await fetch(`${apiEndpoint}?userId=${userId}&publicKey=${publicKey}`);
    if (!response.ok) {
      throw Error(`Ошибка запроса: ${response.status}`);
    }
    return;
  } catch (error) {
    console.error('Ошибка при исключении пользователя: ', error);
    return null;
  }
}

export const getTelegramToken = async (req: NextApiRequest) => {
  const { query } = req;
  const { token } = query;

  if (token) {
    return token;
  }

  const loginWidgetUrl = `https://www.telegram.org/login?to=${process.env.NEXT_PUBLIC_BOT_USERNAME}`;
  return new Promise((resolve, reject) => {
    window.addEventListener('message', (event) => {
      if (event.origin === loginWidgetUrl && event.data.token) {
        resolve(event.data.token);
      }
    });
    window.open(loginWidgetUrl, '_blank', 'width=400,height=600');
  });
};