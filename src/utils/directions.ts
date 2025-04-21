
export interface DirectionsResult {
  distance: string;
  duration: string;
  durationValue: number; // in seconds
  isLongDistance: boolean;
}

export async function calculateDirections(
  origin: string | { lat: number; lng: number },
  destination: string | { lat: number; lng: number }
): Promise<DirectionsResult | null> {
  if (!window.google) {
    console.error("Google Maps API not loaded");
    return null;
  }

  return new Promise((resolve, reject) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: typeof origin === "string" ? origin : new google.maps.LatLng(origin.lat, origin.lng),
        destination: typeof destination === "string" ? destination : new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0].legs[0];
          
          if (!route) {
            reject(new Error("No route found"));
            return;
          }

          const durationValue = route.duration?.value || 0; // seconds
          const isLongDistance = durationValue > 20 * 60; // Over 20 minutes

          resolve({
            distance: route.distance?.text || "Unknown",
            duration: route.duration?.text || "Unknown",
            durationValue,
            isLongDistance
          });
        } else {
          reject(new Error(`Direction service failed: ${status}`));
        }
      }
    );
  });
}
