export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NIN_DIGITS_REGEX = /^\d{11}$/;
export const PHONE_NG_REGEX = /^(?:\+234|234|0)[789][01]\d{8}$/;

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { id: 'digit', label: 'One number', test: (pw: string) => /\d/.test(pw) },
] as const;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function passwordStrength(password: string): number {
  return PASSWORD_RULES.filter((rule) => rule.test(password)).length;
}

export function normalizeNin(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

export function formatNin(value: string): string {
  const digits = normalizeNin(value);
  const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 11)].filter(Boolean);
  return parts.join(' ');
}

export function isValidNin(value: string): boolean {
  return NIN_DIGITS_REGEX.test(normalizeNin(value));
}

export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

export function isValidNgPhone(value: string): boolean {
  const compact = normalizePhone(value).replace(/^00/, '+');
  return PHONE_NG_REGEX.test(compact);
}

export function isValidDob(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false;
  }
  const now = new Date();
  if (date > now) return false;
  const age =
    now.getFullYear() -
    year -
    (now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day) ? 1 : 0);
  return age >= 18 && age <= 120;
}

export function formatDobInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('/');
}
