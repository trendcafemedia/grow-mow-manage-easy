/**
 * Service model types
 */

export interface Service {
  id: string;
  customer_id: string;
  service_type: string;
  scheduled_at: string;
  completed_at?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  crew_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceInvoice {
  id: string;
  service_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceWithInvoice extends Service {
  invoice?: ServiceInvoice;
}

export interface ServiceRequest {
  customer_id: string;
  service_type: string;
  scheduled_at: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  crew_id?: string;
}

export interface ServiceStatus {
  upcoming: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  total: number;
}

// Crew assignment for services
export interface CrewAssignment {
  id: string;
  name: string;
  email: string; 
  phone?: string;
  services?: Service[];
  availability?: {
    day: string;
    timeSlots: string[];
  }[];
}
