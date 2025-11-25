interface ControlButtonsProps {
  onSpace: () => void;
  onDelete: () => void;
  onShift: () => void;
  onSubmit: () => void;
  onClear: () => void;
  isShiftActive: boolean;
}

export const ControlButtons = ({
  onSpace,
  onDelete,
  onShift,
  onSubmit,
  onClear,
  isShiftActive,
}: ControlButtonsProps) => {
  return (
    <div className="relative w-full flex flex-col gap-2">
      {/* Top Row - Shift, Space, Delete aligned horizontally */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onShift}
          className={`w-24 py-2 rounded text-sm font-medium transition-colors border ${
            isShiftActive
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-foreground border-foreground hover:bg-muted'
          }`}
        >
          SHIFT {isShiftActive && '✓'}
        </button>

        <button
          onClick={onSpace}
          className="bg-background text-foreground px-24 py-2 rounded text-sm font-medium hover:bg-muted transition-colors border border-foreground"
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

      {/* Bottom Row - Clear center, Submit right */}
      <div className="flex items-center justify-center relative">
        <button
          onClick={onClear}
          className="bg-background text-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted transition-colors border border-foreground"
        >
          CLEAR
        </button>
        
        <button
          onClick={onSubmit}
          className="bg-foreground text-background px-6 py-2 rounded text-sm font-medium hover:bg-muted-foreground transition-colors border border-foreground absolute right-0"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};
