interface TargetSentenceProps {
  sentence: string;
}

export const TargetSentence = ({ sentence }: TargetSentenceProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <div className="bg-muted border border-border rounded-lg p-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 block">
          Type this sentence
        </span>
        <p className="text-lg font-medium text-foreground leading-relaxed">
          {sentence}
        </p>
      </div>
    </div>
  );
};
