import { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/customer";
import { MapView } from "@/components/map/MapView";
import { CustomerListView } from "@/components/map/CustomerListView";

// Default map center (will be updated from business profile if available)
const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of USA

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
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      fetchBusinessAddressAndCustomers();
    }
  }, [toast, isLoaded]);

  const fetchBusinessAddressAndCustomers = async () => {
    try {
      // First, fetch business profile for default center
      const { data: businessProfile, error: businessError } = await supabase
        .from("business_profiles")
        .select("lat, lng")
        .single();

      if (!businessError && businessProfile?.lat && businessProfile?.lng) {
        setCenter({ lat: businessProfile.lat, lng: businessProfile.lng });
      }

      // Fetch customers with coordinates and service data
      const { data, error } = await supabase
        .from("customers")
        .select(`
          id,
          name,
          address,
          lat,
          lng,
          place_id,
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
        const customersWithStatus = data.map((customer): Customer => {
          // Calculate status based on next service date and payment status
          let status: "paid" | "upcoming" | "unpaid" | "overdue" = "paid";
          let amountDue = 0;
          let nextService = "";
          let daysUntilNextService = 999;

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
            place_id: customer.place_id,
            status,
            nextService,
            daysUntilNextService,
            amountDue,
            services: customer.services,
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

  const handleMapLoad = (map: google.maps.Map) => {
    if (bounds && !bounds.isEmpty()) {
      map.fitBounds(bounds);
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
          <MapView
            customers={customers}
            center={center}
            zoom={zoom}
            selectedMarker={selectedMarker}
            onMarkerSelect={setSelectedMarker}
            onMarkerClose={() => setSelectedMarker(null)}
            onMapLoad={handleMapLoad}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <CustomerListView customers={customers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Map;
