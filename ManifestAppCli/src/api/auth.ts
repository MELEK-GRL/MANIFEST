import axios from 'axios';
import {api} from './client';

export type AuthSession = {
  token: string;
  username: string;
};

type AuthErrorBody = {
  code?: string;
};

export async function registerAccount(
  username: string,
  email: string,
  password: string,
): Promise<AuthSession> {
  const {data} = await api.post<AuthSession>('/api/auth/register', {
    username,
    email,
    password,
  });
  return data;
}

export async function loginAccount(
  username: string,
  password: string,
): Promise<AuthSession> {
  const {data} = await api.post<AuthSession>('/api/auth/login', {
    username,
    password,
  });
  return data;
}

const usernamePattern = /^[a-zA-Z0-9_]{3,32}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUsername(value: string) {
  const username = value.trim();
  if (!username) {
    return 'usernameRequired';
  }
  if (!usernamePattern.test(username)) {
    return 'usernameInvalid';
  }
  return null;
}

export function validateEmail(value: string) {
  const email = value.trim();
  if (!email) {
    return 'emailRequired';
  }
  if (!emailPattern.test(email)) {
    return 'emailInvalid';
  }
  return null;
}

export function validatePassword(value: string) {
  if (value.length < 6 || value.length > 8) {
    return 'passwordLength';
  }
  return null;
}

const serverCodes: Record<string, string> = {
  invalid_username: 'usernameInvalid',
  invalid_email: 'emailInvalid',
  invalid_password: 'passwordLength',
  username_taken: 'usernameTaken',
  email_taken: 'emailTaken',
  bad_credentials: 'badCredentials',
};

export function authErrorCode(error: unknown): string {
  if (axios.isAxiosError<AuthErrorBody>(error)) {
    const code = error.response?.data?.code;
    if (typeof code === 'string' && serverCodes[code]) {
      return serverCodes[code];
    }
    return 'network';
  }
  return 'network';
}
