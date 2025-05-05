import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowUpDown, 
  MapPin, 
  Search, 
  Calendar, 
  User, 
  Home, 
  Phone, 
  Mail, 
  Loader2 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Customer } from '@/types/customer';

// Fallback data for development/testing
const fallbackCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    address: '123 Main St, Anytown, USA',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    serviceType: 'Weekly Mowing',
    nextServiceDate: '2025-05-10',
    coordinates: { lat: 40.712776, lng: -74.005974 }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    address: '456 Oak Ave, Somewhere, USA',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    serviceType: 'Bi-weekly Mowing',
    nextServiceDate: '2025-05-12',
    coordinates: { lat: 40.714776, lng: -74.003974 }
  },
  {
    id: '3',
    name: 'Robert Williams',
    address: '789 Pine Rd, Nowhere, USA',
    email: 'robert@example.com',
    phone: '(555) 456-7890',
    serviceType: 'Landscaping',
    nextServiceDate: '2025-05-15',
    coordinates: { lat: 40.716776, lng: -74.006974 }
  },
];

type SortField = 'name' | 'address' | 'serviceType' | 'nextServiceDate';
type CustomerResponse = {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  place_id?: string;
  status?: 'pending' | 'active' | 'inactive' | 'paid' | 'unpaid' | 'upcoming' | 'overdue';
  service_type?: string;
  next_service_date?: string;
  services?: Array<{
    id: string;
    scheduled_at: string;
    invoices?: Array<{
      id: string;
      amount: number;
      status: string;
    }>;
  }>;
};
type SortOrder = 'asc' | 'desc';

const CustomerMapPage: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch customers data
  const { data: customersData, isLoading, error } = useQuery({
    queryKey: ['customers-map'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*, services(id, scheduled_at, invoices(id, amount, status))');
        
        if (error) throw error;
        
        return data.map((customer: CustomerResponse): Customer => ({
          id: customer.id,
          name: customer.name,
          address: customer.address || "",
          email: customer.email || "",
          phone: customer.phone || "",
          lat: customer.lat,
          lng: customer.lng,
          place_id: customer.place_id,
          status: customer.status || "active",
          serviceType: customer.service_type || "Regular Service",
          nextServiceDate: customer.next_service_date || "Not scheduled",
          services: customer.services ? customer.services.map(service => ({
            id: service.id,
            scheduled_at: service.scheduled_at,
            invoices: service.invoices || []
          })) : [],
          coordinates: customer.lat && customer.lng ? {
            lat: customer.lat,
            lng: customer.lng
          } : undefined
        }));
      } catch (err) {
        console.error("Error fetching customers:", err);
        toast({
          title: "Error",
          description: "Failed to load customers. Using fallback data.",
          variant: "destructive"
        });
        return fallbackCustomers;
      }
    }
  });
  
  // Use fetched data or fallback to sample data
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers);
  
  // Update customers when data is fetched
  useEffect(() => {
    if (customersData) {
      setCustomers(customersData);
    }
  }, [customersData]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (!document.getElementById('google-maps-script') && !mapLoaded && !mapError) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      
      script.onerror = () => {
        setMapError(true);
        console.error('Failed to load Google Maps API');
      };
      
      document.head.appendChild(script);
    }
  }, [mapLoaded, mapError]);

  // Initialize map once script is loaded
  const initializeMap = () => {
    if (typeof google === 'undefined') return;
    
    const mapElement = document.getElementById('customer-map');
    if (!mapElement) return;
    
    try {
      // Center map on the average position of all customers with coordinates
      const bounds = new google.maps.LatLngBounds();
      const validCustomers = customers.filter(c => c.coordinates);
      
      if (validCustomers.length === 0) {
        // Default center if no customers have coordinates
        const map = new google.maps.Map(mapElement, {
          center: { lat: 40.712776, lng: -74.005974 },
          zoom: 12,
        });
        return;
      }
      
      const map = new google.maps.Map(mapElement, {
        zoom: 10,
      });
      
      // Add markers for each customer
      validCustomers.forEach(customer => {
        if (!customer.coordinates) return;
        
        const position = new google.maps.LatLng(
          customer.coordinates.lat, 
          customer.coordinates.lng
        );
        
        bounds.extend(position);
        
        const marker = new google.maps.Marker({
          position,
          map,
          title: customer.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            scale: 8,
          }
        });
        
        // Street view service
        const streetViewService = new google.maps.StreetViewService();
        
        // Info window with customer details and street view
        const infoWindow = new google.maps.InfoWindow();
        
        marker.addListener('mouseover', () => {
          // Get street view image
          streetViewService.getPanorama({
            location: position,
            radius: 50,
            preference: google.maps.StreetViewPreference.NEAREST,
          }, (data, status) => {
            let streetViewContent = '';
            
            if (status === google.maps.StreetViewStatus.OK) {
              const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=200x100&location=${position.lat()},${position.lng()}&key=YOUR_API_KEY`;
              streetViewContent = `<img src="${streetViewUrl}" alt="Street View" style="width:100%;margin-top:8px;">`;
            } else {
              streetViewContent = `<p style="color:#666;font-size:12px;margin-top:8px;">Street view not available</p>`;
            }
            
            const content = `
              <div style="padding:4px;max-width:300px;">
                <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;">${customer.name}</h3>
                <p style="margin:0 0 4px;font-size:14px;">${customer.address}</p>
                <p style="margin:0 0 4px;font-size:14px;"><strong>Service:</strong> ${customer.serviceType}</p>
                <p style="margin:0 0 4px;font-size:14px;"><strong>Next Service:</strong> ${customer.nextServiceDate}</p>
                ${streetViewContent}
              </div>
            `;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
            setSelectedCustomer(customer);
          });
        });
        
        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
      });
      
      // Fit map to all markers
      map.fitBounds(bounds);
      
      // Adjust zoom if too zoomed in
      const zoomChangeBoundsListener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
      });
      
      // Clean up listener after 3 seconds
      setTimeout(() => {
        google.maps.event.removeListener(zoomChangeBoundsListener);
      }, 3000);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  };

  // Sort and filter customers
  const sortedAndFilteredCustomers = useMemo(() => {
    let result = [...customers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.address.toLowerCase().includes(query) ||
        customer.serviceType.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date comparison
      if (sortField === 'nextServiceDate') {
        aValue = new Date(aValue).getTime().toString();
        bValue = new Date(bValue).getTime().toString();
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    return result;
  }, [customers, searchQuery, sortField, sortOrder]);

  // Toggle sort order
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Customer Map</h1>
      
      {/* Map */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div 
            id="customer-map" 
            className="w-full h-[400px] relative"
          >
            {!mapLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2 text-green-600 font-medium">Loading map...</span>
              </div>
            )}
            
            {mapError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80">
                <p className="text-red-500 font-medium">Error loading map</p>
                <p className="text-sm text-slate-500">Please check your API key and try again</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Customer list */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            View and manage your customer locations
          </CardDescription>
          
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-full md:max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort('name')}
                      className="font-medium flex items-center"
                    >
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort('address')}
                      className="font-medium flex items-center"
                    >
                      Address
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort('serviceType')}
                      className="font-medium flex items-center"
                    >
                      Service Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort('nextServiceDate')}
                      className="font-medium flex items-center"
                    >
                      Next Service
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAndFilteredCustomers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className={selectedCustomer?.id === customer.id ? "bg-green-50" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-start space-x-2">
                          <User className="h-4 w-4 mt-1 text-green-600" />
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-2">
                          <Home className="h-4 w-4 mt-1 text-green-600" />
                          <div>{customer.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.serviceType}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <div>{customer.nextServiceDate}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Service</DropdownMenuItem>
                            <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerMapPage;
