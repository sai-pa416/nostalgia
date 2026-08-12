/* Floating music notes rising from behind the player — decorative only. */

const NOTES = [
  { x: "18%", y: "140px", size: 20, delay: "0s", duration: "9s", drift: "28px", rot: "24deg", opacity: 0.3 },
  { x: "26%", y: "220px", size: 14, delay: "2.2s", duration: "11s", drift: "-22px", rot: "-18deg", opacity: 0.22 },
  { x: "38%", y: "120px", size: 26, delay: "4.1s", duration: "10s", drift: "34px", rot: "30deg", opacity: 0.35 },
  { x: "50%", y: "250px", size: 16, delay: "1.4s", duration: "12s", drift: "-30px", rot: "-26deg", opacity: 0.25 },
  { x: "62%", y: "130px", size: 22, delay: "3s", duration: "9.5s", drift: "26px", rot: "20deg", opacity: 0.3 },
  { x: "74%", y: "230px", size: 15, delay: "5.2s", duration: "10.5s", drift: "-20px", rot: "-22deg", opacity: 0.22 },
  { x: "82%", y: "150px", size: 24, delay: "0.8s", duration: "11.5s", drift: "32px", rot: "28deg", opacity: 0.32 },
  { x: "58%", y: "200px", size: 18, delay: "6.3s", duration: "9.8s", drift: "-26px", rot: "-20deg", opacity: 0.26 },
];

const NOTE_BODY = "M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z";
const NOTE_DOUBLE = "M9 3.5v9.05A4 4 0 1 0 11 16V5.5h6v3.55a4 4 0 1 0 2 3.45V3.5H9z";

export default function NotesFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-24 z-[5] h-0 overflow-visible">
      {NOTES.map((n, i) => (
        <span
          key={i}
          className="note text-amber-300"
          style={
            {
              left: n.x,
              "--note-y": n.y,
              "--note-duration": n.duration,
              "--note-delay": n.delay,
              "--note-drift": n.drift,
              "--note-rot": n.rot,
              "--note-opacity": n.opacity,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: n.size, height: n.size }}
            fill="currentColor"
            className="drop-shadow-[0_0_8px_rgba(245,158,11,0.45)]"
          >
            <path d={i % 3 === 0 ? NOTE_DOUBLE : NOTE_BODY} />
          </svg>
        </span>
      ))}
    </div>
  );
}