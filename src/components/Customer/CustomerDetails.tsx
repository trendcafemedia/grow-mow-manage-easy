
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, MapPin, Phone, Star, DollarSign } from "lucide-react";

interface CustomerService {
  id: string;
  date: string;
  type: string;
  status: "completed" | "scheduled" | "cancelled";
}

interface CustomerReview {
  id: string;
  date: string;
  rating: number;
  comment: string;
  kidReply?: string;
}

interface CustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    tags: string[];
    services: CustomerService[];
    reviews: CustomerReview[];
  } | null;
  open: boolean;
  onClose: () => void;
}

export function CustomerDetails({ customer, open, onClose }: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState<string>("info");

  if (!customer) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">{customer.name}</SheetTitle>
          <SheetDescription>Customer details and history</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="info" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Info
            </TabsTrigger>
            <TabsTrigger value="services" className="flex-1">
              Services
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex">
              <Button className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Service
              </Button>
              <Button variant="outline" className="ml-2 flex-1">
                <DollarSign className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <div className="space-y-4">
              {customer.services.map((service) => (
                <div
                  key={service.id}
                  className="p-3 border rounded-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{service.type}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {service.date}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                      ${service.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        service.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'}`
                    }>
                      {service.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {customer.reviews.length > 0 ? (
                customer.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3 border rounded-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{review.comment}</p>
                    {review.kidReply && (
                      <div className="mt-3 ml-4 pl-2 border-l-2 border-muted">
                        <p className="text-sm italic">"{review.kidReply}"</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No reviews yet
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
