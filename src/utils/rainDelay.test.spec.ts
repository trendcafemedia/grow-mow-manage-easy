
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRainDelay } from './rainDelay';

describe('Rain Delay Utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-04-21T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay service if rain probability is above threshold', () => {
    const dailyData = {
      precipitation_probability_max: [80, 30, 20],
      time: ['2025-04-21', '2025-04-22', '2025-04-23']
    };

    const daysArray = dailyData.time.map((date, index) => ({
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      has_rain: dailyData.precipitation_probability_max[index] > 50,
      primary_weather: dailyData.precipitation_probability_max[index] > 50 ? 'Rain' : 'Clear'
    }));

    const testService = {
      id: '123',
      scheduled_at: '2025-04-21T10:00:00Z',
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };

    const result = checkRainDelay(testService, { days: daysArray });
    expect(result.isDelayed).toBe(true);
    expect(result.reason).toContain('rain in the forecast');
    expect(result.newDate).toEqual(new Date('2025-04-22T10:00:00Z'));
  });

  it('should not delay service if rain probability is below threshold', () => {
    const dailyData = {
      precipitation_probability_max: [30, 20, 10],
      time: ['2025-04-21', '2025-04-22', '2025-04-23']
    };

    const daysArray = dailyData.time.map((date, index) => ({
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      has_rain: dailyData.precipitation_probability_max[index] > 50,
      primary_weather: 'Clear'
    }));

    const testService = {
      id: '123',
      scheduled_at: '2025-04-21T10:00:00Z',
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };

    const result = checkRainDelay(testService, { days: daysArray });
    expect(result.isDelayed).toBe(false);
    expect(result.reason).toBe('Weather conditions are suitable for service');
    expect(result.newDate).toBeNull();
  });
});
