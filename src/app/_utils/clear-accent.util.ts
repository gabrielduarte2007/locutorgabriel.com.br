export const clearAccentUtil = tag =>
    tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
