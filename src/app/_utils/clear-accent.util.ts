export const clearAccentUtil = (tag: string | undefined): string | undefined =>
    tag?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
