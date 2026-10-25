export type Status = "ok" | "deg" | "out" | "mnt";

export type MaintenanceWindow = {
	id: number;
	title: string;
	startsAt: string;
	endsAt: string;
	serviceIds: string[];
};

export type Incident = {
	id: number;
	title: string;
	description: string;
	type: IncidentType;
	status: "opgelost" | "actief" | "gepland" | "afgerond";
	startDate: string;
	endDate?: string;
  detection?: "Automatisch" | "Handmatig";
};

export type IncidentType = "storing" | "onderhoud" | "verstoring";

export type IncidentStatus = 'ongoing' | 'planned' | 'resolved';

export type SubscribePayload = {
	email: string;
	incidentId: number | null;
	groupIds: string[] | null;
};