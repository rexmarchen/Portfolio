const ENCODER = new TextEncoder();

export const DEFAULT_PASSWORD_HASH =
  "97c7375c5f9697c9337e244a662d465168cb39ef394310d379b20b6751ceba3e"; // Anshu90#@

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
