
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerListViewProps {
  customers: Customer[];
}

export const CustomerListView = ({ customers }: CustomerListViewProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Customer List</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="divide-y">
        {customers.map((customer) => (
          <CustomerListItem key={customer.id} customer={customer} />
        ))}
      </div>
    </CardContent>
  </Card>
);

interface CustomerListItemProps {
  customer: Customer;
}

const CustomerListItem = ({ customer }: CustomerListItemProps) => (
  <div className="py-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{customer.name}</h3>
        <p className="text-sm text-muted-foreground">{customer.address}</p>
        <p className="text-sm mt-1">Next Service: {customer.nextService}</p>
        {customer.place_id && (
          <a 
            href={`https://www.google.com/maps/?q=place_id:${customer.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center mt-1"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Open in Maps
          </a>
        )}
      </div>
      <div className="flex flex-col items-end">
        <span className={`px-2 py-0.5 rounded-full text-xs uppercase font-semibold ${
          customer.status === "paid" ? "bg-green-100 text-green-800" :
          customer.status === "upcoming" ? "bg-orange-100 text-orange-800" :
          "bg-red-100 text-red-800"
        }`}>
          {customer.status}
        </span>
        {(customer.status === "unpaid" || customer.status === "overdue") && (
          <p className="text-sm text-red-500 mt-1">
            ${customer.amountDue?.toFixed(2)} due
          </p>
        )}
      </div>
    </div>
  </div>
);

