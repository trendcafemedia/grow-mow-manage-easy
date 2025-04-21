
import { describe, it, expect, vi } from 'vitest';
import { checkRainDelay, applyRainDelay } from './rainDelay';

describe('Rain Delay Utility', () => {
  it('should not delay when no rain is in the forecast', () => {
    const service = {
      id: '123',
      scheduled_at: '2023-05-15T10:00:00Z',
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };
    
    const weatherData = {
      days: [{
        date: '2023-05-15',
        day: 'Monday',
        has_rain: false,
        primary_weather: 'Clear'
      }]
    };
    
    const result = checkRainDelay(service, weatherData);
    expect(result.isDelayed).toBe(false);
    expect(result.newDate).toBeNull();
    expect(result.reason).toBeNull();
  });
  
  it('should delay service when rain is in the forecast', () => {
    const service = {
      id: '123',
      scheduled_at: '2023-05-15T10:00:00Z',
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };
    
    const weatherData = {
      days: [{
        date: '2023-05-15',
        day: 'Monday',
        has_rain: true,
        primary_weather: 'Rain'
      }]
    };
    
    const result = checkRainDelay(service, weatherData);
    expect(result.isDelayed).toBe(true);
    expect(result.newDate).toBeInstanceOf(Date);
    expect(result.reason).toContain('rain in the forecast');
    
    // Check that the new date is one day later but same time
    const originalDate = new Date(service.scheduled_at);
    const expectedDate = new Date(originalDate);
    expectedDate.setDate(originalDate.getDate() + 1);
    
    expect(result.newDate?.getDate()).toBe(expectedDate.getDate());
    expect(result.newDate?.getHours()).toBe(expectedDate.getHours());
    expect(result.newDate?.getMinutes()).toBe(expectedDate.getMinutes());
  });
  
  it('should delay service for severe weather', () => {
    const service = {
      id: '123',
      scheduled_at: '2023-05-15T10:00:00Z',
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };
    
    const weatherData = {
      days: [{
        date: '2023-05-15',
        day: 'Monday',
        has_rain: false,
        primary_weather: 'Thunderstorm'
      }]
    };
    
    const result = checkRainDelay(service, weatherData);
    expect(result.isDelayed).toBe(true);
    expect(result.reason).toContain('severe weather');
    expect(result.reason).toContain('Thunderstorm');
  });
  
  it('should handle missing weather data gracefully', () => {
    const service = {
      id: '123',
      scheduled_at: '2023-05-15T10:00:00Z',
      customer_name: 'John Doe',
      service_type: 'Lawn Mowing'
    };
    
    const result = checkRainDelay(service, null);
    expect(result.isDelayed).toBe(false);
    expect(result.newDate).toBeNull();
    expect(result.reason).toBeNull();
  });
  
  it('should save the delay in the database', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null })
    };
    
    const result = await applyRainDelay(
      '123', 
      new Date('2023-05-16T10:00:00Z'), 
      'Service delayed due to rain',
      mockSupabase
    );
    
    expect(result).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('services');
    expect(mockSupabase.update).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
  });
  
  it('should handle database errors', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: new Error('Database error') })
    };
    
    const result = await applyRainDelay(
      '123', 
      new Date('2023-05-16T10:00:00Z'), 
      'Service delayed due to rain',
      mockSupabase
    );
    
    expect(result).toBe(false);
  });
});
