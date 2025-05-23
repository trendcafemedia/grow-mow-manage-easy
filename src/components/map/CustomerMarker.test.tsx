
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerMarker } from './CustomerMarker';
import { Customer } from '@/types/customer';

// Mock the InfoWindowF and MarkerF components
vi.mock('@react-google-maps/api', () => ({
  MarkerF: ({ onClick }: any) => (
    <div data-testid="google-marker" onClick={onClick}>
      Marker
    </div>
  ),
  InfoWindowF: ({ children, onCloseClick }: any) => (
    <div data-testid="google-info-window">
      {children}
      <button data-testid="close-info-window" onClick={onCloseClick}>
        Close
      </button>
    </div>
  ),
}));

describe('CustomerMarker', () => {
  const mockCustomer: Customer = {
    id: 'test-customer-1',
    name: 'John Doe',
    address: '123 Main St, Stafford, VA 22554',
    lat: 38.4220,
    lng: -77.4083,
    place_id: 'test_place_id',
    status: 'paid',
    nextService: '04/25/2025',
    daysUntilNextService: 3,
    amountDue: 0,
    services: []
  };

  it('renders marker with the correct icon based on status', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    
    render(
      <CustomerMarker
        customer={mockCustomer}
        isSelected={false}
        onSelect={onSelect}
        onClose={onClose}
      />
    );
    
    expect(screen.getByTestId('google-marker')).toBeInTheDocument();
  });

  it('calls onSelect when marker is clicked', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    
    render(
      <CustomerMarker
        customer={mockCustomer}
        isSelected={false}
        onSelect={onSelect}
        onClose={onClose}
      />
    );
    
    fireEvent.click(screen.getByTestId('google-marker'));
    expect(onSelect).toHaveBeenCalledWith(mockCustomer);
  });

  it('displays info window when marker is selected', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    
    render(
      <CustomerMarker
        customer={mockCustomer}
        isSelected={true}
        onSelect={onSelect}
        onClose={onClose}
      />
    );
    
    expect(screen.getByTestId('google-info-window')).toBeInTheDocument();
  });

  it('calls onClose when info window close button is clicked', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    
    render(
      <CustomerMarker
        customer={mockCustomer}
        isSelected={true}
        onSelect={onSelect}
        onClose={onClose}
      />
    );
    
    fireEvent.click(screen.getByTestId('close-info-window'));
    expect(onClose).toHaveBeenCalled();
  });
});
