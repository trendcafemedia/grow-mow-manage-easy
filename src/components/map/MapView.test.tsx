
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapView } from './MapView';
import { Customer } from '@/types/customer';

// Mock the GoogleMap component
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onLoad }: any) => {
    // Call onLoad with a mock map instance
    if (onLoad) {
      onLoad({
        fitBounds: vi.fn(),
        setZoom: vi.fn()
      });
    }
    return (
      <div data-testid="google-map">
        {children}
      </div>
    );
  }
}));

// Mock the CustomerMarker component
vi.mock('./CustomerMarker', () => ({
  CustomerMarker: ({ customer }: any) => (
    <div data-testid={`customer-marker-${customer.id}`}>
      {customer.name}
    </div>
  )
}));

describe('MapView', () => {
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
    }
  ];

  it('renders GoogleMap component', () => {
    const onMarkerSelect = vi.fn();
    const onMarkerClose = vi.fn();
    const onMapLoad = vi.fn();
    
    render(
      <MapView
        customers={mockCustomers}
        center={{ lat: 38.4220, lng: -77.4083 }}
        zoom={10}
        selectedMarker={null}
        onMarkerSelect={onMarkerSelect}
        onMarkerClose={onMarkerClose}
        onMapLoad={onMapLoad}
      />
    );
    
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders correct number of CustomerMarker components', () => {
    const onMarkerSelect = vi.fn();
    const onMarkerClose = vi.fn();
    const onMapLoad = vi.fn();
    
    render(
      <MapView
        customers={mockCustomers}
        center={{ lat: 38.4220, lng: -77.4083 }}
        zoom={10}
        selectedMarker={null}
        onMarkerSelect={onMarkerSelect}
        onMarkerClose={onMarkerClose}
        onMapLoad={onMapLoad}
      />
    );
    
    expect(screen.getByTestId('customer-marker-customer-1')).toBeInTheDocument();
    expect(screen.getByTestId('customer-marker-customer-2')).toBeInTheDocument();
  });

  it('calls onMapLoad when the map loads', () => {
    const onMarkerSelect = vi.fn();
    const onMarkerClose = vi.fn();
    const onMapLoad = vi.fn();
    
    render(
      <MapView
        customers={mockCustomers}
        center={{ lat: 38.4220, lng: -77.4083 }}
        zoom={10}
        selectedMarker={null}
        onMarkerSelect={onMarkerSelect}
        onMarkerClose={onMarkerClose}
        onMapLoad={onMapLoad}
      />
    );
    
    expect(onMapLoad).toHaveBeenCalledWith(expect.any(Object));
  });
});
