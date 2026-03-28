import { motion } from "framer-motion";
import { Activity, Eye, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Sports analytics visualization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="tennis-ball-dot" />
          <span className="text-sm font-medium tracking-widest uppercase text-primary-foreground/70 font-body">
            AI-Powered Match Analysis
          </span>
          <div className="tennis-ball-dot" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
        >
          Decode Every
          <br />
          <span className="text-gradient">Rally & Shot</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg sm:text-xl text-primary-foreground/60 max-w-2xl mx-auto mb-10 font-body"
        >
          Upload your tennis or badminton match video and get a detailed
          computer vision analysis report — player movement, shot placement,
          rally patterns, and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/50 text-sm font-body"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-glow" />
            <span>Computer Vision</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-tennis" />
            <span>Player Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-glow" />
            <span>Detailed Reports</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-glow" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
