
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from "@/integrations/supabase/client";

// Define expense calculation functions
const calculateTotalExpenses = async (startDate: Date, endDate: Date) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('total')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());
    
  if (error) throw error;
  
  return data.reduce((sum, expense) => sum + (expense.total || 0), 0);
};

const calculateFuelExpenses = async (startDate: Date, endDate: Date) => {
  const { data, error } = await supabase
    .from('fuel_logs')
    .select('gallons, price_per_gallon')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());
    
  if (error) throw error;
  
  return data.reduce((sum, log) => sum + (log.gallons * log.price_per_gallon), 0);
};

describe('Expense Calculations with Real Data', () => {
  // Test data to be seeded
  const testExpenses = [
    { item: 'Mower Blades', quantity: 2, unit_cost: 25.99, total: 51.98, date: '2025-04-15' },
    { item: 'Fertilizer', quantity: 3, unit_cost: 15.75, total: 47.25, date: '2025-04-17' },
    { item: 'Weed Killer', quantity: 1, unit_cost: 35.50, total: 35.50, date: '2025-04-20' },
  ];
  
  const testFuelLogs = [
    { gallons: 5.5, price_per_gallon: 3.89, date: '2025-04-16' },
    { gallons: 4.2, price_per_gallon: 3.92, date: '2025-04-19' },
  ];
  
  // Seed test data before running tests
  beforeAll(async () => {
    // Get the current user ID for the expenses
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      throw new Error("No authenticated user found. Tests require authentication.");
    }
    
    // Seed expenses
    for (const expense of testExpenses) {
      await supabase.from('expenses').insert({
        ...expense,
        id: `mock-exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        user_id: userId
      });
    }
    
    // Seed fuel logs
    for (const log of testFuelLogs) {
      await supabase.from('fuel_logs').insert({
        ...log,
        id: `mock-fuel-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        user_id: userId
      });
    }
  });
  
  // Clean up test data after tests
  afterAll(async () => {
    await supabase.from('expenses').delete().ilike('id', 'mock-exp-%');
    await supabase.from('fuel_logs').delete().ilike('id', 'mock-fuel-%');
  });
  
  it('correctly calculates total expenses for a date range', async () => {
    const startDate = new Date('2025-04-15');
    const endDate = new Date('2025-04-20');
    
    const total = await calculateTotalExpenses(startDate, endDate);
    
    // Sum of all test expenses (51.98 + 47.25 + 35.50 = 134.73)
    expect(total).toBeCloseTo(134.73, 2);
  });
  
  it('correctly calculates fuel expenses for a date range', async () => {
    const startDate = new Date('2025-04-15');
    const endDate = new Date('2025-04-20');
    
    const total = await calculateFuelExpenses(startDate, endDate);
    
    // Calculation: (5.5 * 3.89) + (4.2 * 3.92) = 21.40 + 16.46 = 37.86
    expect(total).toBeCloseTo(37.86, 2);
  });
  
  it('returns zero for date ranges with no expenses', async () => {
    const startDate = new Date('2025-05-01');
    const endDate = new Date('2025-05-10');
    
    const total = await calculateTotalExpenses(startDate, endDate);
    expect(total).toBe(0);
    
    const fuelTotal = await calculateFuelExpenses(startDate, endDate);
    expect(fuelTotal).toBe(0);
  });
});
