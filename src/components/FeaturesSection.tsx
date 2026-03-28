import { motion } from "framer-motion";
import { Eye, Zap, BarChart3, Target } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Computer Vision",
    desc: "Advanced object detection tracks every player, ball, and shuttlecock frame by frame.",
  },
  {
    icon: Target,
    title: "Shot Mapping",
    desc: "Precise shot placement analysis with heatmaps showing court coverage patterns.",
  },
  {
    icon: Zap,
    title: "Rally Analysis",
    desc: "Break down every rally — duration, shot count, winning patterns, and tempo shifts.",
  },
  {
    icon: BarChart3,
    title: "Performance Stats",
    desc: "Comprehensive stats including speed, court coverage, reaction time, and more.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What You'll Get
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            A detailed PDF report powered by cutting-edge computer vision analysis.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:card-shadow-hover transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
