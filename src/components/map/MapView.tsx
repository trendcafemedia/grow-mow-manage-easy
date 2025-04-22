
import { GoogleMap } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/types/customer";
import { CustomerMarker } from "./CustomerMarker";

interface MapViewProps {
  customers: Customer[];
  center: google.maps.LatLngLiteral;
  zoom: number;
  selectedMarker: Customer | null;
  onMarkerSelect: (customer: Customer) => void;
  onMarkerClose: () => void;
  onMapLoad: (map: google.maps.Map) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 200px)",
  minHeight: "500px",
  borderRadius: "8px",
};

export const MapView = ({
  customers,
  center,
  zoom,
  selectedMarker,
  onMarkerSelect,
  onMarkerClose,
  onMapLoad
}: MapViewProps) => (
  <Card>
    <CardContent className="p-0 overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        {customers.map((customer) => (
          <CustomerMarker
            key={customer.id}
            customer={customer}
            isSelected={selectedMarker?.id === customer.id}
            onSelect={onMarkerSelect}
            onClose={onMarkerClose}
          />
        ))}
      </GoogleMap>
    </CardContent>
  </Card>
);

