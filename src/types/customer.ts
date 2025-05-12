
export interface Customer {
  id: string;
  name: string;
  address?: string;  // Made optional since we handle empty addresses in UI
  email?: string;    // Made optional since it's not always required in UI
  phone?: string;    // Made optional to match usage in components
  lat?: number;
  lng?: number;
  place_id?: string;
  status?: 'pending' | 'active' | 'inactive' | 'paid' | 'unpaid' | 'upcoming' | 'overdue';
  nextService?: string;
  daysUntilNextService?: number;
  amountDue?: number;
  serviceType?: string;
  nextServiceDate?: string;
  services?: Array<{
    id: string;
    scheduled_at: string;
    invoices?: Array<{
      id: string;
      amount: number;
      status: string;
    }>;
  }>;
  // coordinates is redundant with lat/lng at top level
  // keeping for backward compatibility but consider deprecating
  coordinates?: {
    lat: number;
    lng: number;
  };
}
