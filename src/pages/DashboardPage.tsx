import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
  Users,
  FileText,
  DollarSign,
  ArrowUpRight,
  Package,
  AlertTriangle,
  Clock,
  Map,
  CalendarDays,
  ChevronRight,
  BarChart,
  TrendingUp,
  TrendingDown,
  Leaf,
  Sun,
  Cloud,
  CloudRain,
} from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';

// Mock data types
interface UpcomingJob {
  id: string;
  customerName: string;
  serviceType: string;
  date: string;
  address: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface RecentInvoice {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface KeyMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

// Mock data
const upcomingJobs: UpcomingJob[] = [
  {
    id: '1',
    customerName: 'John Smith',
    serviceType: 'Lawn Mowing',
    date: '2025-05-05T14:00:00',
    address: '123 Main St, Anytown, USA',
    status: 'scheduled',
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    serviceType: 'Lawn Treatment',
    date: '2025-05-06T10:30:00',
    address: '456 Oak Ave, Somewhere, USA',
    status: 'scheduled',
  },
  {
    id: '3',
    customerName: 'Robert Williams',
    serviceType: 'Garden Maintenance',
    date: '2025-05-05T09:00:00',
    address: '789 Pine Rd, Nowhere, USA',
    status: 'in-progress',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    serviceType: 'Lawn Mowing',
    date: '2025-05-07T16:00:00',
    address: '234 Elm St, Anytown, USA',
    status: 'scheduled',
  },
];

const recentInvoices: RecentInvoice[] = [
  {
    id: 'INV-2025-0042',
    customerName: 'John Smith',
    amount: 120.50,
    date: '2025-05-01',
    status: 'paid',
  },
  {
    id: 'INV-2025-0041',
    customerName: 'Emily Davis',
    amount: 85.00,
    date: '2025-04-29',
    status: 'paid',
  },
  {
    id: 'INV-2025-0040',
    customerName: 'Robert Williams',
    amount: 210.75,
    date: '2025-04-25',
    status: 'overdue',
  },
  {
    id: 'INV-2025-0039',
    customerName: 'Sarah Johnson',
    amount: 150.00,
    date: '2025-04-22',
    status: 'pending',
  },
];

const keyMetrics: KeyMetric[] = [
  {
    label: 'Total Customers',
    value: 54,
    change: 12.5,
    icon: <Users className="h-4 w-4 text-blue-500" />,
  },
  {
    label: 'Monthly Revenue',
    value: '$8,240',
    change: 8.2,
    icon: <DollarSign className="h-4 w-4 text-green-500" />,
  },
  {
    label: 'Pending Jobs',
    value: 12,
    change: -4.5,
    icon: <Calendar className="h-4 w-4 text-orange-500" />,
  },
  {
    label: 'Low Stock Items',
    value: 3,
    change: 0,
    icon: <Package className="h-4 w-4 text-yellow-500" />,
  },
];

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const formatSimpleDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Define business profile interface
interface BusinessProfile {
  city: string;
  state: string;
  address: string;
}

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    city: 'Stafford',
    state: 'VA',
    address: '123 Main St, Stafford, VA'
  });

  // Get today's jobs
  const todaysJobs = upcomingJobs.filter(job => {
    const jobDate = new Date(job.date);
    const today = new Date();
    return jobDate.toDateString() === today.toDateString();
  });

  // Get tomorrow's jobs
  const tomorrowsJobs = upcomingJobs.filter(job => {
    const jobDate = new Date(job.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return jobDate.toDateString() === tomorrow.toDateString();
  });

  // Status badge color mapping
  const getStatusColor = (status: UpcomingJob['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status: RecentInvoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, John! Here's an overview of your lawn care business.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule New Job
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full p-2 bg-gray-100">
                      {metric.icon}
                    </div>
                    <Badge variant="outline" className={`${metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {metric.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : metric.change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                      {Math.abs(metric.change)}%
                    </Badge>
                  </div>
                  <h3 className="text-sm text-gray-500 mt-3">{metric.label}</h3>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weather and Today's Jobs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="mr-2 h-5 w-5 text-yellow-500" />
                  Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherWidget location={`${businessProfile?.city || 'Stafford'}, ${businessProfile?.state || 'VA'}`} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  {todaysJobs.length} jobs scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {todaysJobs.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                      No jobs scheduled for today
                    </div>
                  ) : (
                    todaysJobs.map((job) => (
                      <div key={job.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{job.customerName}</h4>
                            <p className="text-sm text-gray-500">{job.serviceType}</p>
                            <p className="text-xs text-gray-500 mt-1">{job.address}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                            <p className="text-sm mt-1">{formatDate(job.date).split(' at ')[1]}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Link to="/service-scheduling" className="text-blue-600 text-sm flex items-center hover:underline">
                  View full schedule
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Invoices and Inventory Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>
                  Latest financial activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{invoice.customerName}</h4>
                          <p className="text-sm text-gray-500">{invoice.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                          <div className="flex items-center mt-1">
                            <p className="text-xs text-gray-500 mr-2">{formatSimpleDate(invoice.date)}</p>
                            <Badge className={getInvoiceStatusColor(invoice.status)}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Link to="/invoicing" className="text-blue-600 text-sm flex items-center hover:underline">
                  View all invoices
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Low Stock Items
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">3 items need to be restocked soon</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="text-sm flex justify-between">
                      <span>Weed Killer Concentrate</span>
                      <span className="font-medium text-red-600">3 left</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span>Snow Melt Granules</span>
                      <span className="font-medium text-red-600">2 left</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span>Grass Seed - Shade Mix</span>
                      <span className="font-medium text-yellow-600">4 left</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Link to="/inventory" className="text-blue-600 text-sm flex items-center hover:underline">
                  Manage inventory
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Today's Jobs
                </CardTitle>
                <CardDescription>
                  {todaysJobs.length} jobs scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {todaysJobs.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                      No jobs scheduled for today
                    </div>
                  ) : (
                    todaysJobs.map((job) => (
                      <div key={job.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{job.customerName}</h4>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-gray-500 mr-1" />
                              <p className="text-sm text-gray-500">{formatDate(job.date)}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Map className="h-3 w-3 text-gray-500 mr-1" />
                              <p className="text-xs text-gray-500">{job.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                            <p className="text-sm mt-1 font-medium">{job.serviceType}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                          {job.status === 'scheduled' && (
                            <Button size="sm" className="w-full">
                              Start Job
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Job
                </Button>
              </CardFooter>
            </Card>

            {/* Tomorrow's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                  Tomorrow's Jobs
                </CardTitle>
                <CardDescription>
                  {tomorrowsJobs.length} jobs scheduled for tomorrow
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {tomorrowsJobs.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                      No jobs scheduled for tomorrow
                    </div>
                  ) : (
                    tomorrowsJobs.map((job) => (
                      <div key={job.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{job.customerName}</h4>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-gray-500 mr-1" />
                              <p className="text-sm text-gray-500">{formatDate(job.date)}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Map className="h-3 w-3 text-gray-500 mr-1" />
                              <p className="text-xs text-gray-500">{job.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                            <p className="text-sm mt-1 font-medium">{job.serviceType}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Link to="/service-scheduling" className="text-blue-600 text-sm flex items-center hover:underline">
                  View full schedule
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Map Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2 h-5 w-5 text-green-500" />
                Job Locations
              </CardTitle>
              <CardDescription>
                Map view of today's service locations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-gray-500">Map view will display here</p>
                  <Link to="/customer-map">
                    <Button variant="outline" className="mt-4">
                      Open Full Map
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>
                  Financial performance for the current month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-500">Revenue chart will display here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <p className="text-3xl font-bold">$8,240</p>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>8.2% from last month</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Outstanding</p>
                    <p className="text-2xl font-bold">$1,250</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">$450</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Average Invoice</p>
                  <p className="text-2xl font-bold">$156.50</p>
                </div>

                <div className="pt-4 border-t">
                  <Link to="/invoicing">
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      View All Invoices
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest invoice activity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{invoice.customerName}</h4>
                        <p className="text-sm text-gray-500">{invoice.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatSimpleDate(invoice.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                        {invoice.status === 'overdue' && (
                          <Button size="sm" className="mt-2">
                            Send Reminder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 flex justify-between">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
              <Button>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Run Financial Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
