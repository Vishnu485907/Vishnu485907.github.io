export const isStaticSite = import.meta.env.VITE_STATIC_SITE === "true";

export const hasAuthConfig = Boolean(
  import.meta.env.VITE_KIMI_AUTH_URL && import.meta.env.VITE_APP_ID,
);

export const isPreviewBuild = isStaticSite || !hasAuthConfig;
