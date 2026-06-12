import { portfolio, PortfolioConfig } from "../config/portfolio";

const STORAGE_KEY = "rexeditzz-portfolio-config";

export function loadPortfolio(): PortfolioConfig {
  const fallback = structuredClone(portfolio);

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored) as Partial<PortfolioConfig>;

    return {
      ...fallback,
      ...parsed,
      socials: {
        ...fallback.socials,
        ...parsed.socials,
      },
      videos: Array.isArray(parsed.videos) ? parsed.videos : fallback.videos,
    };
  } catch {
    return fallback;
  }
}

export function savePortfolio(config: PortfolioConfig) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetPortfolio() {
  window.localStorage.removeItem(STORAGE_KEY);
  return structuredClone(portfolio);
}
