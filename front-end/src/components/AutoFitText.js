import React, { useEffect, useRef, useState } from "react";

function AutoFitText({ text, maxFontSize = 36, minFontSize = 10 }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const adjustSize = () => {
      const container = containerRef.current;
      const textEl = textRef.current;
      if (!container || !textEl) return;

      let size = maxFontSize;
      textEl.style.fontSize = `${size}px`;

      // Gradually shrink until text fits both width and height
      while (
        (textEl.scrollHeight > container.clientHeight ||
          textEl.scrollWidth > container.clientWidth) &&
        size > minFontSize
      ) {
        size -= 1;
        textEl.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };

    adjustSize();
    window.addEventListener("resize", adjustSize);
    return () => window.removeEventListener("resize", adjustSize);
  }, [text, maxFontSize, minFontSize]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
          color: "#333",
          wordBreak: "break-word",
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default AutoFitText;
