export interface ToolLifecycleRule {
  rule_id?: string;
  rule_name: string;
  tool_name: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

// Static data for now - can be easily replaced with API calls
const staticToolLifecycleRules: ToolLifecycleRule[] = [
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

export const getToolLifecycleRules = async (): Promise<ToolLifecycleRule[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return staticToolLifecycleRules;
};

export const addToolLifecycleRule = async (rule: Omit<ToolLifecycleRule, 'rule_id' | 'created_at' | 'updated_at'>): Promise<ToolLifecycleRule> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRule: ToolLifecycleRule = {
    ...rule,
    rule_id: (staticToolLifecycleRules.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  staticToolLifecycleRules.push(newRule);
  return newRule;
};

export const deleteToolLifecycleRule = async (ruleId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = staticToolLifecycleRules.findIndex(rule => rule.rule_id === ruleId);
  if (index > -1) {
    staticToolLifecycleRules.splice(index, 1);
  }
};
