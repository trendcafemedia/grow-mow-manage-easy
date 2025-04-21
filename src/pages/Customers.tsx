
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Mock data - would come from API in real app
  const customers = [
    {
      id: "1",
      name: "Johnson Family",
      address: "123 Maple St",
      nextService: "Jun 28, 2023",
      avatarUrl: "J"
    },
    {
      id: "2",
      name: "Mrs. Wilson",
      address: "456 Oak Ave",
      nextService: "Tomorrow",
      avatarUrl: "W"
    },
    {
      id: "3",
      name: "Mr. Garcia",
      address: "789 Pine Rd",
      nextService: "Today",
      avatarUrl: "G"
    },
    {
      id: "4",
      name: "Robinson Household",
      address: "101 Cedar Ln",
      nextService: "Jun 30, 2023",
      avatarUrl: "R"
    }
  ];

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-8 bg-background"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <Card 
            key={customer.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCustomerClick(customer)}
          >
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold mr-3">
                  {customer.avatarUrl}
                </div>
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.address}</p>
                </div>
              </div>
              <div className="border-t px-4 py-3 bg-muted/50">
                <p className="text-sm">
                  <span className="font-medium">Next Service:</span> {customer.nextService}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Customer details and service history
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {selectedCustomer && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Address</h3>
                  <p className="text-sm">{selectedCustomer.address}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Next Service</h3>
                  <p className="text-sm">{selectedCustomer.nextService}</p>
                </div>
                <div className="pt-4 flex space-x-2">
                  <Button className="flex-1">Schedule Service</Button>
                  <Button variant="outline" className="flex-1">New Invoice</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
