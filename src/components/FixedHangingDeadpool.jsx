import React, { useState, useEffect, useRef } from "react";
import "./FixedHangingDeadpool.css";

const DEADPOOL_QUOTES = [
  "Maximum Effort! (And by effort, I mean Rajat writing pristine React code.)",
  "Hey! Stop poking me, I'm trying to look dramatic upside-down!",
  "Fourth wall officially shattered. Now go smash that 'Let's Connect' button!",
  "Wait... did someone say chimichangas? No? Just full-stack engineering? Fine.",
  "I hang upside down because blood rush = 10x faster PR approvals.",
  "Psst! You know this entire portfolio is 100% responsive, right? Try resizing your window!",
  "Look at that crimson & ruby gradient! Almost as stunning as Ryan Reynolds.",
  "Spoiler alert: Every single project in Curated Work below is certified fire."
];

export default function FixedHangingDeadpool() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isSpeechOpen, setIsSpeechOpen] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [_hasInteracted, setHasInteracted] = useState(false);
  const timerRef = useRef(null);

  // Cycle quote and trigger playful wink & bounce on click
  const handleClick = (e) => {
    e.stopPropagation();
    setHasInteracted(true);
    setIsWinking(true);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
    setTimeout(() => setIsWinking(false), 1400);

    if (!isSpeechOpen) {
      setIsSpeechOpen(true);
    } else {
      setQuoteIndex((prev) => (prev + 1) % DEADPOOL_QUOTES.length);
    }

    // Auto-dismiss speech bubble after 7 seconds of inactivity
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsSpeechOpen(false);
    }, 7000);
  };

  const handleMouseEnter = () => {
    setIsWinking(true);
  };

  const handleMouseLeave = () => {
    if (!isSpeechOpen) {
      setIsWinking(false);
    }
  };

  // Close popup if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".fixed-hanging-deadpool-container") && !e.target.closest(".hanging-deadpool-container")) {
        setIsSpeechOpen(false);
        setIsWinking(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed-hanging-deadpool-container hanging-deadpool-container ${isBouncing ? "is-bouncing" : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label="Interactive hanging Deadpool easter egg. Click to hear a quote."
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {/* Popover Editorial Wisecrack Card */}
      {isSpeechOpen && (
        <div
          className="deadpool-speech-bubble"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-live="polite"
        >
          <div className="speech-header">
            <div className="speech-meta-group">
              <span className="speech-author bg-red-500/10 text-red-600 border border-red-500/20">Deadpool</span>
              <span className="speech-count">
                {quoteIndex + 1} / {DEADPOOL_QUOTES.length}
              </span>
            </div>
            <button
              type="button"
              className="speech-close-btn"
              onClick={() => setIsSpeechOpen(false)}
              aria-label="Close quote"
            >
              ✕
            </button>
          </div>
          <p className="speech-text">&ldquo;{DEADPOOL_QUOTES[quoteIndex]}&rdquo;</p>
          <div className="speech-footer">
            <button
              type="button"
              className="speech-next-btn"
              onClick={() => {
                setQuoteIndex((prev) => (prev + 1) % DEADPOOL_QUOTES.length);
                setIsWinking(true);
                setTimeout(() => setIsWinking(false), 900);
              }}
            >
              <span>Next wisecrack</span>
              <span className="arrow-icon" aria-hidden="true">→</span>
            </button>
          </div>
          <div className="speech-tail" aria-hidden="true" />
        </div>
      )}

      {/* Hanging Rope & Deadpool Character Vector Art */}
      <div className="deadpool-swing-arm">
        <svg
          className="deadpool-svg"
          viewBox="0 0 160 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Top Suspension Hook & Ceiling Bracket */}
          <rect x="76" y="0" width="8" height="6" rx="2" fill="#374151" />
          <circle cx="80" cy="8" r="4" fill="none" stroke="#4b5563" strokeWidth="2" />

          {/* Hanging Rope / Wire dropping from ceiling to ankles */}
          <line
            x1="80"
            y1="8"
            x2="80"
            y2="76"
            stroke="#475569"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            className="rope-strand"
          />
          {/* Rope Coils / Knots around the ankles */}
          <ellipse cx="80" cy="74" rx="8" ry="4" fill="#64748b" />
          <ellipse cx="80" cy="78" rx="7" ry="3.5" fill="#475569" />

          {/* ==================== DEADPOOL BODY (UPSIDE DOWN) ==================== */}
          <g className="deadpool-character-body">
            {/* Boots & Ankles (at top, y = 74 to 110) */}
            {/* Left Boot */}
            <path
              d="M 69 76 L 79 76 L 77 106 L 68 106 Z"
              fill="#c81e2b"
              stroke="#111827"
              strokeWidth="2"
            />
            {/* Left Boot Sole & Toe (pointing right/angled) */}
            <path
              d="M 68 76 C 68 70 76 66 80 72 Z"
              fill="#181e24"
              stroke="#111827"
              strokeWidth="1.5"
            />
            {/* Right Boot (Casually crossed behind) */}
            <path
              d="M 81 76 L 91 76 L 89 106 L 81 106 Z"
              fill="#991b1b"
              stroke="#111827"
              strokeWidth="2"
            />
            <path
              d="M 81 76 C 81 68 90 66 92 73 Z"
              fill="#111827"
              stroke="#0b0d12"
              strokeWidth="1.5"
            />

            {/* Tactical Knee Guards & Thighs (y = 100 to 140) */}
            {/* Left Thigh (Red with black tactical outer stripe) */}
            <path
              d="M 67 104 L 79 104 L 78 136 L 66 136 Z"
              fill="#c81e2b"
              stroke="#111827"
              strokeWidth="2"
            />
            <path d="M 66 108 L 70 108 L 69 132 L 66 132 Z" fill="#181e24" />

            {/* Right Thigh */}
            <path
              d="M 80 104 L 92 104 L 91 136 L 79 136 Z"
              fill="#dc2626"
              stroke="#111827"
              strokeWidth="2"
            />
            <path d="M 88 108 L 92 108 L 91 132 L 88 132 Z" fill="#181e24" />

            {/* Tactical Leg Holster & Knee Pads */}
            <rect x="67" y="112" width="11" height="9" rx="2" fill="#1f2937" stroke="#0f172a" strokeWidth="1" />
            <rect x="81" y="112" width="11" height="9" rx="2" fill="#1f2937" stroke="#0f172a" strokeWidth="1" />

            {/* Combat Utility Belt & Buckle (y = 136 to 148) */}
            <rect x="63" y="136" width="34" height="10" rx="3" fill="#181e24" stroke="#0b0d12" strokeWidth="2" />
            {/* Belt Pouches */}
            <rect x="64" y="137" width="5" height="8" rx="1.5" fill="#374151" />
            <rect x="91" y="137" width="5" height="8" rx="1.5" fill="#374151" />
            {/* Iconic Deadpool Circular Belt Buckle */}
            <circle cx="80" cy="141" r="5" fill="#c81e2b" stroke="#111827" strokeWidth="1.2" />
            <line x1="80" y1="136" x2="80" y2="146" stroke="#111827" strokeWidth="1" />
            <circle cx="78.5" cy="141" r="1.2" fill="#111827" />
            <circle cx="81.5" cy="141" r="1.2" fill="#111827" />

            {/* Twin Katana Handles extending downward past shoulders (y = 140 to 220) */}
            {/* Left Katana Scabbard & Handle */}
            <g className="katana-hilt-left">
              {/* Blade sheath emerging behind shoulder */}
              <line x1="68" y1="140" x2="48" y2="208" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
              {/* Tsuba (Guard) */}
              <ellipse cx="49" cy="204" rx="4.5" ry="2" transform="rotate(-30 49 204)" fill="#f59e0b" stroke="#0b0d12" strokeWidth="1" />
              {/* Tsuka (Handle with diamond wrap) */}
              <line x1="48" y1="208" x2="40" y2="236" stroke="#991b1b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="48" y1="208" x2="40" y2="236" stroke="#111827" strokeWidth="3.5" strokeDasharray="2 3" strokeLinecap="round" />
              {/* Pommel */}
              <circle cx="39" cy="238" r="2.5" fill="#f59e0b" stroke="#0b0d12" strokeWidth="1" />
            </g>

            {/* Right Katana Scabbard & Handle */}
            <g className="katana-hilt-right">
              {/* Blade sheath */}
              <line x1="92" y1="140" x2="112" y2="208" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
              {/* Tsuba (Guard) */}
              <ellipse cx="111" cy="204" rx="4.5" ry="2" transform="rotate(30 111 204)" fill="#f59e0b" stroke="#0b0d12" strokeWidth="1" />
              {/* Tsuka (Handle) */}
              <line x1="112" y1="208" x2="120" y2="236" stroke="#991b1b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="112" y1="208" x2="120" y2="236" stroke="#111827" strokeWidth="3.5" strokeDasharray="2 3" strokeLinecap="round" />
              {/* Pommel */}
              <circle cx="121" cy="238" r="2.5" fill="#f59e0b" stroke="#0b0d12" strokeWidth="1" />
            </g>

            {/* Torso / Upper Body (y = 146 to 198) */}
            {/* Red Suit Base */}
            <path
              d="M 64 146 C 58 160 56 182 61 198 L 99 198 C 104 182 102 160 96 146 Z"
              fill="#c81e2b"
              stroke="#111827"
              strokeWidth="2.2"
            />
            {/* Black Tactical Side Torso Panels */}
            <path
              d="M 64 146 C 60 162 58 180 61 198 L 70 198 C 67 182 68 164 72 146 Z"
              fill="#181e24"
            />
            <path
              d="M 96 146 C 100 162 102 180 99 198 L 90 198 C 93 182 92 164 88 146 Z"
              fill="#181e24"
            />
            {/* Tactical Chest Harness Straps */}
            <line x1="68" y1="152" x2="92" y2="192" stroke="#181e24" strokeWidth="3" />
            <line x1="92" y1="152" x2="68" y2="192" stroke="#181e24" strokeWidth="3" />
            <circle cx="80" cy="172" r="3" fill="#475569" stroke="#111827" strokeWidth="1" />

            {/* Right Arm (Resting coolly against torso) */}
            <path
              d="M 60 162 C 52 176 54 196 64 204 L 70 198 C 62 192 60 178 68 164 Z"
              fill="#c81e2b"
              stroke="#111827"
              strokeWidth="2"
            />
            {/* Right Black Gauntlet Glove */}
            <path
              d="M 64 202 C 67 206 72 208 74 205 L 70 198 Z"
              fill="#181e24"
              stroke="#111827"
              strokeWidth="1.5"
            />

            {/* Left Arm: Raised in Peace Sign ✌️ */}
            <g className="peace-sign-arm">
              {/* Upper arm & forearm curving outward */}
              <path
                d="M 98 162 C 108 172 114 186 112 200 L 105 198 C 106 188 102 178 95 168 Z"
                fill="#dc2626"
                stroke="#111827"
                strokeWidth="2"
              />
              {/* Black Gauntlet Glove */}
              <ellipse cx="112" cy="202" rx="5" ry="6" fill="#181e24" stroke="#111827" strokeWidth="1.5" />
              {/* Peace Sign ✌️ Fingers (Index & Middle extended) */}
              <line x1="110" y1="206" x2="108" y2="218" stroke="#181e24" strokeWidth="3" strokeLinecap="round" />
              <line x1="114" y1="206" x2="118" y2="217" stroke="#181e24" strokeWidth="3" strokeLinecap="round" />
              {/* Folded thumb and other fingers */}
              <circle cx="111" cy="205" r="2.5" fill="#374151" />
            </g>

            {/* Deadpool Head (Hanging at bottom, y = 196 to 260) */}
            <g className="deadpool-head">
              {/* Neck */}
              <rect x="74" y="196" width="12" height="8" fill="#991b1b" stroke="#111827" strokeWidth="1.5" />

              {/* Head Silhouette (Smoothly rounded cowl dome with no horn) */}
              <path
                d="M 58 214 C 56 238 64 258 80 258 C 96 258 104 238 102 214 C 100 198 90 198 80 198 C 70 198 60 198 58 214 Z"
                fill="#c81e2b"
                stroke="#111827"
                strokeWidth="2.5"
              />

              {/* Left Eye Black Patch (Upside down viewer perspective) */}
              <path
                d="M 76 216 C 68 217 64 227 65 238 C 66 248 72 250 76 248 Z"
                fill="#181e24"
                stroke="#111827"
                strokeWidth="1.5"
              />

              {/* Right Eye Black Patch */}
              <path
                d="M 84 216 C 92 217 96 227 95 238 C 94 248 88 250 84 248 Z"
                fill="#181e24"
                stroke="#111827"
                strokeWidth="1.5"
              />

              {/* Left White Eye Slit (Alert / focused expression) */}
              <path
                d="M 74 232 C 70 231 68 235 68 239 C 71 241 74 238 74 232 Z"
                fill="#ffffff"
                stroke="#0b0d12"
                strokeWidth="0.8"
              />

              {/* Right Eye: Interactive Winking Eye! */}
              {isWinking ? (
                /* Playful Cheeky Wink Arc (Inverted for upside down) */
                <path
                  d="M 86 236 C 89 240 92 240 94 236"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="deadpool-wink-eye"
                />
              ) : (
                /* Normal Alert Slanted White Eye */
                <path
                  d="M 86 232 C 90 231 92 235 92 239 C 89 241 86 238 86 232 Z"
                  fill="#ffffff"
                  stroke="#0b0d12"
                  strokeWidth="0.8"
                />
              )}

              {/* Subtle mask center seam */}
              <line x1="80" y1="202" x2="80" y2="258" stroke="#991b1b" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
