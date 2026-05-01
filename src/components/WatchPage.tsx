import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  ExternalLink,
  ChevronRight,
  Settings,
} from "lucide-react";
import Hls from "hls.js";
import StarRating from "./StarRating";
import {
  detectVideoType,
  toEmbedUrl,
  type VideoType,
} from "../data/dramas";
import type { Drama, CastMember } from "../data/dramas";

interface Props {
  drama: Drama;
  cast: CastMember[];
  startEpisode: number;
  onBack: () => void;
  onCastClick: (id: number) => void;
  onNavigate: (page: "drama", id: number) => void;
}

function SourceBadge({ type }: { type: VideoType }) {
  const labels: Record<VideoType, { text: string; cls: string }> = {
    direct: { text: "Direct Video", cls: "bg-blue-900/60 text-blue-300 border-blue-500/30" },
    hls: { text: "HLS Stream", cls: "bg-orange-900/60 text-orange-300 border-orange-500/30" },
    youtube: { text: "YouTube", cls: "bg-red-900/60 text-red-300 border-red-500/30" },
    vimeo: { text: "Vimeo", cls: "bg-cyan-900/60 text-cyan-300 border-cyan-500/30" },
    rumble: { text: "Rumble", cls: "bg-green-900/60 text-green-300 border-green-500/30" },
    embed: { text: "Embed", cls: "bg-purple-900/60 text-purple-300 border-purple-500/30" },
  };
  const l = labels[type];
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border rounded-sm ${l.cls}`}>
      {l.text}
    </span>
  );
}

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function WatchPage({
  drama,
  cast,
  startEpisode,
  onBack,
  onCastClick,
  onNavigate,
}: Props) {
  const [currentEp, setCurrentEp] = useState(startEpisode);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const allEps = drama.videoEpisodes;
  const episode = allEps.find((e) => e.number === currentEp);

  const videoType = episode ? detectVideoType(episode.videoUrl) : "direct";
  const embedUrl = episode ? toEmbedUrl(episode.videoUrl) : "";

  const isNativeVideo = videoType === "direct" || videoType === "hls";

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  // Initialize HLS if needed
  useEffect(() => {
    if (!episode) return;
    if (videoType !== "hls") return;
    const video = videoElRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(episode.videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        }
      });
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = episode.videoUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [episode, videoType]);

  // Track video time
  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (!seeking) setCurrentTime(video.currentTime);
    };
    const onDurationChange = () => setDuration(video.duration);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("progress", onProgress);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [seeking, currentEp]);

  // Reset on episode change
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
  }, [currentEp]);

  const togglePlay = () => {
    const v = videoElRef.current;
    if (!v) return;
    if (playing) v.pause();
    else v.play().catch(() => {});
  };

  const toggleMute = () => {
    const v = videoElRef.current;
    if (v) v.muted = !muted;
    setMuted(!muted);
  };

  const goFullscreen = () => {
    videoElRef.current?.requestFullscreen?.().catch(() => {});
  };

  const prevEp = () => {
    const idx = allEps.findIndex((e) => e.number === currentEp);
    if (idx > 0) setCurrentEp(allEps[idx - 1].number);
  };

  const nextEp = () => {
    const idx = allEps.findIndex((e) => e.number === currentEp);
    if (idx < allEps.length - 1) setCurrentEp(allEps[idx + 1].number);
  };

  const selectEp = (num: number) => {
    setCurrentEp(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Seek on click
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const video = videoElRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    video.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  }, [duration]);

  const handleSeekStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setSeeking(true);
    handleSeek(e);
  }, [handleSeek]);

  const handleSeekMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!seeking) return;
    handleSeek(e);
  }, [seeking, handleSeek]);

  const handleSeekEnd = useCallback(() => {
    setSeeking(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-3 w-px bg-gray-700" />
          <span className="text-white text-sm font-medium truncate">{drama.title}</span>
          {episode && (
            <>
              <span className="text-[#D4AF37] text-xs shrink-0 hidden sm:inline">Season {episode.season || 1} : Episode {episode.number}</span>
              <SourceBadge type={videoType} />
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* ─── LEFT: Player + Info ─── */}
          <div className="space-y-6">
            {/* Video Player */}
            <div className="relative bg-black rounded-md overflow-hidden aspect-video select-none">
              {episode && isNativeVideo ? (
                <div className="relative w-full h-full group">
                  <video
                    ref={videoElRef}
                    key={videoType === "hls" ? "hls" : embedUrl}
                    src={videoType === "direct" ? embedUrl : undefined}
                    className="w-full h-full object-contain"
                    controls={false}
                    playsInline
                    onClick={togglePlay}
                  />

                  {/* Play overlay */}
                  {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay}>
                      <div className="w-16 h-16 rounded-full bg-[#C41E3A]/90 flex items-center justify-center shadow-lg shadow-[#C41E3A]/30 hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 transition-opacity duration-200 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
                    {/* Progress bar */}
                    <div
                      ref={progressRef}
                      className="w-full h-1.5 hover:h-2.5 cursor-pointer rounded-full mb-3 bg-gray-700/50 relative transition-all group/bar"
                      onMouseDown={handleSeekStart}
                      onMouseMove={handleSeekMove}
                      onMouseUp={handleSeekEnd}
                      onMouseLeave={handleSeekEnd}
                    >
                      {/* Buffered */}
                      <div
                        className="absolute top-0 left-0 h-full bg-gray-500/50 rounded-full pointer-events-none"
                        style={{ width: `${bufferedPercent}%` }}
                      />
                      {/* Progress */}
                      <div
                        className="absolute top-0 left-0 h-full bg-[#C41E3A] rounded-full pointer-events-none"
                        style={{ width: `${progress}%` }}
                      />
                      {/* Dot */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#C41E3A] rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none"
                        style={{ left: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={prevEp} className="text-white hover:text-[#D4AF37] transition-colors cursor-pointer"><SkipBack className="w-4 h-4" /></button>
                        <button onClick={togglePlay} className="text-white hover:text-[#D4AF37] transition-colors cursor-pointer">
                          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button onClick={nextEp} className="text-white hover:text-[#D4AF37] transition-colors cursor-pointer"><SkipForward className="w-4 h-4" /></button>
                        <button onClick={toggleMute} className="text-white hover:text-[#D4AF37] transition-colors cursor-pointer">
                          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <span className="text-gray-300 text-xs ml-1">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-white transition-colors cursor-pointer"><Settings className="w-4 h-4" /></button>
                        <button onClick={goFullscreen} className="text-gray-400 hover:text-white transition-colors cursor-pointer"><Maximize className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : episode && !isNativeVideo ? (
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="no-referrer"
                  title={`${drama.title} - Episode ${episode.number}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Episode not available</p>
                </div>
              )}
            </div>

            {/* Now playing info */}
            {episode && (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-white text-lg font-semibold">Season {episode.season || 1} : Episode {episode.number}</h2>
                  <p className="text-gray-500 text-sm mt-1">{drama.title} · {episode.duration}</p>
                </div>
                {!isNativeVideo && (
                  <a href={episode.videoUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-1.5 text-[#D4AF37] text-xs hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open source
                  </a>
                )}
              </div>
            )}

            {/* Drama info */}
            <div className="border-t border-white/5 pt-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <button onClick={() => onNavigate("drama", drama.id)} className="shrink-0 w-24 h-36 rounded overflow-hidden border border-white/5 cursor-pointer">
                  {drama.image && drama.image.trim() !== "" ? (
                    <img src={drama.image} alt={drama.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${drama.color} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                </button>
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#C41E3A] text-white rounded-sm">{drama.type}</span>
                    <h3 className="text-white font-bold mt-1.5 cursor-pointer hover:text-[#D4AF37] transition-colors" onClick={() => onNavigate("drama", drama.id)}>{drama.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={drama.rating} size="sm" />
                    <span className="text-[#D4AF37] text-sm font-bold">{drama.rating}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{drama.country}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{drama.year}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{drama.synopsis}</p>
                  {cast.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cast.map((c) => (
                        <button key={c.id} onClick={() => onCastClick(c.id)} className="px-2.5 py-1 text-xs text-gray-400 bg-white/5 border border-white/5 rounded-sm hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-colors cursor-pointer">
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Episode list ─── */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
            <h3 className="text-[#D4AF37] text-[11px] font-bold tracking-[0.15em] uppercase mb-4">Episodes</h3>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {allEps.map((ep) => {
                const active = ep.number === currentEp;
                const epType = detectVideoType(ep.videoUrl);
                return (
                  <button
                    key={ep.number}
                    onClick={() => selectEp(ep.number)}
                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all cursor-pointer ${
                      active ? "bg-[#C41E3A]/15 border border-[#C41E3A]/30" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05] hover:border-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-bold ${active ? "bg-[#C41E3A] text-white" : "bg-white/5 text-gray-500"}`}>
                      {active ? <Play className="w-3 h-3" fill="white" /> : ep.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${active ? "text-white" : "text-gray-300"}`}>Season {ep.season || 1} : Episode {ep.number}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-600 text-[11px]">{ep.duration}</span>
                        <SourceBadge type={epType} />
                      </div>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-[#C41E3A] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
