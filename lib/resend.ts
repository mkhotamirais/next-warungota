import { Resend } from "resend";

// Mengambil API Key dari environment variable (.env)
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn("Peringatan: RESEND_API_KEY belum dikonfigurasi di .env");
}

export const resend = new Resend(resendApiKey);
