import React, { useEffect, useRef, useState } from "react";

function AutoFitText({ text, maxFontSize = 36, minFontSize = 10 }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const adjustSize = () => {
      setIsReady(false);

      const container = containerRef.current;
      const textEl = textRef.current;
      if (!container || !textEl) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) return;

      let size = maxFontSize;
      textEl.style.fontSize = `${size}px`;

      // Gradually shrink until text fits both width and height
      while ((textEl.scrollHeight > container.clientHeight ||
              textEl.scrollWidth > container.clientWidth) &&
              size > minFontSize){
        size -= 1;
        textEl.style.fontSize = `${size}px`;
      }
      
      if (size === fontSize){
        setIsReady(true);
        return;}
      textEl.style.fontSize = '';
      setFontSize(size);
    };

    adjustSize();
  }, [text, maxFontSize, minFontSize]);

  useEffect(() => {
    setIsReady(true);
  }, [fontSize]); 

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
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
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.5s linear",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default AutoFitText;
