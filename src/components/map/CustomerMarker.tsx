
import { MarkerF, InfoWindowF } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerMarkerProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: (customer: Customer) => void;
  onClose: () => void;
}

export const CustomerMarker = ({ customer, isSelected, onSelect, onClose }: CustomerMarkerProps) => {
  const getMarkerIcon = (status: string) => {
    // Use custom colors based on status
    switch (status) {
      case "paid": return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case "upcoming": return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; // Changed from orange to yellow
      case "unpaid": case "overdue": return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default: return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  return (
    <>
      <MarkerF
        position={{ 
          lat: customer.lat || 39.8283, 
          lng: customer.lng || -98.5795 
        }}
        icon={{
          url: getMarkerIcon(customer.status),
          scaledSize: new google.maps.Size(30, 30),
        }}
        onClick={() => onSelect(customer)}
      />
      {isSelected && (
        <InfoWindowF
          position={{ 
            lat: customer.lat || 39.8283, 
            lng: customer.lng || -98.5795 
          }}
          onCloseClick={onClose}
        >
          <InfoWindowPanel customer={customer} />
        </InfoWindowF>
      )}
    </>
  );
};

interface InfoWindowPanelProps {
  customer: Customer;
}

const InfoWindowPanel = ({ customer }: InfoWindowPanelProps) => (
  <div className="p-2 max-w-xs">
    <h3 className="font-semibold">{customer.name}</h3>
    <p className="text-xs mt-1">{customer.address}</p>
    
    {customer.place_id && (
      <div className="mt-2 mb-2 h-32 w-full">
        <img 
          src={`https://maps.googleapis.com/maps/api/streetview?size=150x100&location=place_id:${customer.place_id}&key=${process.env.GOOGLE_MAPS_API_KEY}`}
          alt={`Street view of ${customer.address}`}
          className="w-full h-full object-cover rounded"
        />
      </div>
    )}
    
    <div className="mt-2 text-xs">
      <p>Next Service: {customer.nextService}</p>
      {(customer.status === "unpaid" || customer.status === "overdue") && (
        <p className="text-red-500 font-medium">
          Amount Due: ${customer.amountDue?.toFixed(2)}
        </p>
      )}
      <p className="mt-1">
        <span className={`px-2 py-0.5 rounded-full text-xs uppercase font-semibold ${
          customer.status === "paid" ? "bg-green-100 text-green-800" :
          customer.status === "upcoming" ? "bg-yellow-100 text-yellow-800" : // Changed from orange to yellow
          "bg-red-100 text-red-800"
        }`}>
          {customer.status}
        </span>
      </p>
      {customer.place_id && (
        <div className="mt-2">
          <a 
            href={`https://www.google.com/maps/?q=place_id:${customer.place_id}`}
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
);
