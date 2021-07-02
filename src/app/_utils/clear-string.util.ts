import { clearAccentUtil } from './clear-accent.util';

export const clearStringUtil = (tag: string | undefined): string | undefined =>
    clearAccentUtil(tag?.toLowerCase());
