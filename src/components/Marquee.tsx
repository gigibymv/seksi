const MarqueeContent = () => (
  <span className="inline-flex items-center gap-8 px-8 whitespace-nowrap">
    <span>SECTION C</span>
    <span className="text-background/40">·</span>
    <span>HARVARD BUSINESS SCHOOL</span>
    <span className="text-background/40">·</span>
    <span>2027 EDITION</span>
    <span className="text-background/40">·</span>
    <span>SECTION C</span>
    <span className="text-background/40">·</span>
    <span>HARVARD BUSINESS SCHOOL</span>
    <span className="text-background/40">·</span>
    <span>2027 EDITION</span>
    <span className="text-background/40">·</span>
  </span>
);

const Marquee = () => {
  return (
    <div className="w-full bg-foreground text-background overflow-hidden py-3">
      <div className="animate-marquee flex font-body text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium">
        <MarqueeContent />
        <MarqueeContent />
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

export default Marquee;
