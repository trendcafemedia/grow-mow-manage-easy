import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { ServiceScheduler } from "@/components/Service/ServiceScheduler";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Clock, Map } from "lucide-react";

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerDetailModalProps) {
  const [schedulerError, setSchedulerError] = useState(false);
  const [invoiceError, setInvoiceError] = useState(false);
  const [driveTime, setDriveTime] = useState<string | null>(null);
  const [driveDistance, setDriveDistance] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset errors when modal opens/closes
    setSchedulerError(false);
    setInvoiceError(false);
    setMapError(false);
    
    // Calculate drive time and distance when customer changes
    if (customer && customer.lat && customer.lng) {
      // This would typically use a real API like Google Maps Distance Matrix
      // For demo purposes, we're just simulating with random values
      const distance = (Math.random() * 10 + 2).toFixed(1);
      const time = Math.round(Math.random() * 20 + 10);
      
      setDriveDistance(`${distance} miles`);
      setDriveTime(`${time} minutes`);
    }
  }, [customer, isOpen]);

  if (!customer) return null;

  const handleScheduleService = () => {
    try {
      navigate(`/services/new?customerId=${customer.id}`);
      onClose();
    } catch (error) {
      console.error("Error opening scheduler:", error);
      setSchedulerError(true);
    }
  };

  const handleNewInvoice = () => {
    try {
      navigate(`/billing/new?customerId=${customer.id}`);
      onClose();
    } catch (error) {
      console.error("Error opening invoice form:", error);
      setInvoiceError(true);
    }
  };

  const handleMapError = () => {
    setMapError(true);
  };

  const getGoogleMapsApiKey = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not found in environment variables");
      setMapError(true);
      return null;
    }
    return apiKey;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{customer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {customer.place_id && customer.lat && customer.lng && !mapError ? (
            <div className="h-[300px] w-full relative">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/streetview?location=${customer.lat},${customer.lng}&key=${getGoogleMapsApiKey()}`}
                className="rounded-lg"
                title={`Street view of ${customer.address}`}
                onError={handleMapError}
              ></iframe>
            </div>
          ) : (
            <div className="h-[300px] w-full bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Map preview not available</p>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm">{customer.address || "No address provided"}</p>
              </div>
              
              {customer.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{customer.phone}</p>
                </div>
              )}
              
              {driveDistance && driveTime && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{driveDistance} away, approximately {driveTime} drive time</p>
                </div>
              )}
            </div>

            <ServiceScheduler customerId={customer.id} />

            {schedulerError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Error opening scheduler, please reload.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button onClick={handleScheduleService} className="flex-1">
                Schedule Service
              </Button>
              <Button onClick={handleNewInvoice} variant="outline" className="flex-1">
                New Invoice
              </Button>
            </div>

            {invoiceError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Unable to open invoice form, try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
