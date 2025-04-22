
import { render, screen } from '@testing-library/react';
import GeneralSettings from '../GeneralSettings';

describe('GeneralSettings', () => {
  it('renders without errors', () => {
    render(
      <GeneralSettings
        businessName="Test Business"
        email="test@example.com"
        phone="(555) 123-4567"
        address="123 Test St"
        defaultTaxRate={7.5}
        onLogoUpload={() => {}}
      />
    );

    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tax rate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });
});
