
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRainDelay } from './rainDelay';

describe('Rain Delay Utility', () => {
  beforeEach(() => {
    // Mock the Date object
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-04-21T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay service if rain probability is above threshold', () => {
    const weatherData = {
      daily: {
        precipitation_probability_max: [80, 30, 20], // Today, tomorrow, day after
        time: ['2025-04-21', '2025-04-22', '2025-04-23']
      }
    };

    const result = checkRainDelay(weatherData);
    expect(result.shouldDelay).toBe(true);
    expect(result.reason).toBe('High chance of rain (80%)');
    expect(result.nextAvailableDate).toEqual(new Date('2025-04-22T10:00:00Z'));
  });

  it('should not delay service if rain probability is below threshold', () => {
    const weatherData = {
      daily: {
        precipitation_probability_max: [30, 20, 10], // Today, tomorrow, day after
        time: ['2025-04-21', '2025-04-22', '2025-04-23']
      }
    };

    const result = checkRainDelay(weatherData);
    expect(result.shouldDelay).toBe(false);
    expect(result.reason).toBe('Weather conditions are suitable for service');
    expect(result.nextAvailableDate).toBeNull();
  });
});
