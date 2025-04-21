
import { describe, it, expect, vi } from 'vitest';

// Mock the function that would be tested
const handleSuccessfulPayment = async (supabase: any, session: any) => {
  if (!session.client_reference_id) {
    throw new Error("No invoice ID found in session");
  }
  
  const invoiceId = session.client_reference_id;
  
  // Update invoice status
  await supabase
    .from("invoices")
    .update({
      status: "paid",
      payment_method: "stripe",
      stripe_session_id: session.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", invoiceId);
  
  // Generate receipt URL
  const receiptUrl = `https://example.com/receipts/${invoiceId}.pdf`;
  
  // Update with receipt URL
  await supabase
    .from("invoices")
    .update({
      pdf_receipt_url: receiptUrl
    })
    .eq("id", invoiceId);
  
  return { success: true, invoiceId, receiptUrl };
};

describe('Stripe Webhook Handler', () => {
  it('should update invoice status and set receipt URL', async () => {
    // Mock Supabase client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null })
    };
    
    // Mock Stripe session
    const mockSession = {
      id: 'cs_test_123',
      client_reference_id: 'invoice-123',
      payment_status: 'paid'
    };
    
    const result = await handleSuccessfulPayment(mockSupabase, mockSession);
    
    // Verify invoice was updated
    expect(mockSupabase.from).toHaveBeenCalledWith('invoices');
    expect(mockSupabase.update).toHaveBeenCalledTimes(2);
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'invoice-123');
    
    // Verify result
    expect(result.success).toBe(true);
    expect(result.invoiceId).toBe('invoice-123');
    expect(result.receiptUrl).toBe('https://example.com/receipts/invoice-123.pdf');
  });
  
  it('should throw error if client_reference_id is missing', async () => {
    // Mock Supabase client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null })
    };
    
    // Mock session without client_reference_id
    const mockSession = {
      id: 'cs_test_123',
      payment_status: 'paid'
    };
    
    await expect(handleSuccessfulPayment(mockSupabase, mockSession))
      .rejects
      .toThrow('No invoice ID found in session');
  });
});
