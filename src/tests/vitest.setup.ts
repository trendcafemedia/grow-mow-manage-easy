
import { beforeAll, afterAll, afterEach } from 'vitest';
import { clearTestData } from './utils/testUtils';

// Mock any global objects like google maps
beforeAll(() => {
  // Set up global mocks that all tests might need
  global.google = {
    maps: {
      LatLng: class LatLng {
        constructor(public lat: number, public lng: number) {}
      },
      Size: class Size {
        constructor(public width: number, public height: number) {}
      },
      LatLngBounds: class LatLngBounds {
        extend() { return this; }
        isEmpty() { return false; }
      },
      DirectionsService: class DirectionsService {
        route(request: any, callback: any) {
          callback({ routes: [{ legs: [{ distance: { text: "5 mi" }, duration: { text: "10 min" } }] }] }, "OK");
        }
      },
      DirectionsStatus: {
        OK: "OK"
      },
      TravelMode: {
        DRIVING: "DRIVING"
      },
      MarkerF: class MarkerF {
        addListener() {}
        setMap() {}
      },
      InfoWindowF: class InfoWindowF {
        setContent() {}
        open() {}
        close() {}
      },
      Map: class Map {
        fitBounds() {}
        setZoom() {}
      }
    } as any
  };
});

afterEach(async () => {
  // Clean up any test data after each test
  // This is especially important for component tests that might create database entries
});

afterAll(async () => {
  // Final cleanup
  await clearTestData();
});
