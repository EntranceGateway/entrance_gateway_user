export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_SIBLING_COUNT = 1;

export const uiToServerPage = (page) => Math.max(0, Number(page || 1) - 1);
export const serverToUiPage = (page) => Number(page ?? 0) + 1;
