import { useEffect, useState } from "react";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(ESPN_URL);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to load ESPN:", err);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-4 p-4">

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold text-lg">Live Fixtures</h2>
        <p className="text-xs text-gray-500">
          ESPN feed connected
        </p>
      </div>

      {/* FIXTURES */}
      <div className="space-y-3">

        {events.slice(0, 8).map((event) => {
          const comp = event.competitions?.[0];
          const home = comp?.competitors?.find(c => c.homeAway === "home");
          const away = comp?.competitors?.find(c => c.homeAway === "away");

          const homeName = home?.team?.displayName;
          const awayName = away?.team?.displayName;

          const homeScore = home?.score ?? 0;
          const awayScore = away?.score ?? 0;

          const status = event.status?.type?.description;

          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{status}</span>
              </div>

              <div className="flex items-center justify-between">

                <div className="text-sm w-1/3">
                  {awayName}
                </div>

                <div className="font-bold">
                  {awayScore} - {homeScore}
                </div>

                <div className="text-sm w-1/3 text-right">
                  {homeName}
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}