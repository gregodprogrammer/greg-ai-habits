export const AUTH = {
  COOKIE_NAME: 'gah_session',
  COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HABITS: '/habits',
  ANALYTICS: '/analytics',
  AI_COACH: '/ai-coach',
  BUDGET: '/budget',
  TASKS: '/tasks',
  PROFILE: '/profile',
} as const;

// Routes that require an authenticated session
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.HABITS,
  ROUTES.ANALYTICS,
  ROUTES.AI_COACH,
  ROUTES.BUDGET,
  ROUTES.TASKS,
  ROUTES.PROFILE,
] as const;

// Routes only accessible when NOT authenticated (redirect to dashboard if logged in)
export const AUTH_ONLY_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const AI = {
  MAX_CONTEXT_MESSAGES: 10,
  MAX_RESPONSE_TOKENS: 1024,
} as const;

export const HABITS = {
  MAX_PER_USER: 50,
  MAX_NAME_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;
