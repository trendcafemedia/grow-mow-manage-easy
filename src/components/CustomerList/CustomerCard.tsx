
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerCardProps {
  customer: Customer;
  onClick: (customer: Customer) => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const getStreetViewUrl = (placeId: string) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=place_id:${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  };

  return (
    <Card 
      onClick={() => onClick(customer)} 
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardContent className="p-0">
        {customer.place_id && (
          <div className="relative h-[120px] w-full overflow-hidden rounded-t-lg">
            <img
              src={getStreetViewUrl(customer.place_id)}
              alt={`Street view of ${customer.address}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-medium">{customer.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {customer.address}
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
