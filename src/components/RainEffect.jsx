import { useMemo } from "react";

const seededValue = (seed) => {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
};

const RainEffect = () => {
  const drops = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => ({
        delay: seededValue(index + 1) * 2,
        duration: seededValue(index + 101) + 0.5,
        id: index,
        left: seededValue(index + 201) * 100,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute bg-white/40"
          style={{
            animation: `rainFall ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
            height: "20px",
            left: `${drop.left}%`,
            top: "-20px",
            width: "1px",
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect;
