import { DEFAULT_PASSWORD_HASH } from "../utils/auth";

const AUTH_KEY = "rexeditzz-admin-auth";
const HASH_KEY = "rexeditzz-admin-hash";
const SESSION_KEY = "rexeditzz-admin-session";

export function getPasswordHash(): string {
  return localStorage.getItem(HASH_KEY) || DEFAULT_PASSWORD_HASH;
}

export function setPasswordHash(hash: string): void {
  localStorage.setItem(HASH_KEY, hash);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(SESSION_KEY, "true");
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
