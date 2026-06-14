import draw from "../data/draw.json";

/**
 * Normalise team names so ESPN + draw match correctly
 */
function normalize(name = "") {
  return name.trim().toLowerCase();
}

/**
 * Build lookup:
 * team → owner
 */
function buildTeamMap() {
  const map = {};

  draw.people.forEach((person) => {
    person.teams.forEach((team) => {
      map[normalize(team)] = person.name;
    });
  });

  return map;
}

const teamMap = buildTeamMap();

/**
 * Get owner of a team
 */
export function getOwner(team) {
  return teamMap[normalize(team)] || "Unassigned";
}

/**
 * Optional helper: check if a matchup is “owned by same person”
 * (useful later for UI highlighting)
 */
export function isSameOwner(home, away) {
  return getOwner(home) === getOwner(away);
}

/**
 * Format a matchup (pure display helper)
 */
export function formatMatchup(home, away) {
  return {
    homeTeam: home,
    awayTeam: away,
    homeOwner: getOwner(home),
    awayOwner: getOwner(away),
    sameOwner: isSameOwner(home, away),

    label: `${home} (${getOwner(home)}) vs ${away} (${getOwner(away)})`,
  };
}