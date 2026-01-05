import { describe, expect, test } from 'vitest';
import { verifyAccept } from './verify-file-accept';

describe('verifyAccept', () => {
  describe('exact mime type matching', () => {
    test('should return true for exact match', () => {
      expect(verifyAccept('image/png', 'image/png')).toBe(true);
      expect(verifyAccept('image/jpeg', 'image/jpeg')).toBe(true);
      expect(verifyAccept('application/pdf', 'application/pdf')).toBe(true);
    });

    test('should return false for non-matching mime type', () => {
      expect(verifyAccept('image/png', 'image/jpeg')).toBe(false);
      expect(verifyAccept('video/mp4', 'audio/mp3')).toBe(false);
    });
  });

  describe('wildcard matching', () => {
    test('should match wildcard for same type', () => {
      expect(verifyAccept('image/png', 'image/*')).toBe(true);
      expect(verifyAccept('image/jpeg', 'image/*')).toBe(true);
      expect(verifyAccept('image/gif', 'image/*')).toBe(true);
    });

    test('should match audio wildcard', () => {
      expect(verifyAccept('audio/mp3', 'audio/*')).toBe(true);
      expect(verifyAccept('audio/wav', 'audio/*')).toBe(true);
    });

    test('should match video wildcard', () => {
      expect(verifyAccept('video/mp4', 'video/*')).toBe(true);
      expect(verifyAccept('video/webm', 'video/*')).toBe(true);
    });

    test('should not match wildcard for different type', () => {
      expect(verifyAccept('video/mp4', 'image/*')).toBe(false);
      expect(verifyAccept('audio/mp3', 'video/*')).toBe(false);
    });
  });

  describe('multiple accept types', () => {
    test('should match any of multiple exact types', () => {
      expect(verifyAccept('image/png', 'image/png,image/jpeg')).toBe(true);
      expect(verifyAccept('image/jpeg', 'image/png,image/jpeg')).toBe(true);
    });

    test('should match with mixed exact and wildcard', () => {
      expect(verifyAccept('image/png', 'audio/*,video/*,image/png')).toBe(true);
      expect(verifyAccept('audio/mp3', 'audio/*,video/*,image/png')).toBe(true);
      expect(verifyAccept('video/mp4', 'audio/*,video/*,image/png')).toBe(true);
    });

    test('should return false when no match in multiple types', () => {
      expect(verifyAccept('application/pdf', 'image/*,video/*')).toBe(false);
    });
  });

  describe('whitespace handling', () => {
    test('should handle spaces after commas', () => {
      expect(verifyAccept('image/png', 'image/png, image/jpeg')).toBe(true);
      expect(verifyAccept('image/jpeg', 'image/png, image/jpeg')).toBe(true);
    });

    test('should handle multiple spaces', () => {
      expect(verifyAccept('image/png', 'image/png,  image/jpeg,   video/*')).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('should handle application types', () => {
      expect(verifyAccept('application/json', 'application/*')).toBe(true);
      expect(verifyAccept('application/xml', 'application/*')).toBe(true);
    });

    test('should handle text types', () => {
      expect(verifyAccept('text/plain', 'text/*')).toBe(true);
      expect(verifyAccept('text/html', 'text/*')).toBe(true);
    });

    test('should handle single accept value', () => {
      expect(verifyAccept('image/png', 'image/png')).toBe(true);
      expect(verifyAccept('image/png', 'image/*')).toBe(true);
    });
  });
});
