export interface Bill {
  bill_id: string;
  bill_number: string;
  title: string;
  description: string;
  status: string;
  status_date: string;
}

export interface BillDocument {
  document_id: string;
  bill_id: string;
  document_type: string;
  document_size: number;
  document_mime: string;
  url: string;
}

export interface Campaign {
  id: number;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  lead_id: string;
}

export interface CampaignBill {
  campaign_id: number;
  bill_id: string;
}

export interface CampaignLegislator {
  campaign_id: number;
  legislator_id: string;
}

export interface BillReport {
  id: string;
  bill_id: string;
  report_type: 'summary' | 'impact' | 'compliance';
  content: any;
  requested_by: string;
  requested_at: string;
  completed_at: string | null;
  is_public: boolean;
}
