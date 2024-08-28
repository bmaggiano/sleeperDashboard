export function calculateFantasyPoints(stats: {
    totalRecYards: number;
    totalRushYards: number;
    totalTds: number;
    totalReceptions: number;
    totalPassYards: number;
    totalPassTds: number;
    totalInterceptions: number;
}): number {
    const recYardsPoints = stats.totalRecYards * 0.1;
    const rushYardsPoints = stats.totalRushYards * 0.1;
    const touchdownsPoints = stats.totalTds * 6;
    const receptionsPoints = stats.totalReceptions * 1;
    const passYardsPoints = (stats.totalPassYards / 25) * 1;
    const passTouchdownsPoints = stats.totalPassTds * 6;
    const interceptionsPoints = stats.totalInterceptions * -2;

    return (
        recYardsPoints +
        rushYardsPoints +
        touchdownsPoints +
        receptionsPoints +
        passYardsPoints +
        passTouchdownsPoints +
        interceptionsPoints
    );
}