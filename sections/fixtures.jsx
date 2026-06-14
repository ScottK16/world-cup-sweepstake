import { useEffect, useState } from "react";
import draw from "../data/draw.json";
import { countryCode } from "../utils/flags";

const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

function buildTeamOwners(drawData) {
  const map = {};
  drawData.people.forEach((person) => {
    person.teams.forEach((team) => {
      map[team] = person.name;
    });
  });
  return map;
}

const TEAM_OWNERS = buildTeamOwners(draw);

/* Name handling */
const teamAliases = {
  "Türkiye": "Turkey",
  "Turkiye": "Turkey",
  "Curaçao": "Curacao",
  "Curacao": "Curacao",
  "Korea Republic": "South Korea",
};

const normalize = (name = "") => {
  if (!name) return "";
  let cleaned = teamAliases[name] || name;
  return cleaned
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/ç/g, "c")
    .replace(/é/g, "e")
    .replace(/ü/g, "u");
};

function getFlag(team) {
  const key = normalize(team);
  const code = countryCode[key];
  return code ? `https://flagcdn.com/w40/${code}.png` : "";
}

function getOwner(teamName) {
  if (!teamName) return "—";
  if (TEAM_OWNERS[teamName]) return TEAM_OWNERS[teamName];

  const alias = teamAliases[teamName];
  if (alias && TEAM_OWNERS[alias]) return TEAM_OWNERS[alias];

  const norm = normalize(teamName);
  for (const [key, owner] of Object.entries(TEAM_OWNERS)) {
    if (normalize(key) === norm) return owner;
  }
  return "—";
}

function groupByDay(events) {
  const groups = {};
  events.forEach((event) => {
    const date = new Date(event.date);
    const key = date.toISOString().split("T")[0];

    if (!groups[key]) {
      groups[key] = {
        date,
        label: date.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
        matches: [],
      };
    }
    groups[key].matches.push(event);
  });

  return Object.entries(groups).sort(([, a], [, b]) => a.date - b.date);
}

export default function Fixtures() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(ESPN_URL);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to load ESPN:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading fixtures...</div>;
  if (!events.length) return <div className="text-center py-12 text-gray-500">No fixtures available right now</div>;

  const grouped = groupByDay(events);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 space-y-10">
      {grouped.map(([key, { label, matches }]) => (
        <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Day Header Widget */}
          <div className="px-6 py-5 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">{label}</h2>
            <div className="bg-zinc-700 text-zinc-300 text-sm px-5 py-2 rounded-2xl font-medium">
              {matches.length} Matches
            </div>
          </div>

          {/* Matches */}
          <div className="p-4 space-y-4">
            {matches.map((event) => {
              const comp = event.competitions?.[0];
              const home = comp?.competitors?.find(c => c.homeAway === "home");
              const away = comp?.competitors?.find(c => c.homeAway === "away");

              const homeName = home?.team?.displayName || home?.team?.name || "—";
              const awayName = away?.team?.displayName || away?.team?.name || "—";

              const homeScore = home?.score ?? "–";
              const awayScore = away?.score ?? "–";

              const status = event.status?.type?.description || "Scheduled";
              const isLive = /live|in progress|halftime/i.test(status);

              return (
                <div
                  key={event.id}
                  className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-3xl p-6 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-mono text-lg font-semibold text-white">
                      {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className={`px-4 py-1 rounded-2xl text-sm font-medium ${isLive ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-400"}`}>
                      {status}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex items-center gap-4">
                      <img src={getFlag(homeName)} alt="" className="w-11 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-white text-lg">{homeName}</div>
                        <div className="text-emerald-500 text-sm font-medium">{getOwner(homeName)}</div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="font-mono text-4xl font-bold text-white tabular-nums px-6">
                      {homeScore} - {awayScore}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex items-center gap-4 justify-end text-right">
                      <div>
                        <div className="font-semibold text-white text-lg">{awayName}</div>
                        <div className="text-emerald-500 text-sm font-medium">{getOwner(awayName)}</div>
                      </div>
                      <img src={getFlag(awayName)} alt="" className="w-11 h-8 rounded-lg object-cover" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}