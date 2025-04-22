
import { Calendar, DollarSign, User, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeatherForecast } from "@/components/WeatherForecast";
import { CustomerStatusBar } from "@/components/dashboard/CustomerStatusBar";

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Earnings This Week",
      value: "$487.50",
      icon: <DollarSign className="h-4 w-4" />,
      description: "8% increase from last week"
    },
    {
      title: "Jobs This Week",
      value: "7",
      icon: <Calendar className="h-4 w-4" />,
      description: "2 more than last week"
    },
    {
      title: "Unpaid Balance",
      value: "$210.00",
      icon: <DollarSign className="h-4 w-4" />,
      description: "3 customers with unpaid invoices"
    },
    {
      title: "Next Appointment",
      value: "Today, 3:30 PM",
      icon: <Clock className="h-4 w-4" />,
      description: "Mrs. Johnson - Lawn Mowing"
    }
  ];

  const customers = [
    {
      id: "1",
      name: "Johnson Family",
      status: "paid" as const,
      nextService: "Jun 28, 2023"
    },
    {
      id: "2",
      name: "Mrs. Wilson",
      status: "upcoming" as const,
      nextService: "Tomorrow, 2:00 PM"
    },
    {
      id: "3",
      name: "Mr. Garcia",
      status: "overdue" as const,
      amountDue: 75.00,
      nextService: "Yesterday (Missed)"
    },
    {
      id: "4",
      name: "Robinson Household",
      status: "upcoming" as const,
      nextService: "Jun 30, 2023"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Weather forecast - moved to top */}
      <WeatherForecast />

      {/* Customer status section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Customer Status</h2>
        <div className="bg-card rounded-lg p-4 border">
          {customers.map((customer) => (
            <CustomerStatusBar key={customer.id} customer={customer} />
          ))}
        </div>
      </div>

      {/* Stat cards section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
