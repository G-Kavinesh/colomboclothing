"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type Props = {
  onAdd: () => boolean; // returns true if item was added (size selected)
  statusText: string;
};

export default function AddToBag({ onAdd, statusText }: Props) {
  const [animating, setAnimating] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timers
  useEffect(() => {
    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  // Typewriter effect when statusText changes
  useEffect(() => {
    if (!statusText) {
      setCurrentText("");
      setDisplayedChars(0);
      return;
    }
    setCurrentText(statusText);
    setDisplayedChars(0);

    // Clear any existing timers
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    for (let i = 0; i < statusText.length; i++) {
      const t = setTimeout(() => {
        setDisplayedChars(i + 1);
      }, i * 35);
      timerRef.current.push(t);
    }
  }, [statusText]);

  const handleClick = useCallback(() => {
    if (animating) return;
    const success = onAdd();
    if (!success) return;

    setAnimating(true);
    setShowCheck(true);

    // Dispatch event so header can animate
    window.dispatchEvent(new CustomEvent("bag-item-added"));

    setTimeout(() => {
      setShowCheck(false);
      setAnimating(false);
    }, 900);
  }, [onAdd, animating]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Button container */}
      <button
        onClick={handleClick}
        aria-label="Add to bag"
        style={{
          marginTop: 32,
          width: 56,
          height: 56,
          border: 0,
          background: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Expanding ring */}
        {animating && (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: "2px solid var(--text)",
              animation: "ring-expand 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Plus / Check icon */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: animating ? "plus-to-check 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
          }}
        >
          {showCheck ? (
            // Checkmark
            <span
              style={{
                display: "block",
                width: 10,
                height: 18,
                borderRight: "2.5px solid var(--text)",
                borderBottom: "2.5px solid var(--text)",
                transform: "rotate(45deg) translate(-1px, -1px)",
              }}
            />
          ) : (
            // Plus
            <>
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 30,
                  height: 2.5,
                  background: "var(--text)",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 2.5,
                  height: 30,
                  background: "var(--text)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </>
          )}
        </div>
      </button>

      {/* Underline bar that draws in */}
      <div
        style={{
          width: 30,
          height: 1,
          marginTop: 8,
          overflow: "hidden",
        }}
      >
        {animating && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--text)",
              transformOrigin: "left",
              animation: "bar-draw 0.4s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
            }}
          />
        )}
      </div>

      {/* Typewriter status text */}
      <div
        style={{
          height: 20,
          marginTop: 6,
          fontSize: 12,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {currentText.split("").map((char, i) => (
          <span
            key={`${currentText}-${i}`}
            style={{
              display: "inline-block",
              opacity: i < displayedChars ? 1 : 0,
              transform: i < displayedChars ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 0.15s, transform 0.15s",
              whiteSpace: char === " " ? "pre" : undefined,
            }}
          >
            {char}
          </span>
        ))}
        {/* Blinking cursor during typing */}
        {currentText && displayedChars < currentText.length && (
          <span
            style={{
              display: "inline-block",
              width: 1,
              height: 12,
              background: "var(--text-muted)",
              marginLeft: 1,
              animation: "char-fade 0.4s infinite alternate",
            }}
          />
        )}
      </div>
    </div>
  );
}
