import { describe, it, expect } from 'vitest';
import { hasPermission } from '../utils/permissions';

describe('hasPermission', () => {
  it('returns true when permission exists', () => {
    expect(hasPermission(['read', 'write'], 'read')).toBe(true);
  });
  it('returns false when permission missing', () => {
    expect(hasPermission(['read', 'write'], 'delete')).toBe(false);
  });
});
