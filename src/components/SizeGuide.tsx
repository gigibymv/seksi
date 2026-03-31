import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sizeData = [
  { size: "S", chest: '36"', waist: '30"', length: '27"' },
  { size: "M", chest: '38-40"', waist: '32-34"', length: '28"' },
  { size: "L", chest: '42-44"', waist: '36-38"', length: '29"' },
  { size: "XL", chest: '46-48"', waist: '40-42"', length: '30"' },
];

const SizeGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="font-body text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Size Guide</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">Size</th>
                <th className="text-left py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">Chest</th>
                <th className="text-left py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">Waist</th>
                <th className="text-left py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">Length</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row) => (
                <tr key={row.size} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{row.size}</td>
                  <td className="py-2.5 text-muted-foreground">{row.chest}</td>
                  <td className="py-2.5 text-muted-foreground">{row.waist}</td>
                  <td className="py-2.5 text-muted-foreground">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-body text-[11px] text-muted-foreground mt-2">
          All measurements are approximate. For caps, one size fits most.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
