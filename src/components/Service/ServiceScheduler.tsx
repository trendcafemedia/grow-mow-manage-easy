import { useEffect, useState } from "react";
import { calculateDirections } from "@/utils/directions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ServiceSchedulerProps {
  customerId: string;
}

export function ServiceScheduler({ customerId }: ServiceSchedulerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [driveTime, setDriveTime] = useState<string | null>(null);
  const [isLongDistance, setIsLongDistance] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const calculateEta = async () => {
      if (!customerId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch business location
        const { data: business, error: businessError } = await supabase
          .from('business_profiles')
          .select('lat, lng')
          .single();
        
        if (businessError) throw businessError;
        
        // Fetch customer location
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('lat, lng')
          .eq('id', customerId)
          .single();
        
        if (customerError) throw customerError;
        
        // Check if we have both coordinates
        if (business?.lat && business?.lng && customer?.lat && customer?.lng) {
          const businessCoords = { lat: business.lat, lng: business.lng };
          const customerCoords = { lat: customer.lat, lng: customer.lng };
          
          const result = await calculateDirections(
            businessCoords,
            customerCoords
          );
          
          if (result) {
            setDriveTime(result.duration);
            setIsLongDistance(result.isLongDistance);
            
            if (result.isLongDistance) {
              toast({
                title: "Long drive time",
                description: `This customer is ${result.duration} away. Consider rescheduling other jobs.`,
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error calculating ETA:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateEta();
  }, [customerId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Calculating drive time...
      </div>
    );
  }

  if (!driveTime) {
    return null;
  }

  return (
    <div className={`text-sm ${isLongDistance ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
      Drive time: {driveTime} {isLongDistance && '(Long distance)'}
    </div>
  );
}
