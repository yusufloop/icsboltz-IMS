export interface WarrantyItem {
  warranty_id?: string;
  tool_name: string;
  warranty_file: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: 'active' | 'expired' | 'expiring_soon';
  created_at?: string;
  updated_at?: string;
}

// Static data for now - can be easily replaced with API calls
const staticWarranties: WarrantyItem[] = [
  {
    warranty_id: '1',
    tool_name: 'Hydraulic Press',
    warranty_file: 'https://example.com/warranty/hydraulic-press-warranty.pdf',
    start_date: '2024-01-01',
    end_date: '2026-01-01',
    duration: 730,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    warranty_id: '2',
    tool_name: 'Digital Multimeter',
    warranty_file: 'https://example.com/warranty/multimeter-warranty.pdf',
    start_date: '2024-02-15',
    end_date: '2025-02-15',
    duration: 365,
    status: 'expiring_soon',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    warranty_id: '3',
    tool_name: 'Safety Equipment',
    warranty_file: 'https://example.com/warranty/safety-equipment-warranty.pdf',
    start_date: '2023-03-01',
    end_date: '2024-03-01',
    duration: 365,
    status: 'expired',
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-03-01T00:00:00Z'
  }
];

// Available tools for dropdown (same as tool lifecycle)
export const availableTools = [
  'Hydraulic Press',
  'Digital Multimeter',
  'Safety Equipment',
  'Welding Machine',
  'Drill Press',
  'Lathe Machine',
  'Milling Machine',
  'Grinder',
  'Saw',
  'Measuring Tools'
];

// Helper function to determine warranty status
const getWarrantyStatus = (endDate: string): 'active' | 'expired' | 'expiring_soon' => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= 30) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
};

// Helper function to calculate duration in days
const calculateDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getWarranties = async (): Promise<WarrantyItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update status for all warranties based on current date
  const updatedWarranties = staticWarranties.map(warranty => ({
    ...warranty,
    status: getWarrantyStatus(warranty.end_date)
  }));
  
  return updatedWarranties;
};

export const addWarranty = async (warranty: Omit<WarrantyItem, 'warranty_id' | 'duration' | 'status' | 'created_at' | 'updated_at'>): Promise<WarrantyItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const duration = calculateDuration(warranty.start_date, warranty.end_date);
  const status = getWarrantyStatus(warranty.end_date);
  
  const newWarranty: WarrantyItem = {
    ...warranty,
    warranty_id: (staticWarranties.length + 1).toString(),
    duration,
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  staticWarranties.push(newWarranty);
  return newWarranty;
};

export const updateWarranty = async (warrantyId: string, updates: Partial<Omit<WarrantyItem, 'warranty_id' | 'created_at'>>): Promise<WarrantyItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = staticWarranties.findIndex(warranty => warranty.warranty_id === warrantyId);
  if (index === -1) {
    throw new Error('Warranty not found');
  }
  
  const updatedWarranty = { ...staticWarranties[index], ...updates };
  
  // Recalculate duration and status if dates changed
  if (updates.start_date || updates.end_date) {
    updatedWarranty.duration = calculateDuration(updatedWarranty.start_date, updatedWarranty.end_date);
    updatedWarranty.status = getWarrantyStatus(updatedWarranty.end_date);
  }
  
  updatedWarranty.updated_at = new Date().toISOString();
  staticWarranties[index] = updatedWarranty;
  
  return updatedWarranty;
};

export const deleteWarranty = async (warrantyId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = staticWarranties.findIndex(warranty => warranty.warranty_id === warrantyId);
  if (index > -1) {
    staticWarranties.splice(index, 1);
  }
};

export const getWarrantyById = async (warrantyId: string): Promise<WarrantyItem | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const warranty = staticWarranties.find(warranty => warranty.warranty_id === warrantyId);
  if (warranty) {
    return {
      ...warranty,
      status: getWarrantyStatus(warranty.end_date)
    };
  }
  return null;
};
