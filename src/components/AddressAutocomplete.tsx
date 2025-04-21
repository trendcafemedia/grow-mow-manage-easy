
import { useRef, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, placeData?: { lat: number; lng: number; placeId?: string }) => void;
  className?: string;
  error?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const libraries: ("places")[] = ["places"];

export function AddressAutocomplete({
  value,
  onChange,
  className,
  error,
  id = "address",
  label = "Address",
  placeholder = "Enter an address",
  required = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC8mJIwGe0WCIQVAuCCOpDzZr6i3qH3NQA", // Using the provided API key
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || isInitialized) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["formatted_address", "geometry", "name", "place_id"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (place && place.formatted_address) {
          const location = place.geometry?.location;
          
          if (location) {
            onChange(place.formatted_address, {
              lat: location.lat(),
              lng: location.lng(),
              placeId: place.place_id,
            });
          } else {
            onChange(place.formatted_address);
          }
        }
      });

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing Places Autocomplete:", error);
    }
  }, [isLoaded, onChange, isInitialized]);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className={error ? "text-destructive" : ""}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        {!isLoaded && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        <Input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(className, error && "border-destructive")}
          aria-invalid={!!error}
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
