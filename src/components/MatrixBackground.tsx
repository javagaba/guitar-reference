import { useEffect, useRef } from "react";

// Well-supported Unicode symbols that render clearly on canvas
const SYMBOLS = ["♩", "♪", "♫", "♬", "♭", "♮", "♯", "𝄞"];
const CELL = 32;

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;
    let columns = 0;
    let rows = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let chars: string[] = [];

    function randomChar() {
      return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const newCols = Math.floor(w / CELL);
      rows = Math.ceil(h / CELL);
      if (newCols !== columns) {
        const oldDrops = drops;
        const oldSpeeds = speeds;
        const oldChars = chars;
        drops = new Array(newCols);
        speeds = new Array(newCols);
        chars = new Array(newCols);
        for (let i = 0; i < newCols; i++) {
          if (i < oldDrops.length) {
            drops[i] = oldDrops[i];
            speeds[i] = oldSpeeds[i];
            chars[i] = oldChars[i];
          } else {
            drops[i] = -Math.floor(Math.random() * rows);
            speeds[i] = 0.08 + Math.random() * 0.1;
            chars[i] = randomChar();
          }
        }
        columns = newCols;
      }
    }

    resize();
    window.addEventListener("resize", resize);

    let animId: number;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CELL - 4}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";

      for (let i = 0; i < columns; i++) {
        const x = i * CELL + CELL / 2;
        const y = drops[i] * CELL + CELL / 2;

        if (y >= -CELL && y < h + CELL) {
          ctx.fillText(chars[i], x, y);
        }

        drops[i] += speeds[i];

        if (drops[i] > rows) {
          drops[i] = -Math.floor(Math.random() * 10);
          speeds[i] = 0.08 + Math.random() * 0.15;
          chars[i] = randomChar();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
