export const formatBeverage = (beverage) => {
  if (!beverage) return '';
  const parts = [];
  if (beverage.type) parts.push(beverage.type);
  if (beverage.size) parts.push(beverage.size);
  const extras = [];
  if (beverage.sweetener) extras.push(beverage.sweetener.toLowerCase());
  if (Array.isArray(beverage.toppings) && beverage.toppings.length) {
    extras.push(...beverage.toppings.map((t) => t.toLowerCase()));
  }
  const base = parts.join(' ');
  return extras.length ? `${base} con ${extras.join(' y ')}` : base;
};
