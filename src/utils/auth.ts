const ENCODER = new TextEncoder();

export const DEFAULT_PASSWORD_HASH =
  "6aa98625ce411844ddb89f21447842894ad2ba659b41f1530a9be5fbd2e47ebb"; // rexeditzz2024

export async function hashPassword(password: string): Promise<string> {
  const data = ENCODER.encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const array = Array.from(new Uint8Array(buffer));
  return array.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}
