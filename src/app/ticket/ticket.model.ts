export interface Ticket {
  id: string;
  type: string;
  dateReceived: Date;
  dateResolved: Date;
  isIt: string;
  serviceModule: string;
  deliveredToOrganization: string;
  category: string;
  impact: string;
  shortDescription: string;
  status: string;
  workingHours: number;
  isUsed: string;
}
