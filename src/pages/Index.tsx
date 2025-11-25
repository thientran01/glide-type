import { useState, useEffect } from 'react';
import { TextDisplay } from '@/components/TextDisplay';
import { KeyboardSlider } from '@/components/KeyboardSlider';
import { ControlButtons } from '@/components/ControlButtons';
import { MetricsPanel } from '@/components/MetricsPanel';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const TARGET_TEXT = "The quick brown fox jumps over the lazy dog";
  const [typedText, setTypedText] = useState('');
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalDragDistance, setTotalDragDistance] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTrialCount();
  }, []);

  const fetchTrialCount = async () => {
    const { count, error } = await supabase
      .from('trials')
      .select('*', { count: 'exact', head: true });

    if (!error && count !== null) {
      setTrialCount(count);
    }
  };

  const handleLetterSelect = (letter: string, dragDistance?: number) => {
    if (startTime === null) {
      setStartTime(Date.now());
    }
    
    if (dragDistance !== undefined) {
      setTotalDragDistance(prev => prev + dragDistance);
    }
    
    setTypedText((prev) => prev + letter);
    
    if (isShiftActive) {
      setIsShiftActive(false);
    }

    setActiveRow(null);
  };

  const handleSpace = () => {
    if (startTime === null) {
      setStartTime(Date.now());
    }
    setTypedText((prev) => prev + ' ');
  };

  const handleDelete = () => {
    setTypedText((prev) => prev.slice(0, -1));
  };

  const handleShift = () => {
    setIsShiftActive((prev) => !prev);
  };

  const handleClear = () => {
    setTypedText('');
    setActiveRow(null);
    setIsShiftActive(false);
    setStartTime(null);
    setTotalDragDistance(0);
  };

  const handleResetTrials = async () => {
    const { error } = await supabase
      .from('trials')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      toast({
        title: "Error resetting trials",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrialCount(0);
      toast({
        title: "Trials reset",
        description: "All trial data has been cleared",
      });
    }
  };

  const calculateMetrics = (text: string, elapsed: number) => {
    const minutes = elapsed / 60000;
    const words = text.trim().split(/\s+/).length;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;

    let correct = 0;
    for (let i = 0; i < Math.min(text.length, TARGET_TEXT.length); i++) {
      if (text[i] === TARGET_TEXT[i]) correct++;
    }
    const accuracy = text.length > 0 ? Math.round((correct / text.length) * 100) : 0;

    const avgTimePerChar = text.length > 0 ? elapsed / text.length : 0;

    return { wpm, accuracy, avgTimePerChar };
  };

  const handleSubmit = async () => {
    if (!startTime || typedText.length === 0) {
      toast({
        title: "Cannot submit",
        description: "Please type some text before submitting",
        variant: "destructive",
      });
      return;
    }

    const elapsedTime = Date.now() - startTime;
    const metrics = calculateMetrics(typedText, elapsedTime);

    const { error } = await supabase.from('trials').insert({
      typed_text: typedText,
      target_text: TARGET_TEXT,
      elapsed_time: elapsedTime,
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      total_drag_distance: totalDragDistance,
      character_count: typedText.length,
      avg_time_per_char: metrics.avgTimePerChar,
    });

    if (error) {
      toast({
        title: "Error saving trial",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrialCount(prev => prev + 1);
      toast({
        title: "Trial saved",
        description: `Trial ${trialCount + 1}/20 saved successfully`,
      });
      handleClear();
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Saved Trials CTA */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Sliding Text Entry Keyboard
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <Button
              variant="outline"
              onClick={() => navigate('/saved-trials')}
            >
              SAVED TRIALS
            </Button>
          </div>
        </div>

        {/* Instructions and Trial Counter */}
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Drag the dot along the slider to select letters, then click ENTER to confirm
          </p>
          <div className="flex items-center justify-center gap-4">
            <p className="text-lg font-semibold text-foreground">
              {trialCount}/20 trials
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetTrials}
            >
              RESET TRIALS
            </Button>
          </div>
        </div>

        {/* Text Display */}
        <TextDisplay typedText={typedText} />

        {/* Metrics Panel */}
        <MetricsPanel
          startTime={startTime}
          typedText={typedText}
          targetText={TARGET_TEXT}
          totalDragDistance={totalDragDistance}
          trialCount={trialCount}
        />

        {/* Keyboard Area */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Keyboard Sliders */}
          <div className="space-y-4 mb-4">
            {KEYBOARD_ROWS.map((letters, index) => (
              <KeyboardSlider
                key={index}
                letters={letters}
                isActive={activeRow === index}
                onActivate={() => setActiveRow(index)}
                onLetterSelect={handleLetterSelect}
                isShiftActive={isShiftActive}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <ControlButtons
            onSpace={handleSpace}
            onDelete={handleDelete}
            onShift={handleShift}
            onSubmit={handleSubmit}
            isShiftActive={isShiftActive}
          />
        </div>

        {/* Clear Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={handleClear}
          >
            CLEAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
