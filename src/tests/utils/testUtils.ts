
import { Customer } from "@/types/customer";
import { supabase } from "@/integrations/supabase/client";

// Table name constants
const TABLES = {
  CUSTOMERS: 'customers',
  SERVICES: 'services',
  FUEL_LOGS: 'fuel_logs',
  INVOICES: 'invoices',
  BUSINESS_PROFILES: 'business_profiles'
} as const;

// Test constants
export const TEST_USER_ID = 'test-user-id';

// Mock response fixtures
export const MOCK_STREET_VIEW_RESPONSE = {
  status: "OK",
  location: {
    lat: 38.4220,
    lng: -77.4083
  },
  pano_id: "mock_pano_id",
  copyright: "© 2023 Google",
  links: [],
  tiles: {
    worldSize: { width: 512, height: 256 },
    tileSize: { width: 512, height: 512 },
    centerHeading: 0
  }
};

export const MOCK_DIRECTIONS_RESPONSE = {
  status: "OK",
  routes: [{
    legs: [{
      distance: { text: "5.2 mi", value: 8368 },
      duration: { text: "12 mins", value: 720 },
      steps: [],
      start_location: { lat: 38.4220, lng: -77.4083 },
      end_location: { lat: 38.3672, lng: -77.5111 }
    }]
  }]
};

export const MOCK_PLACE_DETAILS_RESPONSE = {
  status: "OK",
  result: {
    formatted_address: "21 White Chapel Ln, Stafford, VA 22554",
    formatted_phone_number: "(555) 123-4567",
    name: "White Chapel Residence",
    geometry: {
      location: { lat: 38.4220, lng: -77.4083 }
    }
  }
};

// Mock customer data generator
export const generateMockCustomers = (count: number = 10): Customer[] => {
  const baseCoords = { lat: 38.4220, lng: -77.4083 };
  const mockCustomers: Customer[] = [];
  
  const firstNames = ["John", "Sarah", "Michael", "Emma", "David"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
  const streets = ["Oak", "Maple", "Pine", "Cedar", "Elm"];
  const streetTypes = ["St", "Ave", "Blvd", "Dr", "Ln"];
  
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const streetNumber = Math.floor(Math.random() * 9000) + 1000;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    
    const statusOptions: ("paid" | "upcoming" | "unpaid" | "overdue")[] = ["paid", "upcoming", "unpaid", "overdue"];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    mockCustomers.push({
      id: `mock-${i}-${Date.now()}`,
      name: `${firstName} ${lastName}`,
      address: `${streetNumber} ${street} ${streetType}, Stafford, VA 22554`,
      lat: baseCoords.lat + latOffset,
      lng: baseCoords.lng + lngOffset,
      place_id: `mock_place_id_${i}`,
      status,
      nextService: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      daysUntilNextService: Math.floor(Math.random() * 14),
      amountDue: status === "paid" ? 0 : Math.floor(Math.random() * 15000) / 100,
      services: []
    });
  }
  
  return mockCustomers;
};

// Database seeding functions
export const seedTestCustomers = async (customers: Customer[]) => {
  for (const customer of customers) {
    const { error } = await supabase
      .from(TABLES.CUSTOMERS)
      .insert({
        id: customer.id,
        name: customer.name,
        address: customer.address,
        lat: customer.lat,
        lng: customer.lng,
        place_id: customer.place_id,
        user_id: TEST_USER_ID
      });
    
    if (error) {
      console.error("Error seeding test customer:", error);
    }
  }
};

export const seedTestServices = async (customerId: string, count: number = 2) => {
  const serviceTypes = ["Lawn Mowing", "Hedge Trimming", "Leaf Removal"];
  
  for (let i = 0; i < count; i++) {
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30));
    
    const { error } = await supabase
      .from(TABLES.SERVICES)
      .insert({
        customer_id: customerId,
        service_type: serviceType,
        scheduled_at: scheduledDate.toISOString(),
        user_id: TEST_USER_ID
      });
    
    if (error) {
      console.error("Error seeding test service:", error);
    }
  }
};

export const clearTestData = async () => {
  await supabase.from(TABLES.SERVICES).delete().ilike('id', 'mock-%');
  await supabase.from(TABLES.CUSTOMERS).delete().ilike('id', 'mock-%');
};

export const clearMockData = async () => {
  await supabase.from(TABLES.SERVICES).delete().ilike('id', 'mock-%');
  await supabase.from(TABLES.CUSTOMERS).delete().ilike('id', 'mock-%');
};
