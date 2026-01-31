
export type Status = 'NDB' | 'NT' | 'ABS' | 'P';

export interface Member {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  lgaId: string;
  leaderId: string;
}

export interface LGA {
  id: string;
  name: string;
}

export interface MemberStatus {
  memberId: string;
  status: Status;
}

export interface WeeklyReport {
  id: string;
  teamId: string;
  lgaId: string;
  week: number;
  month: string;
  year: number;
  traineesTrained: number;
  memberStatuses: MemberStatus[];
  submittedAt: string;
  submittedBy: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TEAM_LEADER = 'TEAM_LEADER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  teamId?: string; // Only for team leaders
  lgaId?: string; // Context for leaders
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const STATUS_OPTIONS: Status[] = ['NDB', 'NT', 'ABS', 'P'];
