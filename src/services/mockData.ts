import type { 
  Bill, 
  Campaign, 
  UserContact, 
  TrackedBill, 
  TrackedLegislator, 
  Person, 
  BillReport,
  CampaignDocument 
} from '../types/database'

// Mock Bills
export const mockBills: Bill[] = [
  {
    bill_id: 'hr-1234-118',
    bill_number: 'H.R. 1234',
    title: 'Climate Action and Clean Energy Investment Act',
    description: 'A comprehensive bill to address climate change through clean energy investments, carbon pricing, and environmental justice initiatives.',
    status: 'Passed House',
    status_date: '2024-01-15T00:00:00Z',
    change_hash: 'abc123'
  },
  {
    bill_id: 's-5678-118',
    bill_number: 'S. 5678',
    title: 'Healthcare Cost Reduction Act',
    description: 'Legislation to reduce prescription drug costs and improve healthcare accessibility for all Americans.',
    status: 'In Committee',
    status_date: '2024-01-10T00:00:00Z',
    change_hash: 'def456'
  },
  {
    bill_id: 'hr-9999-118',
    bill_number: 'H.R. 9999',
    title: 'Infrastructure Modernization and Jobs Act',
    description: 'Investment in roads, bridges, broadband, and green infrastructure to create jobs and modernize America.',
    status: 'Introduced',
    status_date: '2024-01-20T00:00:00Z',
    change_hash: 'ghi789'
  },
  {
    bill_id: 's-1111-118',
    bill_number: 'S. 1111',
    title: 'Education Funding Reform Act',
    description: 'Reform federal education funding to ensure equitable resources for all students.',
    status: 'Passed Senate',
    status_date: '2024-01-18T00:00:00Z',
    change_hash: 'jkl012'
  },
  {
    bill_id: 'hr-2222-118',
    bill_number: 'H.R. 2222',
    title: 'Small Business Support and Recovery Act',
    description: 'Provide targeted support and resources for small businesses affected by economic challenges.',
    status: 'In Committee',
    status_date: '2024-01-12T00:00:00Z',
    change_hash: 'mno345'
  }
]

// Mock Legislators
export const mockLegislators: Person[] = [
  {
    people_id: 'sen-jane-smith',
    full_name: 'Jane Smith',
    party: 'Democratic',
    chamber: 'Senate',
    state: 'California'
  },
  {
    people_id: 'rep-john-doe',
    full_name: 'John Doe',
    party: 'Republican',
    chamber: 'House',
    state: 'Texas'
  },
  {
    people_id: 'sen-alex-johnson',
    full_name: 'Alex Johnson',
    party: 'Democratic',
    chamber: 'Senate',
    state: 'New York'
  },
  {
    people_id: 'rep-maria-garcia',
    full_name: 'Maria Garcia',
    party: 'Republican',
    chamber: 'House',
    state: 'Florida'
  },
  {
    people_id: 'sen-david-wilson',
    full_name: 'David Wilson',
    party: 'Independent',
    chamber: 'Senate',
    state: 'Maine'
  }
]

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    user_id: 'user-1',
    name: 'Clean Energy Advocacy Campaign',
    description: 'Promoting renewable energy legislation and climate action in Congress.',
    created_at: '2024-01-10T00:00:00Z',
    lead_id: 'user-1'
  },
  {
    id: 2,
    user_id: 'user-1',
    name: 'Healthcare Access Initiative',
    description: 'Working to expand healthcare access and reduce prescription drug costs.',
    created_at: '2024-01-05T00:00:00Z',
    lead_id: 'user-1'
  },
  {
    id: 3,
    user_id: 'user-1',
    name: 'Education Equity Project',
    description: 'Advocating for fair funding and resources for all schools.',
    created_at: '2024-01-01T00:00:00Z',
    lead_id: 'user-1'
  }
]

// Mock Tracked Bills
export const mockTrackedBills: TrackedBill[] = [
  {
    user_id: 'user-1',
    bill_id: 'hr-1234-118',
    tracked_at: '2024-01-15T10:00:00Z',
    notes: 'Key climate legislation to monitor'
  },
  {
    user_id: 'user-1',
    bill_id: 's-5678-118',
    tracked_at: '2024-01-14T15:30:00Z',
    notes: 'Important for healthcare campaign'
  },
  {
    user_id: 'user-1',
    bill_id: 'hr-9999-118',
    tracked_at: '2024-01-20T09:15:00Z',
    notes: 'Infrastructure impact analysis needed'
  }
]

// Mock Tracked Legislators
export const mockTrackedLegislators: TrackedLegislator[] = [
  {
    user_id: 'user-1',
    legislator_id: 'sen-jane-smith',
    tracked_at: '2024-01-12T00:00:00Z',
    notes: 'Environmental committee chair - key ally'
  },
  {
    user_id: 'user-1',
    legislator_id: 'rep-john-doe',
    tracked_at: '2024-01-10T00:00:00Z',
    notes: 'Opposition research needed'
  }
]

// Mock Bill Reports
export const mockBillReports: BillReport[] = [
  {
    id: 'report-1',
    bill_id: 'hr-1234-118',
    report_type: 'summary',
    content: {
      title: 'Climate Action Bill Analysis',
      summary: 'This comprehensive climate bill includes $500B in clean energy investments, establishes a carbon pricing mechanism, and creates green jobs programs.',
      key_points: [
        'Carbon pricing starting at $25/ton',
        'Clean energy tax credits extended',
        'Environmental justice fund established',
        'Green jobs training programs'
      ],
      impact_analysis: 'Expected to reduce emissions by 40% by 2030'
    },
    requested_by: 'user-1',
    requested_at: '2024-01-16T00:00:00Z',
    completed_at: '2024-01-16T02:00:00Z',
    is_public: true
  }
]

// Mock Campaign Documents
export const mockCampaignDocuments: CampaignDocument[] = [
  {
    id: 'doc-1',
    campaign_id: 1,
    title: 'Clean Energy Talking Points',
    content: {
      document_type: 'talking_points',
      sections: [
        {
          title: 'Economic Benefits',
          points: ['Job creation in renewable energy', 'Energy independence', 'Cost savings for consumers']
        },
        {
          title: 'Environmental Impact',
          points: ['Reduced carbon emissions', 'Cleaner air and water', 'Climate resilience']
        }
      ]
    },
    updated_by: 'user-1',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 'doc-2',
    campaign_id: 1,
    title: 'Stakeholder Contact List',
    content: {
      document_type: 'contacts',
      contacts: [
        { name: 'Environmental Defense Fund', contact: 'policy@edf.org', role: 'Partner' },
        { name: 'Clean Energy Coalition', contact: 'info@cleanenergy.org', role: 'Supporter' }
      ]
    },
    updated_by: 'user-1',
    updated_at: '2024-01-17T00:00:00Z'
  }
]

// Mock User Contacts
export const mockUserContacts: UserContact[] = [
  {
    id: 'contact-1',
    owner_id: 'user-1',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@advocacy.org',
    phone: '(555) 123-4567',
    title: 'Policy Director',
    organization: 'Climate Action Network',
    notes: 'Key ally on environmental issues',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'contact-2',
    owner_id: 'user-1',
    full_name: 'Michael Chen',
    email: 'michael.chen@healthaccess.org',
    phone: '(555) 987-6543',
    title: 'Legislative Affairs Manager',
    organization: 'Healthcare Access Coalition',
    notes: 'Healthcare policy expert',
    created_at: '2024-01-08T00:00:00Z'
  }
]

// Mock API Service
export class MockDataService {
  // Simulate API delay
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Bills
  async getBills(searchQuery?: string): Promise<Bill[]> {
    await this.delay()
    if (searchQuery) {
      return mockBills.filter(bill => 
        bill.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.bill_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return mockBills
  }

  async getBill(billId: string): Promise<Bill | null> {
    await this.delay()
    return mockBills.find(bill => bill.bill_id === billId) || null
  }

  // Legislators
  async getLegislators(searchQuery?: string): Promise<Person[]> {
    await this.delay()
    if (searchQuery) {
      return mockLegislators.filter(person => 
        person.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.party?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return mockLegislators
  }

  async getLegislator(legislatorId: string): Promise<Person | null> {
    await this.delay()
    return mockLegislators.find(person => person.people_id === legislatorId) || null
  }

  // User tracking
  async getTrackedBills(userId: string): Promise<(TrackedBill & { bill: Bill })[]> {
    await this.delay()
    return mockTrackedBills
      .filter(tracked => tracked.user_id === userId)
      .map(tracked => ({
        ...tracked,
        bill: mockBills.find(bill => bill.bill_id === tracked.bill_id)!
      }))
  }

  async getTrackedLegislators(userId: string): Promise<(TrackedLegislator & { legislator: Person })[]> {
    await this.delay()
    return mockTrackedLegislators
      .filter(tracked => tracked.user_id === userId)
      .map(tracked => ({
        ...tracked,
        legislator: mockLegislators.find(person => person.people_id === tracked.legislator_id)!
      }))
  }

  async trackBill(userId: string, billId: string, notes?: string): Promise<void> {
    await this.delay()
    const existing = mockTrackedBills.find(t => t.user_id === userId && t.bill_id === billId)
    if (!existing) {
      mockTrackedBills.push({
        user_id: userId,
        bill_id: billId,
        tracked_at: new Date().toISOString(),
        notes: notes || ''
      })
    }
  }

  async trackLegislator(userId: string, legislatorId: string, notes?: string): Promise<void> {
    await this.delay()
    const existing = mockTrackedLegislators.find(t => t.user_id === userId && t.legislator_id === legislatorId)
    if (!existing) {
      mockTrackedLegislators.push({
        user_id: userId,
        legislator_id: legislatorId,
        tracked_at: new Date().toISOString(),
        notes: notes || ''
      })
    }
  }

  // Campaigns (paid feature)
  async getCampaigns(userId: string): Promise<Campaign[]> {
    await this.delay()
    return mockCampaigns.filter(campaign => campaign.user_id === userId)
  }

  async getCampaign(campaignId: number): Promise<Campaign | null> {
    await this.delay()
    return mockCampaigns.find(campaign => campaign.id === campaignId) || null
  }

  async createCampaign(userId: string, name: string, description?: string): Promise<Campaign> {
    await this.delay()
    const newCampaign: Campaign = {
      id: mockCampaigns.length + 1,
      user_id: userId,
      name,
      description,
      created_at: new Date().toISOString(),
      lead_id: userId
    }
    mockCampaigns.push(newCampaign)
    return newCampaign
  }

  // Campaign documents
  async getCampaignDocuments(campaignId: number): Promise<CampaignDocument[]> {
    await this.delay()
    return mockCampaignDocuments.filter(doc => doc.campaign_id === campaignId)
  }

  // User contacts
  async getUserContacts(userId: string): Promise<UserContact[]> {
    await this.delay()
    return mockUserContacts.filter(contact => contact.owner_id === userId)
  }

  // Bill reports
  async getBillReport(billId: string): Promise<BillReport | null> {
    await this.delay()
    return mockBillReports.find(report => report.bill_id === billId) || null
  }

  // Combined search
  async search(query: string): Promise<{ bills: Bill[], legislators: Person[] }> {
    await this.delay()
    return {
      bills: await this.getBills(query),
      legislators: await this.getLegislators(query)
    }
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    trackedBillsCount: number
    trackedLegislatorsCount: number
    activeCampaignsCount: number
    notificationsCount: number
  }> {
    await this.delay()
    const trackedBills = await this.getTrackedBills(userId)
    const trackedLegislators = await this.getTrackedLegislators(userId)
    const campaigns = await this.getCampaigns(userId)
    
    return {
      trackedBillsCount: trackedBills.length,
      trackedLegislatorsCount: trackedLegislators.length,
      activeCampaignsCount: campaigns.length,
      notificationsCount: 3 // Mock notification count
    }
  }
}

// Export singleton instance
export const mockDataService = new MockDataService()