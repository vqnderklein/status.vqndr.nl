export type Status = 'ok' | 'deg' | 'out' | 'mnt';

export type MaintenanceWindow = {
  id: number;
  title: string;
  startsAt: string;
  endsAt: string;
  serviceIds: string[];
};