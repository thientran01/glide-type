interface TargetSentenceProps {
  sentence: string;
  currentIndex: number;
  totalTrials: number;
}

export const TargetSentence = ({ sentence, currentIndex, totalTrials }: TargetSentenceProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <div className="bg-muted border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Type this sentence
          </span>
          <span className="text-xs text-muted-foreground">
            Trial {currentIndex + 1} of {totalTrials}
          </span>
        </div>
        <p className="text-lg font-medium text-foreground leading-relaxed">
          {sentence}
        </p>
      </div>
    </div>
  );
};
