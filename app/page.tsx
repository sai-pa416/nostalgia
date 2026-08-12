import Player from "@/components/player";
import Clock from "@/components/clock";
import NotesFx from "@/components/notes-fx";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {}
      <div aria-hidden className="hero-bg fixed inset-0 -z-20 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>

      {/* Fixed film grain */}
      <div aria-hidden className="grain fixed inset-0 -z-10 opacity-30 mix-blend-overlay" />

      {/* Floating music notes behind the player */}
      <NotesFx />

      {/* Fixed top row */}
      <Clock />

      {/* Fixed bottom console: playlist tabs + player */}
      <div className="fixed inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Player />
      </div>
    </main>
  );
}
