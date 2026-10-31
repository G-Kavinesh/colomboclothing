// Rules a signup email has to pass before it goes on the list. The domain's mail
// server check needs DNS, so that one lives in app/api/subscribers instead.

// Local part: no leading, trailing or doubled dots. Domain: hyphenated labels and a
// real-looking TLD. Inputs are lowercased before they get here.
const LOCAL = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;

export function isValidEmail(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 1 || email.length > 254) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  return local.length <= 64 && LOCAL.test(local) && DOMAIN.test(domain);
}

// These providers deliver name+anything@ to name@, and Gmail ignores dots too, so
// each of those spellings would otherwise land on the list as a separate person.
const PLUS_ALIASES = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com",
  "icloud.com", "me.com", "proton.me", "protonmail.com", "fastmail.com",
]);

export function normalizeEmail(input: string) {
  const email = input.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return email;
  let local = email.slice(0, at);
  let domain = email.slice(at + 1);
  if (domain === "googlemail.com") domain = "gmail.com";
  if (PLUS_ALIASES.has(domain)) local = local.split("+")[0];
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return `${local}@${domain}`;
}

// Big providers are known to take mail, so they skip the DNS lookup
export const KNOWN_PROVIDERS = new Set([
  ...PLUS_ALIASES, "yahoo.com", "ymail.com", "aol.com", "msn.com", "zoho.com", "gmx.com",
]);

// Misspellings people often type, mapped to what they meant
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com",
  "gnail.com": "gmail.com", "gmaill.com": "gmail.com", "gmail.co": "gmail.com",
  "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.om": "gmail.com",
  "gmail.comm": "gmail.com", "gmal.com": "gmail.com", "gmil.com": "gmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com", "yhoo.com": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com", "hotmil.com": "hotmail.com",
  "outlok.com": "outlook.com", "outllook.com": "outlook.com", "outlook.co": "outlook.com",
  "outlook.con": "outlook.com",
  "iclod.com": "icloud.com", "icoud.com": "icloud.com", "icloud.co": "icloud.com",
  "icloud.con": "icloud.com",
};

export function suggestCorrection(email: string): string | undefined {
  const at = email.lastIndexOf("@");
  const fix = TYPOS[email.slice(at + 1)];
  return fix ? `${email.slice(0, at)}@${fix}` : undefined;
}

// Throwaway inboxes that expire within minutes, so nobody would ever read a drop email
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "guerrillamail.net",
  "sharklasers.com", "grr.la", "10minutemail.com", "10minutemail.net", "tempmail.com",
  "temp-mail.org", "tempmail.net", "tempail.com", "yopmail.com", "yopmail.net",
  "trashmail.com", "getnada.com", "nada.email", "dispostable.com", "maildrop.cc",
  "throwawaymail.com", "fakeinbox.com", "mintemail.com", "mohmal.com", "emailondeck.com",
  "burnermail.io", "mailnesia.com", "spamgourmet.com", "mytemp.email", "tempr.email",
  "discard.email", "moakt.com", "33mail.com", "inboxkitten.com", "emailfake.com",
]);

export function isDisposable(email: string) {
  return DISPOSABLE.has(email.slice(email.lastIndexOf("@") + 1));
}
