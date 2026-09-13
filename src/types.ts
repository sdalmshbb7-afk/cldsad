export type SubStat = { key: string; label: string };
export type Category = { key: string; label: string; subs: SubStat[] };
export type PositionType = "GK" | "OUT";

export type Position = {
  id: string;
  label: string;
  type: PositionType;
  categories: Category[];
  weights: Record<string, number>;
};

export type UserRole = "president" | "player";

export type AuthUser = {
  name: string;
  email: string;
  club: string;
  region: string;
  role: UserRole;
  isFreeAgent: boolean;
  joinStatus?: "approved" | "pending";
  wallet: number;
  clubLogo?: string;
  clubColors?: { primary: string; secondary: string };
};

export type TabId = "chat" | "calculator" | "tournaments" | "market";

export type Tab = { id: TabId; label: string };

export type TeamStanding = {
  name: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gd: number;
  pts: number;
};

export type Match = {
  home: string;
  away: string;
  score?: string;
  date: string;
  time: string;
  status: string;
};

export type TournamentData = {
  teams: TeamStanding[];
  matches: Match[];
};

export type DirectoryEntry = {
  type: "club" | "player";
  name: string;
  region: string;
};

export type CapProfile = {
  base: Record<string, number>;
  growth: Record<string, number>;
};

export type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  time: string;
};
