import { useState, useRef, useEffect } from 'react';

interface KeyboardSliderProps {
  letters: string[];
  isActive: boolean;
  onActivate: () => void;
  onLetterSelect: (letter: string, dragDistance?: number) => void;
  isShiftActive: boolean;
}

export const KeyboardSlider = ({
  letters,
  isActive,
  onActivate,
  onLetterSelect,
  isShiftActive,
}: KeyboardSliderProps) => {
  const [dotPosition, setDotPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snappedIndex, setSnappedIndex] = useState<number | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStartDotMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) {
      onActivate();
    }
    setIsDragging(true);
    if (dotPosition === 0) {
      setDragStartPosition(0);
    }
  };

  const handleDotMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && isActive) {
      updateDotPosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Keep dot position and don't reset
  };

  const updateDotPosition = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    
    const tickWidth = rect.width / (letters.length + 1);
    const SNAP_THRESHOLD = tickWidth * 0.5; // 0.5 keys in each direction
    const tickPositions = letters.map((_, i) => (i + 1) * tickWidth);
    
    let newPosition = clampedX;
    let newSnappedIndex: number | null = null;

    // Find closest tick mark within snap threshold
    for (let i = 0; i < tickPositions.length; i++) {
      const tickPos = tickPositions[i];
      if (Math.abs(clampedX - tickPos) < SNAP_THRESHOLD) {
        newPosition = tickPos;
        newSnappedIndex = i;
        break;
      }
    }

    setDotPosition(newPosition);
    setSnappedIndex(newSnappedIndex);
  };

  const handleConfirm = () => {
    if (snappedIndex !== null) {
      const letter = letters[snappedIndex];
      const dragDistance = Math.abs(dotPosition - dragStartPosition);
      onLetterSelect(isShiftActive ? letter.toUpperCase() : letter.toLowerCase(), dragDistance);
      setDotPosition(0);
      setDragStartPosition(0);
      setSnappedIndex(null);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isActive) {
      setDotPosition(0);
      setSnappedIndex(null);
      setIsDragging(false);
    }
  }, [isActive]);

  return (
    <div className="relative w-full py-4 select-none">
      {/* Letter Preview */}
      {snappedIndex !== null && isActive && (
        <div
          className="absolute top-0 transform -translate-x-1/2 transition-all duration-150"
          style={{ left: `${dotPosition}px` }}
        >
          <div className="bg-foreground text-background px-3 py-1 rounded font-medium text-base">
            {isShiftActive ? letters[snappedIndex].toUpperCase() : letters[snappedIndex].toLowerCase()}
          </div>
        </div>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className={`relative h-12 transition-all ${
          isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'
        }`}
      >
        {/* Slider Line */}
        <div
          className={`absolute top-1/2 left-0 right-0 h-1 transition-all ${
            isActive ? 'bg-slider-active' : 'bg-slider-inactive'
          }`}
        />

        {/* Tick Marks and Letters */}
        {letters.map((letter, index) => {
          const position = ((index + 1) / (letters.length + 1)) * 100;
          const isSnapped = snappedIndex === index && isActive;
          
          return (
            <div
              key={index}
              className="absolute top-0 transform -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              {/* Tick Mark */}
              <div
                className={`w-0.5 h-4 transition-all ${
                  isSnapped
                    ? 'bg-slider-snapped h-6'
                    : isActive
                    ? 'bg-tick'
                    : 'bg-slider-inactive'
                }`}
              />
              
              {/* Snap Zone Indicator */}
              {isActive && isSnapped && (
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border border-foreground transition-all"
                />
              )}

              {/* Letter */}
              <div
                className={`absolute top-7 left-1/2 transform -translate-x-1/2 text-base transition-all ${
                  isSnapped
                    ? 'text-foreground font-semibold'
                    : isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {isShiftActive ? letter.toUpperCase() : letter}
              </div>
            </div>
          );
        })}

        {/* Start Dot (visible at left when not active or when dot is at start) */}
        {(!isActive || dotPosition === 0) && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <div
              onMouseDown={handleStartDotMouseDown}
              className={`w-8 h-8 rounded-full cursor-grab active:cursor-grabbing transition-all border ${
                isActive
                  ? 'bg-foreground border-foreground'
                  : 'bg-background border-foreground hover:bg-muted'
              }`}
            >
              <div className={`w-full h-full flex items-center justify-center text-[10px] font-medium ${
                isActive ? 'text-background' : 'text-foreground'
              }`}>
                {isActive ? '▶' : 'START'}
              </div>
            </div>
            {!isActive && (
              <div className="absolute top-9 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                Click to start
              </div>
            )}
          </div>
        )}

        {/* Draggable Dot (visible when active and dot has moved) */}
        {isActive && dotPosition > 0 && (
          <div
            onMouseDown={handleDotMouseDown}
            className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all"
            style={{
              left: `${dotPosition}px`,
              transitionProperty: snappedIndex !== null && !isDragging ? 'all' : 'none',
              transitionDuration: '0.15s',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              className={`w-5 h-5 rounded-full bg-dot border-2 transition-all ${
                snappedIndex !== null
                  ? 'border-foreground scale-125'
                  : 'border-foreground'
              }`}
            />
          </div>
        )}
      </div>

      {/* Confirm Button (appears when letter is selected) */}
      {snappedIndex !== null && isActive && (
        <div className="flex justify-center mt-2">
          <button
            onClick={handleConfirm}
            className="bg-foreground text-background px-6 py-2 rounded font-medium text-sm hover:bg-muted-foreground transition-colors"
          >
            ENTER
          </button>
        </div>
      )}
    </div>
  );
};
