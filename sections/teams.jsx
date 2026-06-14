import draw from "../data/draw.json";
import { countryCode } from "../utils/flags";

function normalize(team) {
  return team.toLowerCase().replace(/\s/g, "");
}

function getFlag(team) {
  const key = normalize(team);
  const code = countryCode[key];
  return code ? `https://flagcdn.com/w20/${code}.png` : "";
}

export default function Teams() {
  return (
    <div className="p-4 space-y-4">

      <h1 className="text-lg font-bold">Teams</h1>

      {draw.people.map((person) => (
        <div
          key={person.name}
          className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
        >

          {/* PERSON HEADER */}
          <h2 className="font-semibold text-sm text-gray-800">
            {person.name}
          </h2>

          {/* TEAMS LIST */}
          <div className="space-y-2">

            {person.teams.map((team) => (
              <div
                key={team}
                className="flex items-center justify-between text-sm"
              >

                {/* LEFT: TEAM NAME */}
                <span className="text-gray-700">
                  {team}
                </span>

                {/* RIGHT: FLAG */}
                <img
                  src={getFlag(team)}
                  className="w-4 h-3 rounded-sm"
                />

              </div>
            ))}

          </div>
        </div>
      ))}
    </div>
  );
}