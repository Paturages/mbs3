export interface Me {
  avatar: string;
  username: string;
  id: string;
  player?: Player;
  referee?: Referee;
  commentator?: Commentator;
  streamer?: Streamer;
  qualifier?: QualifierLobby;
}

export interface Player {
  id: string;
  seed?: number;
  elite?: boolean;
  username: string;
  discord: string;
  country: string;
  country_code: string;
  avatar: string;
  timezone: string;
  ranking: number;
  pp: number;
  qualifier: QualifierLobby;
  group?: Group;
}

export interface Group {
  id: string;
}

export interface Referee {
  id: string;
  username: string;
  discord: string;
  country: string;
  country_code: string;
  avatar: string;
  timezone: string;
}

export interface Commentator {
  id: string;
  username: string;
  discord: string;
  country: string;
  country_code: string;
  avatar: string;
  timezone: string;
}

export interface Streamer {
  id: string;
  username: string;
  discord: string;
  country: string;
  country_code: string;
  avatar: string;
  timezone: string;
}

export interface Stage {
  slug: string;
  name: string;
  date_start: string;
  date_end: string;
  link?: string;
  best_of?: number;
}

export interface QualifierLobby {
  name: string;
  link: string | null;
  time: string;
  players: Player[];
  referee: Referee | null;
  available_referees: {
    rel_id: number;
    referee: Referee;
  }[];
}

export interface Match {
  id: number;
  points1?: number;
  points2?: number;
  time: string;
  link: string | null;
  players: {
    player: Player;
  }[];
  referee: Referee | null;
  streamer: Streamer | null;
  commentators: {
    commentator: Commentator;
  }[];
  rolls: Roll[];
  protects: Protect[];
  bans: Ban[];
  picks: Pick[];
  scores: Score[];
  wbd?: Player;
  
  available_referees?: {
    rel_id: number;
    referee: Referee;
  }[];
  available_streamers?: {
    rel_id: number;
    streamer: Streamer;
  }[];
  available_commentators?: {
    rel_id: number;
    commentator: Commentator;
  }[];
}

export interface Roll {
  id: number;
  player: Player;
  value: number;
}

export interface Protect {
  id: number;
  player: Player;
  map: Map;
}

export interface Ban {
  id: number;
  player: Player;
  map: Map;
}

export interface Pick {
  id: number;
  player: Player;
  map: Map;
}

export interface Score {
  position?: number;
  map: Map;
  player: Player;
  score: number;
  combo: number;
  c320: number;
  c300: number;
  c200: number;
  c100: number;
  c50: number;
  c0: number;
}

export interface Map {
  id: string;
  artist: string;
  name: string;
  weight: number;
  difficulty: string;
  charter: string;
  charter_id: string;
  category: string;
  bpm: number;
  length: string;
  od: number;
  hp: number;
  sr: number;
  rice: number;
  ln: number;
  cover: string;
}
