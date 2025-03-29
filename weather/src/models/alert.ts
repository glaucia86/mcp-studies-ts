export interface Alert {
  id: string;
  event: string;
  areaDesc: string;
  severity: string;
  status: string;
  headline: string;
  description?: string;
  instruction?: string;
  expires: Date;
}