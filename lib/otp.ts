import bcrypt from "bcryptjs";
import { Resend } from "resend";

// ── Config ───────────────────────────────────────────────────────────────────

const OTP_EXPIRY_MINUTES = 10;
const OTP_BCRYPT_ROUNDS = 10;

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing env: RESEND_API_KEY");
  return new Resend(key);
}

function getSenderEmail(): string {
  return process.env.EMAIL_FROM ?? "noreply@rendoz.com";
}

// ── Generate ─────────────────────────────────────────────────────────────────

/** Returns a 6-digit numeric OTP string. */
export function generateOtpCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return String(code);
}

/** Hashes a plain OTP code for safe storage. */
export async function hashOtpCode(code: string): Promise<string> {
  return bcrypt.hash(code, OTP_BCRYPT_ROUNDS);
}

/** Verifies a plain OTP code against its stored hash. */
export async function verifyOtpCode(
  plainCode: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainCode, hash);
}

/** Returns the expiry Date for a freshly generated OTP. */
export function otpExpiresAt(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

// ── Email delivery ───────────────────────────────────────────────────────────

interface SendOtpOptions {
  to: string;
  fullName: string;
  code: string;
  purpose: "email_verification" | "password_reset";
}

export async function sendOtpEmail({
  to,
  fullName,
  code,
  purpose,
}: SendOtpOptions): Promise<void> {
  if (process.env.EMAIL_ENABLED !== "true") {
    console.info("[otp] Email delivery is disabled.");
    return;
  }

  const resend = getResend();
  const from = getSenderEmail();

  const isVerification = purpose === "email_verification";

  const subject = isVerification
    ? "Verify your Rendoz email address"
    : "Reset your Rendoz password";

  const heading = isVerification
    ? "Verify your email address"
    : "Reset your password";

  const bodyText = isVerification
    ? `You're almost there! Use the code below to verify your email address.`
    : `You requested a password reset. Use the code below to set a new password.`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#FF6B35;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                Rendoz
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px;">${heading}</h2>
              <p style="margin:0 0 8px;color:#444;font-size:15px;line-height:1.6;">
                Hi ${fullName},
              </p>
              <p style="margin:0 0 32px;color:#444;font-size:15px;line-height:1.6;">
                ${bodyText}
              </p>
              <!-- OTP box -->
              <div style="background:#f8f8f8;border:1px solid #e8e8e8;border-radius:8px;
                          padding:24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;
                           letter-spacing:1px;">Your verification code</p>
                <p style="margin:0;color:#FF6B35;font-size:40px;font-weight:700;
                           letter-spacing:8px;">${code}</p>
                <p style="margin:8px 0 0;color:#888;font-size:13px;">
                  Expires in ${OTP_EXPIRY_MINUTES} minutes
                </p>
              </div>
              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.
                Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #f0f0f0;
                        padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                &copy; ${new Date().getFullYear()} Rendoz. Lagos, Nigeria.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[otp] Resend error:", error);
    throw new Error("Failed to send OTP email. Please try again.");
  }
}
