import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Film, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploadProps {
  onVideoSubmit: (file: File) => void;
  isAnalyzing: boolean;
}

const VideoUpload = ({ onVideoSubmit, isAnalyzing }: VideoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!file.type.startsWith("video/mp4") && !file.name.endsWith(".mp4")) {
      setError("Please upload an .mp4 video file");
      return false;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError("File size must be under 500MB");
      return false;
    }
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section id="upload" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Upload Your Match Video
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Drop a full-court .mp4 video with 2 players visible. Our AI will
            handle the rest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !selectedFile && inputRef.current?.click()}
            className={`upload-zone p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
              dragActive ? "upload-zone-active" : "hover:border-primary/50"
            } ${selectedFile ? "border-primary bg-primary/5" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,.mp4"
              onChange={handleChange}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-lg">
                      Drag & drop your match video
                    </p>
                    <p className="text-muted-foreground text-sm mt-1 font-body">
                      or click to browse · .mp4 only · max 500MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Film className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-display font-semibold text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-muted-foreground text-sm font-body">
                      {formatSize(selectedFile.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 mt-3 text-destructive text-sm font-body"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div className="mt-6 flex justify-center">
            <Button
              size="lg"
              disabled={!selectedFile || isAnalyzing}
              onClick={() => selectedFile && onVideoSubmit(selectedFile)}
              className="font-display text-base px-8 py-6 accent-gradient text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-40 glow-shadow"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                  />
                  Analyzing...
                </span>
              ) : (
                "Start Analysis"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoUpload;
