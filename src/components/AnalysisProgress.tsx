import { motion } from "framer-motion";

interface AnalysisProgressProps {
  progress: number;
  stage: string;
}

const stages = [
  "Extracting frames...",
  "Detecting players...",
  "Tracking ball trajectory...",
  "Analyzing shot patterns...",
  "Mapping court positions...",
  "Generating report...",
];

const AnalysisProgress = ({ progress, stage }: AnalysisProgressProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 mx-auto mb-4 rounded-full border-4 border-muted border-t-primary"
            />
            <h3 className="font-display text-xl font-bold text-foreground">
              Analyzing Your Match
            </h3>
            <p className="text-muted-foreground text-sm font-body mt-1">
              {stage}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full accent-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground font-body">
            <span>{Math.round(progress)}% complete</span>
            <span>~{Math.max(1, Math.ceil((100 - progress) / 12))} min remaining</span>
          </div>

          {/* Stage List */}
          <div className="mt-8 space-y-3">
            {stages.map((s, i) => {
              const stageIndex = stages.indexOf(stage);
              const isDone = i < stageIndex;
              const isCurrent = s === stage;
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-3 text-sm font-body ${
                    isDone
                      ? "text-primary"
                      : isCurrent
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/50"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isDone
                        ? "bg-primary"
                        : isCurrent
                        ? "bg-tennis animate-pulse"
                        : "bg-muted-foreground/20"
                    }`}
                  />
                  {s}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalysisProgress;
