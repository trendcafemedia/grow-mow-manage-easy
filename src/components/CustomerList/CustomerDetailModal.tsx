
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { ServiceScheduler } from "@/components/Service/ServiceScheduler";

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerDetailModalProps) {
  const [schedulerError, setSchedulerError] = useState(false);
  const [invoiceError, setInvoiceError] = useState(false);

  if (!customer) return null;

  const handleScheduleService = () => {
    try {
      // Attempt to open scheduler
      setSchedulerError(false);
    } catch (error) {
      setSchedulerError(true);
    }
  };

  const handleNewInvoice = () => {
    try {
      // Attempt to open invoice modal
      setInvoiceError(false);
    } catch (error) {
      setInvoiceError(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{customer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {customer.place_id && (
            <div className="h-[300px] w-full">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/streetview?location=${customer.lat},${customer.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`}
                className="rounded-lg"
              ></iframe>
            </div>
          )}

          <div className="grid gap-4">
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
