const TAU = Math.PI * 2;
function point(a: number, r: number) {
  return [250 + Math.sin(a) * r, 250 - Math.cos(a) * r];
}
export function Celestial() {
  return (
    <div className="celestial" aria-hidden="true">
      <svg
        viewBox="0 0 1200 380"
        preserveAspectRatio="xMidYMid slice"
        className="star-map"
      >
        <g fill="none" stroke="#ae9367" strokeWidth=".65" opacity=".22">
          <path
            d="M-90 313Q423 61 1180 154M40 394Q743 -4 1260 73"
            strokeDasharray="2 7"
          />
          <ellipse
            cx="600"
            cy="191"
            rx="526"
            ry="122"
            transform="rotate(-9 600 191)"
            strokeDasharray="1 6"
          />
        </g>
        <g fill="#cbb287">
          {Array.from({ length: 150 }, (_, i) => {
            const x = (i * 7919) % 1193,
              y = (i * i * 337 + 71 * i) % 367;
            return i % 13 === 0 ? (
              <path
                key={i}
                opacity=".75"
                d={`M${x} ${y - 4}q0 4 4 4-4 0-4 4 0-4-4-4 4 0 4-4`}
              />
            ) : (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 4 === 0 ? 1.2 : 0.65}
                opacity={0.25 + (i % 5) / 10}
              />
            );
          })}
        </g>
        {[
          "73,167 105,135 148,150 174,123 192,138",
          "938,280 975,247 1010,257 1037,218 1080,236 1105,213",
          "146,310 183,299 211,318",
          "1012,99 1042,79 1068,101 1084,92",
        ].map((p) => (
          <g key={p} stroke="#ac915d" opacity=".47">
            <polyline points={p} fill="none" strokeWidth=".7" />
            {p.split(" ").map((k) => (
              <circle
                key={k}
                cx={k.split(",")[0]}
                cy={k.split(",")[1]}
                r="1.8"
                fill="#b89d6a"
              />
            ))}
          </g>
        ))}
      </svg>
      <svg
        viewBox="0 0 500 500"
        className="astrolabe"
        fill="none"
        stroke="currentColor"
      >
        <defs>
          <path id="arc-top" d="M68 250a182 182 0 1 1 364 0" />
          <path id="arc-bottom" d="M64 250a186 186 0 0 0 372 0" />
        </defs>
        {[226, 218, 213, 191, 174, 168, 110, 105, 75, 54, 49].map((r, i) => (
          <circle
            key={r}
            cx="250"
            cy="250"
            r={r}
            opacity={i === 7 ? 0.6 : 0.4}
            strokeWidth={i % 3 === 0 ? 1.1 : 0.65}
            strokeDasharray={r === 226 ? "2 6" : r === 110 ? "4 4" : undefined}
          />
        ))}
        {Array.from({ length: 120 }, (_, i) => (
          <path
            key={i}
            d={`M${point((i * TAU) / 120, 213)}L${point((i * TAU) / 120, i % 10 === 0 ? 194 : i % 5 === 0 ? 200 : 207)}`}
            opacity={i % 5 === 0 ? 0.7 : 0.4}
            strokeWidth=".9"
          />
        ))}
        <g opacity=".34">
          <path d="M250 59 415 345H85ZM250 441 85 155h330Z" />
          <path
            d="M250 32v436M32 250h436m-372-154 308 308M96 404 404 96"
            strokeDasharray="3 6"
          />
          <ellipse
            cx="250"
            cy="250"
            rx="207"
            ry="78"
            transform="rotate(-31 250 250)"
          />
          <ellipse
            cx="250"
            cy="250"
            rx="207"
            ry="78"
            transform="rotate(31 250 250)"
          />
        </g>
        <g
          fill="currentColor"
          stroke="none"
          opacity=".72"
          fontFamily="Georgia,serif"
          fontSize="8.8"
          letterSpacing="4"
        >
          <text>
            <textPath href="#arc-top" startOffset="50%" textAnchor="middle">
              AER · IGNIS · TERRA · AQUA
            </textPath>
          </text>
          <text>
            <textPath href="#arc-bottom" startOffset="50%" textAnchor="middle">
              SOLVE ET COAGULA
            </textPath>
          </text>
        </g>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={i} transform={`rotate(${45 * i} 250 250)`}>
            <path d="m250 23 3 7-3 7-3-7z" fill="currentColor" />
            <circle cx="250" cy="81" r="3" fill="#1b211e" />
          </g>
        ))}
        <g className="solar-face" strokeWidth="1.1">
          {Array.from({ length: 24 }, (_, i) => (
            <path
              key={i}
              transform={`rotate(${i * 15} 250 250)`}
              d={
                i % 2 === 0
                  ? "M246 218Q244 205 250 190q-1 18 4 28Z"
                  : "M246 219l4-23 4 23Z"
              }
              fill={i % 2 ? "#8a7047" : "none"}
            />
          ))}
          <circle cx="250" cy="250" r="33" fill="#25271e" />
          <circle cx="250" cy="250" r="30" />
          <path d="M225 244q8-7 17 0m16 0q8-7 17 0M226 248q7-6 15 0-8 5-15 0Zm33 0q7-6 15 0-8 5-15 0Zm-13-2q2 6-1 13 3 3 8 0m-14 8q10-5 20 0-10 7-20 0Zm5 7q5 2 10-1" />
          <circle cx="234" cy="247" r="1.7" fill="currentColor" />
          <circle cx="266" cy="247" r="1.7" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}
