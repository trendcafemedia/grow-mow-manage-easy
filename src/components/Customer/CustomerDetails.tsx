
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDirections } from "@/utils/directions";
import { Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomerDetailsProps {
  customerId: string;
  placeId?: string;
}

export function CustomerDetails({ customerId, placeId }: CustomerDetailsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [driveTime, setDriveTime] = useState<string | null>(null);
  const [businessAddress, setBusinessAddress] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusinessAddress = async () => {
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('lat, lng')
          .single();
        
        if (error) throw error;
        
        // Only set business address if we have coordinates
        if (data?.lat && data?.lng) {
          setBusinessAddress({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.error("Error fetching business address:", error);
      }
    };
    
    fetchBusinessAddress();
  }, []);

  useEffect(() => {
    if (!placeId) {
      setIsLoading(false);
      return;
    }
    
    const loadPlaceDetails = async () => {
      if (!window.google || !placeId) return;
      
      try {
        const request = {
          placeId,
          fields: ['name', 'formatted_address', 'photos', 'rating', 'website', 'geometry']
        };
        
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        
        service.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            setPlaceDetails(place);
          } else {
            console.error("Error fetching place details:", status);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error loading place details:", error);
        setIsLoading(false);
      }
    };
    
    // Load Google Places library if needed
    if (window.google && window.google.maps && window.google.maps.places) {
      loadPlaceDetails();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC8mJIwGe0WCIQVAuCCOpDzZr6i3qH3NQA&libraries=places`;
      script.async = true;
      script.onload = () => loadPlaceDetails();
      document.head.appendChild(script);
    }
  }, [placeId]);

  useEffect(() => {
    const calculateDriveTime = async () => {
      if (!businessAddress || !placeDetails?.geometry?.location) return;
      
      try {
        const result = await calculateDirections(
          businessAddress,
          { 
            lat: placeDetails.geometry.location.lat(), 
            lng: placeDetails.geometry.location.lng() 
          }
        );
        
        if (result) {
          setDriveTime(result.duration);
        }
      } catch (error) {
        console.error("Error calculating directions:", error);
      }
    };
    
    if (placeDetails && businessAddress) {
      calculateDriveTime();
    }
  }, [placeDetails, businessAddress]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!placeId || !placeDetails) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        {placeDetails.photos && placeDetails.photos.length > 0 && (
          <div className="relative h-32 mb-3 overflow-hidden rounded-md">
            <img 
              src={placeDetails.photos[0].getUrl()} 
              alt={placeDetails.name} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="space-y-2">
          {placeDetails.rating && (
            <div className="flex items-center">
              <div className="text-yellow-400">
                {Array.from({ length: Math.floor(placeDetails.rating) }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
                {placeDetails.rating % 1 > 0 && <span>☆</span>}
              </div>
              <span className="ml-1 text-sm text-gray-600">{placeDetails.rating}</span>
            </div>
          )}
          
          {placeDetails.website && (
            <div>
              <a 
                href={placeDetails.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {new URL(placeDetails.website).hostname}
              </a>
            </div>
          )}
          
          {driveTime && (
            <div className="flex items-center text-sm">
              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              <span>Drive time: {driveTime}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
