import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import sizeGuideTshirt from "@/assets/size-guide-tshirt.png";
import sizeGuideCap from "@/assets/size-guide-cap.png";

interface SizeGuideProps {
  category: "cap" | "tshirt" | string;
}

const SizeGuide = ({ category }: SizeGuideProps) => {
  if (category !== "cap" && category !== "tshirt") return null;

  const imageSrc = category === "cap" ? sizeGuideCap : sizeGuideTshirt;
  const title = category === "cap" ? "Cap Size Guide" : "T-shirt Size Guide";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="font-body text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] p-6 overflow-hidden">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full overflow-hidden rounded-md border border-border bg-muted/20">
          <img src={imageSrc} alt={title} className="w-full h-auto object-contain mix-blend-multiply" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
