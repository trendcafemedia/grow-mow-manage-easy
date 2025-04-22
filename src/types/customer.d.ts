
export interface Customer {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  place_id?: string;
  status: "paid" | "upcoming" | "unpaid" | "overdue";
  nextService?: string;
  daysUntilNextService?: number;
  amountDue?: number;
  services?: {
    id: string;
    scheduled_at: string;
    invoices: {
      id: string;
      amount: number;
      status: string;
    }[];
  }[];
}
