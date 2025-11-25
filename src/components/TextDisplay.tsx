interface TextDisplayProps {
  typedText: string;
}

export const TextDisplay = ({ typedText }: TextDisplayProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <div className="bg-card rounded p-4 border border-border">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
          Your Input
        </div>
        <div className="min-h-[50px] text-2xl font-mono text-foreground tracking-wide break-all">
          {typedText || (
            <span className="text-muted-foreground">Start typing...</span>
          )}
          <span className="inline-block w-1 h-6 bg-foreground ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
