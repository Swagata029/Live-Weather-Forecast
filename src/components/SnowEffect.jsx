import { useMemo } from "react";

const seededValue = (seed) => {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
};

const SnowEffect = () => {
  const flakes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => {
        const size = seededValue(index + 1) * 6 + 4;

        return {
          delay: seededValue(index + 101) * 5,
          duration: seededValue(index + 201) * 5 + 5,
          id: index,
          left: seededValue(index + 301) * 100,
          size,
        };
      }),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            animation: `snowFall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            height: `${flake.size}px`,
            left: `${flake.left}%`,
            width: `${flake.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
