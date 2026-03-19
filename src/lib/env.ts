const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export const isLocalRuntime = () => {
  if (typeof window === "undefined") return false;

  return LOCAL_HOSTS.has(window.location.hostname);
};

export const canAccessColorsPage = () => {
  return import.meta.env.DEV || isLocalRuntime();
};
