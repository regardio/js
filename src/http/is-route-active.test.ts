import { describe, expect, it } from 'vitest';
import { checkIfRouteIsActive, isRouteActive } from './is-route-active';

describe('isRouteActive', () => {
  it('should return true for exact match', () => {
    expect(isRouteActive('/home', '/home')).toBe(true);
  });

  it('should return false for different paths', () => {
    expect(isRouteActive('/home', '/about')).toBe(false);
  });

  it('should return true for root path when current is root', () => {
    expect(isRouteActive('/', '/')).toBe(true);
  });

  it('should return false for root path when current is not root', () => {
    expect(isRouteActive('/', '/home')).toBe(false);
  });

  it('should handle end=false for nested routes', () => {
    expect(isRouteActive('/account', '/account/settings', false)).toBe(true);
  });

  it('should handle end=true (default) for nested routes', () => {
    expect(isRouteActive('/account', '/account/settings', true)).toBe(false);
  });

  it('should handle custom end function', () => {
    const customEnd = (path: string) => path.includes('settings');
    expect(isRouteActive('/account', '/account/settings', customEnd)).toBe(false);
  });
});

describe('checkIfRouteIsActive', () => {
  it('should return true for exact match', () => {
    expect(checkIfRouteIsActive('/home', '/home')).toBe(true);
  });

  it('should return false for different paths', () => {
    expect(checkIfRouteIsActive('/home', '/about')).toBe(false);
  });

  it('should ignore query parameters', () => {
    expect(checkIfRouteIsActive('/home', '/home?foo=bar')).toBe(true);
  });

  it('should return false for root when current is not root', () => {
    expect(checkIfRouteIsActive('/', '/home')).toBe(false);
  });

  it('should return true for root when current is root', () => {
    expect(checkIfRouteIsActive('/', '/')).toBe(true);
  });

  it('should match parent route with depth=1', () => {
    expect(checkIfRouteIsActive('/account', '/account/settings', 1)).toBe(false);
  });

  it('should match parent route with depth=2', () => {
    expect(checkIfRouteIsActive('/account', '/account/settings', 2)).toBe(true);
  });

  it('should match deeply nested routes with higher depth', () => {
    expect(checkIfRouteIsActive('/account', '/account/settings/profile', 3)).toBe(true);
  });

  it('should return false when path is not included in current route', () => {
    expect(checkIfRouteIsActive('/dashboard', '/account/settings')).toBe(false);
  });
});
