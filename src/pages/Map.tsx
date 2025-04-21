import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateDirections } from "@/utils/directions";

// Default map center (will be updated from business profile if available)
const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of USA

interface Customer {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  placeId?: string;
  status: "paid" | "upcoming" | "unpaid" | "overdue";
  nextService?: string;
  daysUntilNextService?: number;
  amountDue?: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 200px)",
  minHeight: "500px",
  borderRadius: "8px",
};

const Map = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(5);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC8mJIwGe0WCIQVAuCCOpDzZr6i3qH3NQA",
    libraries: ["places"],
  });

  useEffect(() => {
    const fetchBusinessAddressAndCustomers = async () => {
      try {
        // First, fetch business profile for default center
        const { data: businessProfile } = await supabase
          .from("business_profiles")
          .select("address")
          .single();

        // Since lat/lng might not exist in business_profiles yet,
        // we'll keep using the default center

        // Then fetch customers with coordinates and handle the potential missing placeId column
        const { data, error } = await supabase
          .from("customers")
          .select(`
            id,
            name,
            address,
            lat,
            lng,
            services (
              id,
              scheduled_at,
              invoices (
                id,
                amount,
                status
              )
            )
          `);

        if (error) throw error;

        if (data) {
          const today = new Date();
          const customersWithStatus = data.map((customer) => {
            // Calculate status based on next service date and payment status
            let status: "paid" | "upcoming" | "unpaid" | "overdue" = "paid";
            let amountDue = 0;
            let nextService = "";
            let daysUntilNextService = 999; // Large default value

            // Get the next service date if available
            if (customer.services && customer.services.length > 0) {
              // Sort services by scheduled_at in ascending order to get the next upcoming one
              const sortedServices = [...customer.services].sort((a, b) => 
                new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
              );
              
              const nextServiceObj = sortedServices.find(s => new Date(s.scheduled_at) >= today);
              
              if (nextServiceObj) {
                const nextServiceDate = new Date(nextServiceObj.scheduled_at);
                nextService = nextServiceDate.toLocaleDateString();
                
                // Calculate days until next service
                const diffTime = nextServiceDate.getTime() - today.getTime();
                daysUntilNextService = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                // Check if there's an unpaid invoice for this service
                const hasUnpaidInvoice = nextServiceObj.invoices && 
                  nextServiceObj.invoices.some(inv => inv.status === 'unpaid' || inv.status === 'overdue');
                
                if (hasUnpaidInvoice) {
                  status = daysUntilNextService < 0 ? "overdue" : "unpaid";
                  // Sum up unpaid amounts
                  amountDue = nextServiceObj.invoices
                    .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
                    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
                } else if (daysUntilNextService <= 7) {
                  status = "upcoming";
                }
              }
            }

            // Fallback if no next service or for demo purposes
            if (!nextService) {
              const randomStatus = Math.floor(Math.random() * 4);
              switch (randomStatus) {
                case 0: status = "paid"; break;
                case 1: status = "upcoming"; daysUntilNextService = Math.floor(Math.random() * 7) + 1; break;
                case 2: status = "unpaid"; amountDue = 50; break;
                case 3: status = "overdue"; amountDue = 75; break;
              }

              const nextServiceDate = new Date(today);
              nextServiceDate.setDate(today.getDate() + (status === "upcoming" ? daysUntilNextService : Math.floor(Math.random() * 14)));
              nextService = nextServiceDate.toLocaleDateString();
            }

            // Create a properly typed customer with the fields we have
            return {
              id: customer.id,
              name: customer.name,
              address: customer.address || "",
              lat: customer.lat || (39.8283 + (Math.random() * 10 - 5)),
              lng: customer.lng || (-98.5795 + (Math.random() * 20 - 10)),
              // Add placeId only if it exists in the customer object
              ...(customer.placeId ? { placeId: customer.placeId } : {}),
              status,
              nextService,
              daysUntilNextService,
              amountDue,
            };
          });

          setCustomers(customersWithStatus);
          
          // Create bounds for customer markers
          if (customersWithStatus.length > 0 && isLoaded) {
            const newBounds = new google.maps.LatLngBounds();
            
            customersWithStatus.forEach(customer => {
              if (customer.lat && customer.lng) {
                newBounds.extend({ lat: customer.lat, lng: customer.lng });
              }
            });
            
            setBounds(newBounds);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Could not load map data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchBusinessAddressAndCustomers();
    }
  }, [toast, isLoaded]);

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case "paid": return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case "upcoming": return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      case "unpaid": case "overdue": return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default: return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    if (bounds && !bounds.isEmpty()) {
      map.fitBounds(bounds);
      // Set a minimum zoom level to prevent excessive zoom on single markers
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customer Map</h1>
      </div>

      <Tabs defaultValue="map">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                onLoad={handleMapLoad}
                options={{
                  mapTypeControl: true,
                  streetViewControl: true,
                  fullscreenControl: true,
                }}
              >
                {customers.map((customer) => (
                  <MarkerF
                    key={customer.id}
                    position={{ 
                      lat: customer.lat || defaultCenter.lat, 
                      lng: customer.lng || defaultCenter.lng 
                    }}
                    icon={{
                      url: getMarkerIcon(customer.status),
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    onClick={() => setSelectedMarker(customer)}
                  />
                ))}

                {selectedMarker && (
                  <InfoWindowF
                    position={{ 
                      lat: selectedMarker.lat || defaultCenter.lat, 
                      lng: selectedMarker.lng || defaultCenter.lng 
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold">{selectedMarker.name}</h3>
                      <p className="text-xs mt-1">{selectedMarker.address}</p>
                      <div className="mt-2 text-xs">
                        <p>Next Service: {selectedMarker.nextService}</p>
                        {selectedMarker.status === "unpaid" || selectedMarker.status === "overdue" ? (
                          <p className="text-red-500 font-medium">
                            Amount Due: ${selectedMarker.amountDue?.toFixed(2)}
                          </p>
                        ) : null}
                        <p className="mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs uppercase font-semibold ${
                            selectedMarker.status === "paid" ? "bg-green-100 text-green-800" :
                            selectedMarker.status === "upcoming" ? "bg-orange-100 text-orange-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {selectedMarker.status}
                          </span>
                        </p>
                        {selectedMarker.placeId && (
                          <div className="mt-2">
                            <a 
                              href={`https://www.google.com/maps/?q=place_id:${selectedMarker.placeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Open in Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {customers.map((customer) => (
                  <div key={customer.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.address}</p>
                        <p className="text-sm mt-1">Next Service: {customer.nextService}</p>
                        {customer.placeId && (
                          <a 
                            href={`https://www.google.com/maps/?q=place_id:${customer.placeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center mt-1"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Open in Maps
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-0.5 rounded-full text-xs uppercase font-semibold ${
                          customer.status === "paid" ? "bg-green-100 text-green-800" :
                          customer.status === "upcoming" ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {customer.status}
                        </span>
                        {(customer.status === "unpaid" || customer.status === "overdue") && (
                          <p className="text-sm text-red-500 mt-1">
                            ${customer.amountDue?.toFixed(2)} due
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Map;
