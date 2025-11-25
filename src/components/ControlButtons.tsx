interface ControlButtonsProps {
  onSpace: () => void;
  onDelete: () => void;
  onShift: () => void;
  onSubmit: () => void;
  isShiftActive: boolean;
}

export const ControlButtons = ({
  onSpace,
  onDelete,
  onShift,
  onSubmit,
  isShiftActive,
}: ControlButtonsProps) => {
  return (
    <div className="relative w-full flex gap-2">
      {/* Left Column - Shift, Space, Delete */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onShift}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors border ${
            isShiftActive
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-foreground border-foreground hover:bg-muted'
          }`}
        >
          SHIFT {isShiftActive && '✓'}
        </button>

        <button
          onClick={onSpace}
          className="bg-background text-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors border border-foreground"
        >
          SPACE
        </button>

        <button
          onClick={onDelete}
          className="bg-foreground text-background px-4 py-2 rounded text-sm font-medium hover:bg-muted-foreground transition-colors border border-foreground"
        >
          DELETE
        </button>
      </div>

      {/* Right Column - Submit aligned with Delete */}
      <div className="flex flex-col justify-end">
        <button
          onClick={onSubmit}
          className="bg-foreground text-background px-6 py-2 rounded text-sm font-medium hover:bg-muted-foreground transition-colors border border-foreground"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};
