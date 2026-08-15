const SunlightEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="sunbeam sunbeam-wide" />
      <div className="sunbeam sunbeam-soft" />
      <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-yellow-200/60 blur-xl" />
    </div>
  );
};

export default SunlightEffect;
