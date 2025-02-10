import { Category } from '../common/enums/category.enum';

export function formatURL(url: string): string {
  return url.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase();
}
export const getCategory = (category: Category, lang: string) => {
  const categoriesPl: { [key in Category]: string } = {
    [Category.FURNITURE_HANDLES]: 'Uchwyty meblowe',
    [Category.FURNITURE_KNOBS]: 'Gałki meblowe',
    [Category.FURNITURE_HOOKS]: 'Wieszaki meblowe',
    [Category.FURNITURE_FEET]: 'Nóżki meblowe',
    [Category.FURNITURE_LIGHTING]: 'Oświetlenie meblowe',
    [Category.TECHNICAL_ACCESSORIES]: 'Akcesoria techniczne',
    [Category.METAL_DECORATIONS]: 'Dekoracje metalowe',
    [Category.CARGO_BASKETS]: 'Kosze cargo',
    [Category.DRAWERS]: 'Szuflady',
  };

  if (lang === 'pl') {
    return categoriesPl[category];
  }

  return category;
};
