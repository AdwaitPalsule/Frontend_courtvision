import { Activity } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center">
            <Activity className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            CourtVision
          </span>
        </div>
        <a
          href="#upload"
          className="text-sm font-display font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Analyze Match →
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
