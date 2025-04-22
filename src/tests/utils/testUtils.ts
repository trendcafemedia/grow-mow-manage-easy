
import { Customer } from "@/types/customer";
import { supabase } from "@/integrations/supabase/client";

// Mock customer data based on Stafford, VA area
export const generateMockCustomers = (count: number = 10): Customer[] => {
  const baseCoords = { lat: 38.4220, lng: -77.4083 }; // 21 White Chapel Ln, Stafford, VA
  const mockCustomers: Customer[] = [];
  
  const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Jennifer", "Robert", "Lisa", "William", "Jessica"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Wilson", "Martinez"];
  const streets = ["Oak", "Maple", "Pine", "Cedar", "Elm", "Washington", "Jefferson", "Lincoln", "Adams", "Madison"];
  const streetTypes = ["St", "Ave", "Blvd", "Dr", "Ln", "Way", "Pl", "Ct", "Rd", "Cir"];
  
  for (let i = 0; i < count; i++) {
    // Generate random coordinates within ~5 miles
    const latOffset = (Math.random() - 0.5) * 0.1; // ~5 miles in lat/lng
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const streetNumber = Math.floor(Math.random() * 9000) + 1000;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    
    const statusOptions: ("paid" | "upcoming" | "unpaid" | "overdue")[] = ["paid", "upcoming", "unpaid", "overdue"];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    // Create a mock customer
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
      .from('customers')
      .insert({
        id: customer.id,
        name: customer.name,
        address: customer.address,
        lat: customer.lat,
        lng: customer.lng,
        place_id: customer.place_id,
      });
    
    if (error) {
      console.error("Error seeding test customer:", error);
    }
  }
};

export const seedTestServices = async (customerId: string, count: number = 2) => {
  const serviceTypes = ["Lawn Mowing", "Hedge Trimming", "Leaf Removal", "Fertilization", "Weeding"];
  
  for (let i = 0; i < count; i++) {
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30));
    
    const { error } = await supabase
      .from('services')
      .insert({
        customer_id: customerId,
        service_type: serviceType,
        scheduled_at: scheduledDate.toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (error) {
      console.error("Error seeding test service:", error);
    }
  }
};

export const seedTestExpenses = async (count: number = 5) => {
  const items = ["Fuel", "Mower Blades", "Fertilizer", "Weed Killer", "Oil Change", "Equipment Repairs", "New Trimmer"];
  
  for (let i = 0; i < count; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const unitCost = Math.floor(Math.random() * 5000) / 100;
    
    const { error } = await supabase
      .from('expenses')
      .insert({
        item,
        quantity,
        unit_cost: unitCost,
        total: quantity * unitCost,
        date: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (error) {
      console.error("Error seeding test expense:", error);
    }
  }
};

export const clearTestData = async () => {
  // Clear test data - make sure to maintain proper order for foreign key constraints
  await supabase.from('invoices').delete().ilike('id', 'mock-%');
  await supabase.from('services').delete().ilike('id', 'mock-%');
  await supabase.from('customers').delete().ilike('id', 'mock-%');
  await supabase.from('expenses').delete().ilike('id', 'mock-%');
};

export const clearMockData = async () => {
  // Clear only mock data
  await supabase.from('invoices').delete().ilike('id', 'mock-%');
  await supabase.from('services').delete().ilike('id', 'mock-%');
  await supabase.from('customers').delete().ilike('id', 'mock-%');
  await supabase.from('expenses').delete().ilike('id', 'mock-%');
};

// Fixtures
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
