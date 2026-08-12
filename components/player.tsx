"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { playlists } from "@/lib/tracks";
import type { Playlist, Track } from "@/lib/tracks";

declare global {
  interface Window {
    YT?: {
      Player: new (
        host: HTMLElement | string,
        options: {
          videoId?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: () => void;
            onStateChange?: (e: { data: number }) => void;
            onError?: (e: { data: number }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };

let apiPromise: Promise<boolean> | null = null;

function loadYouTubeApi(): Promise<boolean> {
  if (window.YT?.Player) return Promise.resolve(true);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(true);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}
function fmtTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function trackThumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

function Thumb({
  videoId,
  sizeClass,
}: {
  videoId: string;
  sizeClass: string;
}) {
  if (!videoId) return null;
  return (
    <div
      className={`${sizeClass} shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)]`}
    >
      {}
      <img
        src={trackThumb(videoId)}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

function TrackInfo({ track }: { track: Track }) {
  return (
    <div className="min-w-0 flex-1">
      <div
        className="truncate text-[15px] font-semibold leading-snug text-cream"
        title={`${track.title} — ${track.artist}`}
      >
        {track.title}
      </div>
      <div className="truncate text-[12.5px] leading-snug text-white/70">{track.artist}</div>
      {(track.film || track.year) && (
        <div className="mt-0.5 truncate text-[10px] uppercase tracking-[0.14em] text-white/35">
          {[track.film, track.year].filter(Boolean).join(" · ")}
        </div>
      )}
      {!track.videoId && (
        <div className="mt-0.5 truncate text-[10px] text-amber-300/75">
          add a videoId — paste the YouTube id into lib/tracks.ts
        </div>
      )}
    </div>
  );
}

function SeekBar({
  value,
  total,
  onSeek,
}: {
  value: number;
  total: number;
  onSeek: (seconds: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const seekFromClientX = (clientX: number) => {
    const el = railRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || total <= 0) return;
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(frac * total);
  };

  const percent = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  const step = total > 0 ? Math.max(5, total / 20) : 5;

  return (
    <div
      ref={railRef}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(total)}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      className="group relative flex h-6 w-full cursor-pointer touch-none select-none items-center"
      onPointerDown={(e) => {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        e.preventDefault();
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) seekFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
      onPointerCancel={(e) => {
        draggingRef.current = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onSeek(Math.min(total, value + step));
        else if (e.key === "ArrowLeft") onSeek(Math.max(0, value - step));
      }}
    >
      <div className="absolute inset-x-0 h-[3px] rounded-full bg-white/15" />
      <div
        className="absolute left-0 h-[3px] rounded-full bg-gradient-to-r from-accent to-accent-deep shadow-[0_0_10px_rgba(245,158,11,0.55)]"
        style={{ width: `${percent}%` }}
      />
      <div
        className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-cream opacity-0 shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-opacity group-hover:opacity-100"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

function Elapsed({ current, total }: { current: number; total: number }) {
  return (
    <span className="text-[10.5px] tabular-nums text-white/60">
      {fmtTime(current)}
      <span className="mx-1 text-white/25">/</span>
      {total > 0 ? fmtTime(total) : "–:––"}
    </span>
  );
}

function SkipButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous track" : "Next track"}
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-cream active:scale-95 disabled:pointer-events-none disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        {direction === "prev" ? (
          <path d="M6 5.5h2.5v13H6zM10 6.2v11.6L21 12L10 6.2z" />
        ) : (
          <path d="M15.5 5.5H18v13h-2.5zM14 6.2v11.6L3 12l11-5.8z" />
        )}
      </svg>
    </button>
  );
}

function PlayPauseButton({
  playing,
  onClick,
  disabled,
}: {
  playing: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={playing ? "Pause" : "Play"}
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-deep text-[#241200] ring-1 ring-white/25 shadow-[0_10px_28px_-8px_rgba(249,115,22,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden>
        {playing ? (
          <path d="M7 4.5h3.6v15H7zM13.4 4.5H17v15h-3.6z" />
        ) : (
          <path d="M7.2 4.2v15.6L19.6 12L7.2 4.2z" />
        )}
      </svg>
    </button>
  );
}
function TrackList({
  playlists,
  playlistIndex,
  trackIndex,
  playing,
  onSelect,
}: {
  playlists: Playlist[];
  playlistIndex: number;
  trackIndex: number;
  playing: boolean;
  onSelect: (playlistIndex: number, trackIndex: number) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-black/25 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">
          playlist
        </span>
        <span className="text-[10px] tabular-nums text-white/30">
          {playlists.reduce((n, pl) => n + pl.tracks.filter((t) => t.videoId).length, 0)} songs
        </span>
      </div>
      <ul className="flex max-h-[52vh] flex-col gap-2 overflow-y-auto p-2">
        {playlists.map((pl, pi) => (
          <li key={pl.id}>
            <span className="mb-1 block px-3 pt-1 text-[10px] uppercase tracking-[0.24em] text-white/30">
              {pl.name}
            </span>
            <ul className="flex flex-col gap-0.5">
              {pl.tracks.map((t, ti) => {
                const active = pi === playlistIndex && ti === trackIndex;
                const clickable = Boolean(t.videoId);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => onSelect(pi, ti)}
                      aria-current={active ? "true" : undefined}
                      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition ${
                        active
                          ? "bg-accent/15 ring-1 ring-accent/40"
                          : clickable
                            ? "hover:bg-white/[0.07]"
                            : "cursor-not-allowed opacity-40"
                      }`}
                    >
                      <span
                        className={`w-6 shrink-0 text-center text-[10.5px] tabular-nums ${
                          active ? "text-amber-300" : "text-white/30"
                        }`}
                      >
                        {active && playing ? (
                          <span className="inline-flex h-3 items-end gap-[2px]" aria-hidden>
                            <span className="eq-bar w-[3px] rounded-full bg-amber-400" />
                            <span className="eq-bar w-[3px] rounded-full bg-amber-400 [animation-delay:0.22s]" />
                            <span className="eq-bar w-[3px] rounded-full bg-amber-400 [animation-delay:0.44s]" />
                          </span>
                        ) : (
                          String(ti + 1).padStart(2, "0")
                        )}
                      </span>
                      <Thumb videoId={t.videoId} sizeClass="h-10 w-10" />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[13px] font-medium leading-snug ${
                            active ? "text-amber-200" : "text-cream"
                          }`}
                        >
                          {t.title}
                        </span>
                        <span className="block truncate text-[11px] leading-snug text-white/50">
                          {t.artist}
                        </span>
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 shrink-0 transition ${
                          active
                            ? "text-amber-300 opacity-100"
                            : "text-white/25 opacity-0 group-hover:opacity-100"
                        }`}
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M8 5.5v13l11-6.5L8 5.5z" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default function Player() {
  const apiHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  const playRef = useRef({ pi: 0, ti: 0 });
  const pendingPlayRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const isPlayingRef = useRef(false);

  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack =
    playlists[playlistIndex].tracks[trackIndex] ?? playlists[0].tracks[0];
  const wired = Boolean(currentTrack?.videoId);

  /* -- imperative engine refs so API callbacks always see fresh state -- */

  const loadTrack = useCallback((pi: number, ti: number, autoplay: boolean) => {
    const t = playlists[pi]?.tracks[ti];
    playRef.current = { pi, ti };
    pendingPlayRef.current = autoplay;
    setPlaylistIndex(pi);
    setTrackIndex(ti);
    setProgress(0);
    setDuration(0);
    const p = playerRef.current;
    if (!p || !t?.videoId) return;
    p.loadVideoById(t.videoId);
    if (autoplay) {
      p.playVideo();
      pendingPlayRef.current = false;
    }
  }, []);

    useEffect(() => {
    let mounted = true;
    loadYouTubeApi().then(() => {
      if (!mounted || !apiHostRef.current || !window.YT?.Player) return;
      const initial = playlists[0].tracks[0];
      const p = new window.YT.Player(apiHostRef.current, {
        videoId: initial?.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            playerRef.current = p;
            loadTrack(playRef.current.pi, playRef.current.ti, false);
          },
          onStateChange: (e) => {
            if (e.data === YT_STATE.PLAYING) {
              pendingPlayRef.current = false;
              wasPlayingRef.current = true;
              isPlayingRef.current = true;
              setIsPlaying(true);
            } else if (e.data === YT_STATE.PAUSED) {
              isPlayingRef.current = false;
              setIsPlaying(false);
            } else if (e.data === YT_STATE.ENDED) {
              isPlayingRef.current = false;
              setIsPlaying(false);
              const { pi, ti } = playRef.current;
              const list = playlists[pi].tracks;
              if (list.length > 1) {
                loadTrack(pi, (ti + 1) % list.length, true);
              }
            }
          },
          onError: () => {
            const { pi, ti } = playRef.current;
            const bad = playlists[pi]?.tracks[ti];
            try {
              track("audio_error", { id: bad?.videoId ?? "", code: -1 });
            } catch {
              /* analytics not wired */
            }
            const list = playlists[pi].tracks;
            if (list.length > 1) {
              loadTrack(pi, (ti + 1) % list.length, true);
            }
          },
        },
      });
    });
    return () => {
      mounted = false;
    };
  }, [loadTrack]);

 

  useEffect(() => {
    const timer = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const t = p.getCurrentTime();
        if (Number.isFinite(t) && t > 0) setProgress(t);
        const d = p.getDuration();
        if (Number.isFinite(d) && d > 0) setDuration(d);
      } catch {
        /* player not ready */
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  const seekToSeconds = useCallback((seconds: number) => {
    const p = playerRef.current;
    if (!p) return;
    const total = duration > 0 ? duration : 0;
    if (total <= 0) return;
    const clamped = Math.min(Math.max(seconds, 0), total - 0.05);
    try {
      p.seekTo(clamped, true);
      setProgress(clamped);
    } catch {
      
    }
  }, [duration]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    const t = playlists[playRef.current.pi]?.tracks[playRef.current.ti];
    if (!p || !t?.videoId) return;
    try {
      if (isPlayingRef.current) {
        p.pauseVideo();
      } else {
        pendingPlayRef.current = true;
        p.playVideo();
        pendingPlayRef.current = false;
      }
    } catch {
     
    }
  }, []);

  const goRelative = useCallback(
    (delta: number) => {
      const { pi, ti } = playRef.current;
      const list = playlists[pi].tracks;
      if (list.length === 0) return;
      loadTrack(pi, (ti + delta + list.length) % list.length, wasPlayingRef.current);
    },
    [loadTrack]
  );

  const selectTrack = useCallback(
    (pi: number, ti: number) => {
      loadTrack(pi, ti, true);
    },
    [loadTrack]
  );

 
  const trackList = (
    <TrackList
      playlists={playlists}
      playlistIndex={playlistIndex}
      trackIndex={trackIndex}
      playing={isPlaying}
      onSelect={(pi, ti) => selectTrack(pi, ti)}
    />
  );

  return (
    <div className="w-full max-w-xl">
      {}
      <div className="fixed right-5 top-1/2 z-20 hidden w-72 -translate-y-1/2 shrink-0 lg:block">
        {trackList}
      </div>

      {}
      <div
        ref={apiHostRef}
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 h-[200px] w-[360px] -translate-y-[200%] overflow-hidden opacity-0"
      />

      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.28em] text-white/35">
          now on air
        </span>
      </div>

      {}
      <div className="hidden items-center gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 pr-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl sm:flex">
        <Thumb videoId={currentTrack.videoId} sizeClass="h-28 w-28" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <TrackInfo track={currentTrack} />

          <div className="flex w-full flex-col gap-0.5">
            <SeekBar value={progress} total={duration} onSeek={seekToSeconds} />
            <div className="flex items-center justify-between">
              <Elapsed current={progress} total={duration} />
              <div className="flex items-center gap-1">
                <SkipButton direction="prev" onClick={() => goRelative(-1)} disabled={!wired} />
                <PlayPauseButton playing={isPlaying} onClick={togglePlay} disabled={!wired} />
                <SkipButton direction="next" onClick={() => goRelative(1)} disabled={!wired} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl sm:hidden">
        <div className="flex items-center gap-3.5">
          <Thumb videoId={currentTrack.videoId} sizeClass="h-20 w-20" />
          <TrackInfo track={currentTrack} />
        </div>

        <div className="mt-3">
          <SeekBar value={progress} total={duration} onSeek={seekToSeconds} />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <Elapsed current={progress} total={duration} />
          <div className="flex items-center gap-1.5">
            <SkipButton direction="prev" onClick={() => goRelative(-1)} disabled={!wired} />
            <PlayPauseButton playing={isPlaying} onClick={togglePlay} disabled={!wired} />
            <SkipButton direction="next" onClick={() => goRelative(1)} disabled={!wired} />
          </div>
        </div>
      </div>

      {}
      <div className="mt-3 lg:hidden">{trackList}</div>
    </div>
  );
}
