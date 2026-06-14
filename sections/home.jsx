import draw from "../data/draw.json";
import { countryCode } from "../utils/flags";

// Strong normalize to match flags across the app
const normalize = (name = "") =>
  name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/ç/g, "c");

export default function Home() {
  return (
    <div className="space-y-8 px-4 pb-8">
      {/* Prize Pool */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            💰 Prize Pool
          </h2>
          <span className="text-emerald-500 font-bold text-3xl">€40</span>
        </div>
        
        <div className="flex gap-8 text-sm">
          <div>
            <span className="text-emerald-400">🥇 Winner</span>
            <p className="text-white font-semibold">€35</p>
          </div>
          <div>
            <span className="text-emerald-400">🥈 Runner-up</span>
            <p className="text-white font-semibold">€5</p>
          </div>
        </div>
      </div>

      {/* The Draw */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          👥 The Draw
        </h2>

        <div className="space-y-8">
          {draw.people.map((person) => (
            <div key={person.name} className="border-b border-zinc-800 pb-8 last:border-b-0 last:pb-0">
              {/* Person Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-zinc-800 rounded-2xl flex items-center justify-center text-lg">
                  👤
                </div>
                <h3 className="text-lg font-semibold text-white">{person.name}</h3>
              </div>

              {/* Flags Row */}
              <div className="flex flex-wrap gap-2">
                {person.teams.map((team) => {
                  const code = countryCode[normalize(team)];

                  return (
                    <div
                      key={team}
                      className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-2xl px-4 py-2.5 flex items-center gap-3 min-w-0"
                    >
                      {code && (
                        <img
                          src={`https://flagcdn.com/w40/${code}.png`}
                          alt={team}
                          className="w-7 h-5 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <span className="text-sm text-gray-200 truncate">{team}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}