
import { useState, useEffect } from "react";
import { Calendar, DollarSign, User, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeatherForecast } from "@/components/WeatherForecast";
import { CustomerStatusBar } from "@/components/dashboard/CustomerStatusBar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessProfile, setBusinessProfile] = useState({ 
    city: "Your City", 
    state: "State" 
  });

  // Fetch business profile data when component mounts
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('city, state')
          .single();
        
        if (data) {
          setBusinessProfile(data);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
      }
    };

    fetchBusinessProfile();
  }, []);

  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      title: "Earnings This Week",
      value: "$487.50",
      icon: <DollarSign className="h-4 w-4" />,
      description: "8% increase from last week",
      onClick: () => navigate("/billing?filter=paid-this-week")
    },
    {
      title: "Jobs This Week",
      value: "7",
      icon: <Calendar className="h-4 w-4" />,
      description: "2 more than last week",
      onClick: () => navigate("/calendar")
    },
    {
      title: "Unpaid Balance",
      value: "$210.00",
      icon: <DollarSign className="h-4 w-4" />,
      description: "3 customers with unpaid invoices",
      onClick: () => navigate("/billing?filter=unpaid")
    },
    {
      title: "Next Appointment",
      value: "Today, 3:30 PM",
      icon: <Clock className="h-4 w-4" />,
      description: "Mrs. Johnson - Lawn Mowing",
      onClick: () => navigate("/services/1")
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

      {/* Responsive grid for quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            className="cursor-pointer hover:shadow-md transition-shadow hover:border-green-300"
            onClick={stat.onClick}
          />
        ))}
      </div>

      {/* Weather forecast - responsive design */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">3-Day Forecast for {businessProfile.city}, {businessProfile.state}</h2>
        <WeatherForecast />
      </div>

      {/* Customer status section - improved styling */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-green-800">Customer Status</h2>
        <Card className="bg-card rounded-lg border-green-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="text-md text-green-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {customers.map((customer) => (
              <CustomerStatusBar 
                key={customer.id} 
                customer={customer} 
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
