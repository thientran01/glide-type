import { useEffect, useState } from 'react';

interface MetricsPanelProps {
  startTime: number | null;
  typedText: string;
  targetText: string;
  totalDragDistance: number;
}

interface MetricsPanelProps {
  startTime: number | null;
  typedText: string;
  targetText: string;
  totalDragDistance: number;
  trialCount: number;
}

export const MetricsPanel = ({
  startTime,
  typedText,
  targetText,
  totalDragDistance,
  trialCount,
}: MetricsPanelProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const calculateWPM = () => {
    if (elapsedTime === 0) return 0;
    const minutes = elapsedTime / 60000;
    const words = typedText.trim().split(/\s+/).length;
    return Math.round(words / minutes);
  };

  const calculateMSD = () => {
    if (typedText.length === 0) return 0;
    return Math.round((totalDragDistance / typedText.length) * 100) / 100;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const deciseconds = Math.floor((ms % 1000) / 100);
    return `${seconds}.${deciseconds}s`;
  };

  const averageTimePerChar =
    typedText.length > 0 ? elapsedTime / typedText.length : 0;

  const showMetrics = trialCount >= 20;

  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      {showMetrics && (
        <div className="bg-card rounded p-4 border border-border">
          <h3 className="text-sm font-medium mb-3 text-foreground">Metrics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Time</div>
            <div className="text-lg font-mono text-foreground">
              {formatTime(elapsedTime)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">WPM</div>
            <div className="text-lg font-mono text-foreground">
              {calculateWPM()}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">MSD</div>
            <div className="text-lg font-mono text-foreground">
              {calculateMSD()}px
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Characters</div>
            <div className="text-lg font-mono text-foreground">
              {typedText.length}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Avg Time/Char</div>
            <div className="text-lg font-mono text-foreground">
              {formatTime(averageTimePerChar)}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
