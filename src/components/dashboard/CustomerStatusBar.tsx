
import { cn } from "@/lib/utils";

interface CustomerStatusBarProps {
  customer: {
    id: string;
    name: string;
    status: "paid" | "upcoming" | "overdue";
    nextService?: string;
    amountDue?: number;
  };
}

export function CustomerStatusBar({ customer }: CustomerStatusBarProps) {
  const statusStyles = {
    paid: "bg-green-500",
    upcoming: "bg-yellow-400",
    overdue: "bg-red-500"
  };

  const statusLabels = {
    paid: "Paid",
    upcoming: "Upcoming",
    overdue: "Overdue"
  };

  return (
    <div className="flex items-center space-x-2 mb-3 p-2 hover:bg-green-50 rounded-md transition-colors">
      <div className="flex-1 pr-2">
        <div className="text-sm font-medium">{customer.name}</div>
        <div className="text-xs text-muted-foreground">
          {customer.nextService && `Next: ${customer.nextService}`}
          {customer.amountDue && ` • $${customer.amountDue.toFixed(2)} due`}
        </div>
      </div>
      <div 
        className={cn(
          "text-xs font-semibold py-1 px-3 rounded-full text-white shadow-sm",
          statusStyles[customer.status]
        )}
      >
        {statusLabels[customer.status]}
      </div>
    </div>
  );
}
