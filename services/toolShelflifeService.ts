export interface ToolShelflifeRule {
  rule_id?: string;
  rule_name: string;
  tool_name: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

// Static data for now - can be easily replaced with API calls
const staticToolShelflifeRules: ToolShelflifeRule[] = [
  {
    rule_id: '1',
    rule_name: 'Quarterly Maintenance',
    tool_name: 'Hydraulic Press',
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    rule_id: '2',
    rule_name: 'Annual Calibration',
    tool_name: 'Digital Multimeter',
    start_date: '2024-02-15',
    end_date: '2025-02-15',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    rule_id: '3',
    rule_name: 'Monthly Inspection',
    tool_name: 'Safety Equipment',
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  }
];

// Available tools for dropdown
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

export const getToolShelflifeRules = async (): Promise<ToolShelflifeRule[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return staticToolShelflifeRules;
};

export const addToolShelflifeRule = async (rule: Omit<ToolShelflifeRule, 'rule_id' | 'created_at' | 'updated_at'>): Promise<ToolShelflifeRule> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRule: ToolShelflifeRule = {
    ...rule,
    rule_id: (staticToolShelflifeRules.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  staticToolShelflifeRules.push(newRule);
  return newRule;
};

export const deleteToolShelflifeRule = async (ruleId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = staticToolShelflifeRules.findIndex(rule => rule.rule_id === ruleId);
  if (index > -1) {
    staticToolShelflifeRules.splice(index, 1);
  }
};