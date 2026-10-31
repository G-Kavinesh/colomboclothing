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

// Big providers people often mistype. A domain one or two keystrokes away from one
// of these (gmali.com, gmial.com, gmail.co, hotmial.com) gets a "did you mean".
const TYPO_TARGETS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];

// Real providers that happen to sit close to those, so they're never "corrected"
const NOT_TYPOS = new Set([...KNOWN_PROVIDERS, "mail.com", "email.com", "gmx.net", "yahoo.co.uk", "yahoo.co.in", "hotmail.co.uk"]);

// Edit distance where swapping two neighbouring letters counts as one mistake
function typoDistance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export function suggestCorrection(email: string): string | undefined {
  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1);
  if (NOT_TYPOS.has(domain)) return undefined;
  let best: { target: string; distance: number } | undefined;
  for (const target of TYPO_TARGETS) {
    const distance = typoDistance(domain, target);
    if (distance <= 2 && (!best || distance < best.distance)) best = { target, distance };
  }
  return best && `${email.slice(0, at)}@${best.target}`;
}

// For a domain that turned out to take no mail: the provider it starts with, if any
// (gmail.lk, hotmail.co.lk). Regional domains that do take mail, like yahoo.co.uk,
// never get this far.
export function suggestProvider(email: string): string | undefined {
  const at = email.lastIndexOf("@");
  const name = email.slice(at + 1).split(".")[0];
  const target = TYPO_TARGETS.find((t) => t.split(".")[0] === name);
  return target && `${email.slice(0, at)}@${target}`;
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
