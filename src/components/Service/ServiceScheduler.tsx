import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ClipboardList } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface ServiceSchedulerProps {
  customerId: string;
}

export function ServiceScheduler({ customerId }: ServiceSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("9:00");
  const [serviceType, setServiceType] = useState("Mowing");
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  interface Service {
    id: string;
    scheduled_at: string;
    service_type: string;
    status?: string;
  }
  
  const [existingServices, setExistingServices] = useState<Service[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing services for this customer
    const fetchExistingServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, scheduled_at, service_type")
          .eq("customer_id", customerId)
          .order("scheduled_at", { ascending: true })
          .limit(5);

        if (error) throw error;
        setExistingServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    if (customerId) {
      fetchExistingServices();
    }
  }, [customerId]);

  const handleSubmit = async () => {
    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date for the service",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Convert date and time to ISO string
    const dateTime = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    dateTime.setHours(hours, minutes);

    try {
      // Schedule the service in the database
      const { data, error } = await supabase
        .from("services")
        .insert({
          customer_id: customerId,
          scheduled_at: dateTime.toISOString(),
          service_type: serviceType,
          status: "scheduled",
        })
        .select();

      if (error) throw error;

      // Update UI to show new service
      setExistingServices([...(data || []), ...existingServices].slice(0, 5));
      
      toast({
        title: "Service scheduled",
        description: `${serviceType} scheduled for ${format(dateTime, "PPP 'at' p")}`,
      });
      
      // Reset form
      setDate(undefined);
      setTime("9:00");
      setScheduleOpen(false);
    } catch (error) {
      console.error("Error scheduling service:", error);
      toast({
        title: "Error",
        description: "Could not schedule service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scheduled Services</h3>
        <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <PopoverTrigger asChild>
            <Button size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Service
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Service Date</h4>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="time" className="text-sm font-medium">
                      Time
                    </label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8:00">8:00 AM</SelectItem>
                        <SelectItem value="9:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">
                      Service Type
                    </label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mowing">Mowing</SelectItem>
                        <SelectItem value="Edging">Edging</SelectItem>
                        <SelectItem value="Hedge Trimming">Hedge Trimming</SelectItem>
                        <SelectItem value="Fertilizing">Fertilizing</SelectItem>
                        <SelectItem value="Leaf Removal">Leaf Removal</SelectItem>
                        <SelectItem value="Full Service">Full Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isLoading || !date}
                >
                  {isLoading ? "Scheduling..." : "Schedule Service"}
                </Button>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {existingServices.length > 0 ? (
        <div className="space-y-2">
          {existingServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center">
                <ClipboardList className="mr-2 h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{service.service_type}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(service.scheduled_at), "PPP 'at' p")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-green-100 p-1">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">Scheduled</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-muted-foreground">
          <ClipboardList className="mx-auto h-10 w-10 opacity-20" />
          <p className="mt-2 text-sm">No services scheduled</p>
        </div>
      )}
    </div>
  );
}
