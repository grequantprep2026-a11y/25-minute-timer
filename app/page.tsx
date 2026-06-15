"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── BG IMAGE (Unsplash – free to use) ───────────────────────────────────────
// Replace this URL with any image you prefer.
const BG_IMAGE =
  "./nautre.png";

const TOTAL = 25 * 60; // 1500 seconds

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Draws the circular countdown ring using SVG
function Ring({ remaining }: { remaining: number }) {
  const radius = 140;
  const stroke = 4;
  const normalised = radius - stroke;
  const circ = 2 * Math.PI * normalised;
  const progress = remaining / TOTAL;
  const dash = circ * progress;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 300 300"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx="150"
        cy="150"
        r={normalised}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx="150"
        cy="150"
        r={normalised}
        fill="none"
        stroke="#4a7c59"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform="rotate(-90 150 150)"
        style={{ transition: "stroke-dasharray 0.5s linear" }}
      />
      {/* Leaf indicator at top */}
      <text x="150" y="16" textAnchor="middle" fontSize="18">
        🌿
      </text>
    </svg>
  );
}

export default function Page() {
  const [remaining, setRemaining] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2);
    } catch {
      // Silently fail if audio isn't available
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, playChime]);

  // Update browser tab title with countdown
  useEffect(() => {
    if (running) {
      document.title = `⏱ ${formatTime(remaining)} – Focus Timer`;
    } else if (finished) {
      document.title = "✅ Done! – 25 Minute Timer";
    } else {
      document.title = "25 Minute Timer – Free Online Focus Timer";
    }
  }, [remaining, running, finished]);

  const handleStart = () => {
    if (finished) return;
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    setRemaining(TOTAL);
    if (intervalRef.current) clearInterval(intervalRef.current);
    document.title = "25 Minute Timer – Free Online Focus Timer";
  };

  const label = finished
    ? "Well done! 🎉"
    : running
    ? "Stay focused"
    : remaining === TOTAL
    ? "Ready when you are"
    : "Paused";

  const btnLabel = running ? "PAUSE" : finished ? "DONE" : "START";

  return (
    <>
      {/* ── HERO / TIMER ── */}
      <main
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        aria-label="25 minute timer"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${BG_IMAGE}')` }}
          role="img"
          aria-label="Peaceful mountain lake surrounded by pine trees"
        />
        {/* Subtle overlay so text remains readable */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-4">
          {/* Label above ring */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🍃</span>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#2d4a35]">
              FOCUS TIME
            </p>
          </div>

          {/* Ring + time display */}
          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <Ring remaining={remaining} />
            {/* White frosted disc */}
            <div className="absolute w-[248px] h-[248px] rounded-full bg-white/70 backdrop-blur-md shadow-lg flex flex-col items-center justify-center gap-1">
              <time
                dateTime={`PT${Math.floor(remaining / 60)}M${remaining % 60}S`}
                className="text-6xl font-light tracking-tight text-[#1a3322] tabular-nums"
                aria-live="polite"
                aria-label={`${Math.floor(remaining / 60)} minutes and ${remaining % 60} seconds remaining`}
              >
                {formatTime(remaining)}
              </time>
              <p className="text-sm text-[#4a7c59] font-medium">{label}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <button
              onClick={handleStart}
              disabled={finished}
              aria-label={running ? "Pause 25 minute timer" : "Start 25 minute timer"}
              className="w-48 py-3 rounded-full bg-[#3a6645] hover:bg-[#2d5236] active:scale-95 text-white text-sm font-bold tracking-widest shadow-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {btnLabel}
            </button>
            <button
              onClick={handleReset}
              aria-label="Reset timer to 25 minutes"
              className="flex items-center gap-1.5 text-xs text-[#2d4a35] hover:text-[#1a3322] font-medium tracking-wider transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m0 0A8 8 0 1112 4a8 8 0 01-7.418 5H4.582z"
                />
              </svg>
              RESET
            </button>
          </div>
        </div>
      </main>

      {/* ── SEO CONTENT SECTION ── */}
      <section
        className="bg-[#f4f7f4] py-16 px-6"
        aria-label="About the 25-minute timer"
      >
        <div className="max-w-3xl mx-auto prose prose-green prose-sm sm:prose lg:prose-lg">
          <h1 className="text-3xl font-bold text-[#1a3322] mb-4">
            25-Minute Timer — Free Online Countdown for Focus &amp; Productivity
          </h1>
          <p className="text-[#3a5a45]">
            Our free <strong>25-minute timer</strong> is designed for anyone who
            wants to get more done in less time. Whether you are studying for an
            exam, powering through a work sprint, or practising the popular
            Pomodoro Technique, this timer starts immediately with a single
            click — no download, no account, no distractions.
          </p>

          <h2 className="text-xl font-semibold text-[#1a3322] mt-8 mb-3">
            What is the Pomodoro Technique?
          </h2>
          <p className="text-[#3a5a45]">
            The Pomodoro Technique, developed by Francesco Cirillo in the late
            1980s, breaks your work into focused <strong>25-minute intervals</strong>{" "}
            (called "Pomodoros") followed by a short 5-minute break. After four
            Pomodoros, you take a longer 15–30 minute break. Research shows that
            this rhythm reduces mental fatigue, improves concentration, and helps
            you stay accountable to a single task.
          </p>

          <h2 className="text-xl font-semibold text-[#1a3322] mt-8 mb-3">
            How to Use This 25-Minute Timer
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-[#3a5a45]">
            <li>Choose one task you want to focus on for the next 25 minutes.</li>
            <li>Press <strong>START</strong> and begin working immediately.</li>
            <li>When the chime sounds, take a 5-minute break.</li>
            <li>Repeat. After 4 rounds, reward yourself with a longer rest.</li>
          </ol>

          <h2 className="text-xl font-semibold text-[#1a3322] mt-8 mb-3">
            Why 25 Minutes?
          </h2>
          <p className="text-[#3a5a45]">
            Cognitive science research suggests that the human brain can sustain
            deep, deliberate focus for roughly 20–30 minutes before attention
            naturally drifts. A <strong>25-minute countdown</strong> sits right
            in this sweet spot — long enough to make meaningful progress, short
            enough to feel achievable even on low-energy days.
          </p>

          <h2 className="text-xl font-semibold text-[#1a3322] mt-8 mb-3">
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-[#1a3322]">
                Does this 25-minute timer work on mobile?
              </h3>
              <p className="text-[#3a5a45]">
                Yes. The timer is fully responsive and works on any smartphone,
                tablet, or desktop browser without installing an app.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a3322]">
                Will I hear an alarm when the time is up?
              </h3>
              <p className="text-[#3a5a45]">
                Yes. A gentle chime plays automatically when your 25-minute
                countdown reaches zero. Make sure your device volume is on.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a3322]">
                Can I pause and resume my 25-minute timer?
              </h3>
              <p className="text-[#3a5a45]">
                Absolutely. Press <strong>PAUSE</strong> at any time, and click{" "}
                <strong>START</strong> again to continue from where you left off.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a3322]">
                Is this timer free to use?
              </h3>
              <p className="text-[#3a5a45]">
                100% free, forever. No ads, no email sign-up, no premium plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a3322] py-6 text-center text-xs text-[#7aaa8a] tracking-wide">
        <p>
          © {new Date().getFullYear()} 25MinuteTimer.com — Free online Pomodoro
          focus timer
        </p>
        <p className="mt-1 opacity-60">
          Built for deep work, distraction-free.
        </p>
      </footer>
    </>
  );
}