
import { describe, it, expect, vi } from 'vitest';
import { checkRainDelay, applyRainDelay } from './rainDelay';

describe('Rain Delay Utility with Real Date', () => {
  const fixedDate = new Date('2025-04-21T10:00:00Z');
  
  // Save the original Date constructor
  const OriginalDate = global.Date;
  
  beforeEach(() => {
    // Mock Date to return our fixed date when instantiated without arguments
    global.Date = class extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          return new OriginalDate(fixedDate);
        }
        return new OriginalDate(...args);
      }
    } as DateConstructor;
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = OriginalDate;
  });
  
  it('should delay service by exactly 24 hours when rain is forecast', () => {
    const service = {
      id: '123',
      scheduled_at: new Date('2025-04-21T14:30:00Z').toISOString(),
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };
    
    const weatherData = {
      days: [{
        date: '2025-04-21',
        day: 'Monday',
        has_rain: true,
        primary_weather: 'Rain'
      }]
    };
    
    const result = checkRainDelay(service, weatherData);
    
    // Verify delay is applied
    expect(result.isDelayed).toBe(true);
    expect(result.reason).toContain('rain in the forecast');
    
    // Verify exact +24 hour logic 
    const originalDate = new Date(service.scheduled_at);
    const expectedDate = new Date(originalDate);
    expectedDate.setDate(originalDate.getDate() + 1);
    
    expect(result.newDate?.getDate()).toBe(expectedDate.getDate());
    expect(result.newDate?.getHours()).toBe(expectedDate.getHours());
    expect(result.newDate?.getMinutes()).toBe(expectedDate.getMinutes());
    
    // The new date should be exactly 24 hours later
    const timeDiff = result.newDate!.getTime() - originalDate.getTime();
    expect(timeDiff).toBe(24 * 60 * 60 * 1000);
  });
  
  it('should handle severe weather with correct reason text', () => {
    const service = {
      id: '123',
      scheduled_at: new Date('2025-04-21T14:30:00Z').toISOString(),
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };
    
    const weatherData = {
      days: [{
        date: '2025-04-21',
        day: 'Monday',
        has_rain: false,
        primary_weather: 'Thunderstorm'
      }]
    };
    
    const result = checkRainDelay(service, weatherData);
    
    expect(result.isDelayed).toBe(true);
    expect(result.reason).toContain('severe weather');
    expect(result.reason).toContain('Thunderstorm');
    
    // Verify the same +24 hour logic applies
    const originalDate = new Date(service.scheduled_at);
    const expectedDate = new Date(originalDate);
    expectedDate.setDate(originalDate.getDate() + 1);
    
    expect(result.newDate?.toISOString()).toBe(expectedDate.toISOString());
  });
  
  it('should successfully update the database with the new date', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null })
    };
    
    const newDate = new Date('2025-04-22T14:30:00Z');
    const result = await applyRainDelay(
      '123', 
      newDate, 
      'Service delayed due to rain',
      mockSupabase
    );
    
    expect(result).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('services');
    expect(mockSupabase.update).toHaveBeenCalledWith({
      scheduled_at: newDate.toISOString(),
      notes: 'Service delayed due to rain'
    });
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
  });
});
