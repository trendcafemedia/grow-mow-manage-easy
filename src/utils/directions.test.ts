
import { describe, it, expect, vi } from 'vitest';
import { calculateDirections } from './directions';

describe('Directions Utility', () => {
  it('correctly calculates driving directions between two points', async () => {
    // Mock the Google Maps DirectionsService
    const mockRoute = vi.fn((request, callback) => {
      // Simulating the response structure from the Google Maps API
      callback({
        routes: [{
          legs: [{
            distance: { text: "5.2 miles", value: 8368 },
            duration: { text: "12 mins", value: 720 }
          }]
        }]
      }, "OK");
    });
    
    // Replace the global DirectionsService with our mock
    const originalDirectionsService = google.maps.DirectionsService;
    google.maps.DirectionsService = class {
      route = mockRoute;
    } as any;
    
    const origin = { lat: 38.4220, lng: -77.4083 }; // White Chapel Lane
    const destination = { lat: 38.4129, lng: -77.3672 }; // Another location in Stafford
    
    const result = await calculateDirections(origin, destination);
    
    expect(result).not.toBeNull();
    expect(result?.distance).toBe("5.2 miles");
    expect(result?.duration).toBe("12 mins");
    expect(result?.durationValue).toBe(720);
    expect(result?.isLongDistance).toBe(false); // Under 20 minutes
    
    // Verify that the DirectionsService was called with correct parameters
    expect(mockRoute).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: expect.any(Object),
        destination: expect.any(Object),
        travelMode: "DRIVING"
      }),
      expect.any(Function)
    );
    
    // Restore the original DirectionsService
    google.maps.DirectionsService = originalDirectionsService;
  });
  
  it('correctly identifies long distance routes', async () => {
    // Mock for a long distance route (over 20 minutes)
    const mockRoute = vi.fn((request, callback) => {
      callback({
        routes: [{
          legs: [{
            distance: { text: "45.7 miles", value: 73544 },
            duration: { text: "55 mins", value: 3300 }
          }]
        }]
      }, "OK");
    });
    
    // Replace the global DirectionsService with our mock
    const originalDirectionsService = google.maps.DirectionsService;
    google.maps.DirectionsService = class {
      route = mockRoute;
    } as any;
    
    const origin = { lat: 38.4220, lng: -77.4083 }; // White Chapel Lane
    const destination = { lat: 38.8977, lng: -77.0365 }; // Washington DC
    
    const result = await calculateDirections(origin, destination);
    
    expect(result).not.toBeNull();
    expect(result?.distance).toBe("45.7 miles");
    expect(result?.duration).toBe("55 mins");
    expect(result?.durationValue).toBe(3300);
    expect(result?.isLongDistance).toBe(true); // Over 20 minutes (55 mins)
    
    // Restore the original DirectionsService
    google.maps.DirectionsService = originalDirectionsService;
  });
  
  it('handles errors gracefully', async () => {
    // Mock a failure response
    const mockRoute = vi.fn((request, callback) => {
      callback(null, "ZERO_RESULTS");
    });
    
    // Replace the global DirectionsService with our mock
    const originalDirectionsService = google.maps.DirectionsService;
    google.maps.DirectionsService = class {
      route = mockRoute;
    } as any;
    
    const origin = { lat: 38.4220, lng: -77.4083 }; // White Chapel Lane
    const destination = { lat: 0, lng: 0 }; // Invalid destination
    
    try {
      await calculateDirections(origin, destination);
      // If we get here, the test should fail because an error should have been thrown
      expect(false).toBe(true); // This line should not be reached
    } catch (error) {
      expect(error.message).toContain("Direction service failed");
    }
    
    // Restore the original DirectionsService
    google.maps.DirectionsService = originalDirectionsService;
  });
});
