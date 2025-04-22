
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend expect with @testing-library/jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Google Maps API
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: vi.fn(),
  MarkerF: vi.fn(),
  InfoWindowF: vi.fn(),
}));
