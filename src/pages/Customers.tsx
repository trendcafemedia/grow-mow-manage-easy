
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomerCard } from "@/components/CustomerList/CustomerCard";
import { CustomerDetailModal } from "@/components/CustomerList/CustomerDetailModal";
import { Customer } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addCustomerError, setAddCustomerError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*, services(id, scheduled_at, invoices(id, amount, status))');
      
      if (error) throw error;
      
      return data.map((customer): Customer => ({
        id: customer.id,
        name: customer.name,
        address: customer.address || "",
        lat: customer.lat,
        lng: customer.lng,
        place_id: customer.place_id,
        phone: customer.phone,
        status: "paid",
        services: customer.services || []
      }));
    },
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching customers:", err);
        toast({ 
          title: "Error", 
          description: "Failed to load customers. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    try {
      navigate("/customer/new");
    } catch (error) {
      console.error("Error navigating to add customer:", error);
      setAddCustomerError(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="space-y-2">
          {addCustomerError && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>
                Unable to open add-customer form, please reload.
              </AlertDescription>
            </Alert>
          )}
          <Button size="sm" onClick={handleAddCustomer}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-red-500">
          Failed to load customers. Please refresh and try again.
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {searchQuery ? "No customers match your search." : "No customers found. Add your first customer using the button above."}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={setSelectedCustomer}
            />
          ))}
        </div>
      )}

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
};

export default Customers;
