import Cookies from 'js-cookie';
type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

interface TokenResponse {
  accessToken: string;
}

export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {},
  login: boolean = false
): Promise<Response> {
  const accessToken = Cookies.get('accessToken');

  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return await fetchWithAuth(url, options);
    } else {
      throw new Error('Unauthorized: Unable to refresh token');
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data: TokenResponse = await res.json();
    setAccessToken(data.accessToken);
    return true;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return false;
  }
}

export function setAccessToken(token: string): void {
  Cookies.set('accessToken', token, { expires: 1, secure: true, sameSite: 'strict' });
}
