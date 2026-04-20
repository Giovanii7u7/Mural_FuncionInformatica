const VISIT_STORAGE_PREFIX = "unistmo_visit_logged:";
const VISITOR_TOKEN_KEY = "unistmo_visitor_token";

function getVisitorToken() {
  try {
    let token = localStorage.getItem(VISITOR_TOKEN_KEY);
    if (!token) {
      token = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return `visitor_fallback_${Date.now()}`;
  }
}

function getVisitDayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasLoggedVisit(pageKey) {
  try {
    const storageKey = `${VISIT_STORAGE_PREFIX}${getVisitDayKey()}:${pageKey}`;
    return localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function markVisitLogged(pageKey) {
  try {
    const storageKey = `${VISIT_STORAGE_PREFIX}${getVisitDayKey()}:${pageKey}`;
    localStorage.setItem(storageKey, "1");
  } catch {}
}

async function registerVisit(pageKey) {
  if (!pageKey || typeof supabaseClient === "undefined") return false;
  if (hasLoggedVisit(pageKey)) return true;

  const { error } = await supabaseClient.from("page_visits").insert([
    {
      page_key: pageKey,
      visitor_token: getVisitorToken(),
    },
  ]);

  if (error) {
    console.error("Visit tracking error:", error);
    return false;
  }

  markVisitLogged(pageKey);
  return true;
}

function trackPageView(pageKey) {
  if (!pageKey) return;
  registerVisit("site");
  registerVisit(pageKey);
}
