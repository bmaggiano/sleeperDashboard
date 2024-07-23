export interface Player {
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    position: string | null;
    team: string | null;
}

export interface Team {
    user: {
        display_name: string | null;
    };
    starters: string[] | null;
    starters_points: number[] | null;
}

export interface PlayerMatchupCardsProps {
    teamOne: Team;
    teamTwo: Team;
}

export interface UserRecordDrawerProps {
    teamOne: Team | null;
    teamTwo: Team | null;
}

export interface Matchup {
    round: number;
    roster_id: string;
    matchup_id: string;
    starters: string[] | null;
    points: number;
    user?: {
        avatar: string;
        display_name: string;
        metadata: {
            team_name: string;
        },
    }
}