import twilio from "twilio";

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

export function getTwilioFromNumber(): string | null {
  return process.env.TWILIO_PHONE_NUMBER || null;
}

export async function sendSms(to: string, body: string) {
  const client = getTwilioClient();
  const from = getTwilioFromNumber();
  if (!client || !from) {
    throw new Error("Twilio is not configured");
  }
  const normalized = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`;
  const msg = await client.messages.create({ to: normalized, from, body });
  return msg.sid;
}

export function isStopMessage(body: string): boolean {
  return /^\s*stop\s*$/i.test(body.trim());
}
