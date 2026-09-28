import crypto from "crypto";
import { cookies } from "next/headers";
import { SESSION_SECRET } from "./config";

const COOKIE = "sa_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export type Session = {
  estudianteId: number;
  email: string;
  nombre: string;
};

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

function serialize(s: Session): string {
  const body = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function deserialize(token: string): Session | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  // Comparación en tiempo constante.
  const expected = sign(body);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

export async function setSession(s: Session): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, serialize(s), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return token ? deserialize(token) : null;
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
