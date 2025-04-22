
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomerListView } from './CustomerListView';
import { Customer } from '@/types/customer';

describe('CustomerListView', () => {
  const mockCustomers: Customer[] = [
    {
      id: 'customer-1',
      name: 'John Smith',
      address: '123 Oak St, Stafford, VA 22554',
      lat: 38.4220,
      lng: -77.4083,
      place_id: 'place_id_1',
      status: 'paid',
      nextService: '04/25/2025',
      daysUntilNextService: 3,
      amountDue: 0,
      services: []
    },
    {
      id: 'customer-2',
      name: 'Sarah Johnson',
      address: '456 Maple Ave, Stafford, VA 22554',
      lat: 38.4301,
      lng: -77.4120,
      place_id: 'place_id_2',
      status: 'unpaid',
      nextService: '04/22/2025',
      daysUntilNextService: 0,
      amountDue: 75.50,
      services: []
    },
    {
      id: 'customer-3',
      name: 'David Wilson',
      address: '789 Pine Blvd, Stafford, VA 22554',
      lat: 38.4189,
      lng: -77.4005,
      place_id: 'place_id_3',
      status: 'overdue',
      nextService: '04/20/2025',
      daysUntilNextService: -2,
      amountDue: 150.75,
      services: []
    }
  ];

  it('renders the customer list with correct number of items', () => {
    render(<CustomerListView customers={mockCustomers} />);
    
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('David Wilson')).toBeInTheDocument();
  });

  it('displays customer addresses correctly', () => {
    render(<CustomerListView customers={mockCustomers} />);
    
    expect(screen.getByText('123 Oak St, Stafford, VA 22554')).toBeInTheDocument();
    expect(screen.getByText('456 Maple Ave, Stafford, VA 22554')).toBeInTheDocument();
    expect(screen.getByText('789 Pine Blvd, Stafford, VA 22554')).toBeInTheDocument();
  });

  it('shows next service dates for each customer', () => {
    render(<CustomerListView customers={mockCustomers} />);
    
    expect(screen.getAllByText(/Next Service:/)).toHaveLength(3);
    expect(screen.getByText(/Next Service: 04\/25\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/Next Service: 04\/22\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/Next Service: 04\/20\/2025/)).toBeInTheDocument();
  });

  it('displays status badges with the correct classes', () => {
    render(<CustomerListView customers={mockCustomers} />);
    
    const paidBadge = screen.getByText('paid');
    const unpaidBadge = screen.getByText('unpaid');
    const overdueBadge = screen.getByText('overdue');
    
    expect(paidBadge).toHaveClass('bg-green-100');
    expect(unpaidBadge).toHaveClass('bg-red-100');
    expect(overdueBadge).toHaveClass('bg-red-100');
  });

  it('shows amount due for unpaid and overdue customers', () => {
    render(<CustomerListView customers={mockCustomers} />);
    
    expect(screen.getByText('$75.50 due')).toBeInTheDocument();
    expect(screen.getByText('$150.75 due')).toBeInTheDocument();
    expect(screen.queryByText('$0.00 due')).not.toBeInTheDocument();
  });

  it('contains Google Maps links for customers with place_id', () => {
    render(<CustomerListView customers={mockCustomers} />);
    
    const mapLinks = screen.getAllByText('Open in Maps');
    expect(mapLinks).toHaveLength(3);
    
    mapLinks.forEach((link, index) => {
      expect(link.closest('a')).toHaveAttribute(
        'href',
        expect.stringContaining(`place_id:${mockCustomers[index].place_id}`)
      );
    });
  });
});
