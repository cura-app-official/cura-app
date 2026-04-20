export const CATEGORIES = [
  'Shirts',
  'Tops',
  'Hoodies',
  'Jackets',
  'Cardigans',
  'Pants',
  'Jeans',
  'Skirts',
  'Shoes',
  'Earrings',
  'Necklaces',
  'Watches',
  'Bags',
  'Accessories',
  'Others',
] as const;

export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'] as const;

export const DAMAGE_OPTIONS = [
  'No damage',
  'Stain',
  'Tear / hole',
  'Fading',
  'Scratches',
  'Missing parts',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Condition = (typeof CONDITIONS)[number];
export type DamageOption = (typeof DAMAGE_OPTIONS)[number];
