import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Home } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerCardProps {
  customer: Customer;
  onClick: (customer: Customer) => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const getStreetViewUrl = (placeId: string) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not found in environment variables");
      return null;
    }
    return `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=place_id:${placeId}&key=${apiKey}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      onClick={() => onClick(customer)} 
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardContent className="p-0">
        <div className="relative h-[120px] w-full overflow-hidden rounded-t-lg bg-gray-100">
          {customer.place_id && !imageError ? (
            <img
              src={getStreetViewUrl(customer.place_id)}
              alt={`Street view of ${customer.address}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Home className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium">{customer.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {customer.address || "No address provided"}
          </p>
          {customer.phone && (
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Phone className="h-4 w-4 mr-1" />
              {customer.phone}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
