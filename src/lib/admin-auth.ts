// Pre-computed SHA-256 hash — password is never stored in plaintext
const VALID_HASH = "3be6d52ed584e14c8ab23b360cda7389d822df92092ae3cc3b0af47956bb1b43";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = "colombo-admin";

type AdminState = {
  failedAttempts: number;
  lockoutUntil: number | null;
  sessionExpiry: number | null;
};

function getState(): AdminState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { failedAttempts: 0, lockoutUntil: null, sessionExpiry: null };
}

function setState(state: AdminState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isLockedOut(): { locked: boolean; remainingMs: number } {
  const state = getState();
  if (!state.lockoutUntil) return { locked: false, remainingMs: 0 };
  const remaining = state.lockoutUntil - Date.now();
  if (remaining <= 0) {
    setState({ ...state, failedAttempts: 0, lockoutUntil: null });
    return { locked: false, remainingMs: 0 };
  }
  return { locked: true, remainingMs: remaining };
}

export function getRemainingAttempts(): number {
  const state = getState();
  return MAX_ATTEMPTS - state.failedAttempts;
}

export async function verifyPassword(input: string): Promise<{ success: boolean; error?: string }> {
  const lockout = isLockedOut();
  if (lockout.locked) {
    const mins = Math.ceil(lockout.remainingMs / 60000);
    return { success: false, error: `TOO MANY ATTEMPTS. TRY AGAIN IN ${mins} MIN` };
  }

  const state = getState();
  const inputHash = await hashPassword(input);

  if (inputHash === VALID_HASH) {
    setState({
      failedAttempts: 0,
      lockoutUntil: null,
      sessionExpiry: Date.now() + SESSION_DURATION,
    });
    return { success: true };
  }

  const newAttempts = state.failedAttempts + 1;
  const newState: AdminState = {
    failedAttempts: newAttempts,
    lockoutUntil: newAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_DURATION : null,
    sessionExpiry: null,
  };
  setState(newState);

  if (newAttempts >= MAX_ATTEMPTS) {
    return { success: false, error: "TOO MANY ATTEMPTS. LOCKED FOR 5 MINUTES" };
  }

  return {
    success: false,
    error: `INCORRECT PASSWORD (${MAX_ATTEMPTS - newAttempts} ATTEMPTS LEFT)`,
  };
}

export function isSessionValid(): boolean {
  const state = getState();
  if (!state.sessionExpiry) return false;
  if (Date.now() > state.sessionExpiry) {
    setState({ ...state, sessionExpiry: null });
    return false;
  }
  return true;
}

export function refreshSession() {
  const state = getState();
  setState({ ...state, sessionExpiry: Date.now() + SESSION_DURATION });
}

export function logout() {
  const state = getState();
  setState({ ...state, sessionExpiry: null });
}
