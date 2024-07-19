import qs from 'query-string';

import { env } from '@/utils';

export function getAuthorizeUrl(scope = 'snapchat-marketing-api') {
  const { CLIENT_ID, REDIRECT_URI } = env();

  return `https://accounts.snapchat.com/login/oauth2/authorize?${qs.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
  })}`;
}

export async function getAccessToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}> {
  const { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } = env();
  const { url, ...init } = getTokenReqConfig({
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    client_secret: CLIENT_SECRET,
    client_id: CLIENT_ID,
  });

  return fetch(url, init).then((res) => res.json());
}

export async function getRefreshToken(refresh_token: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}> {
  const { CLIENT_ID, CLIENT_SECRET } = env();
  const { url, ...init } = getTokenReqConfig({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token,
  });

  return fetch(url, init).then((res) => res.json());
}

function getTokenReqConfig(body: Record<string, string>) {
  return {
    url: 'https://accounts.snapchat.com/login/oauth2/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  };
}
