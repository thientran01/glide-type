import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Trial {
  id: string;
  typed_text: string;
  target_text: string;
  elapsed_time: number;
  wpm: number;
  accuracy: number;
  total_drag_distance: number;
  character_count: number;
  avg_time_per_char: number;
  created_at: string;
}

const SavedTrials = () => {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTrials();
  }, []);

  const fetchTrials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading trials",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrials(data || []);
    }
    setLoading(false);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const deciseconds = Math.floor((ms % 1000) / 100);
    return `${seconds}.${deciseconds}s`;
  };

  const exportToCSV = (trial?: Trial) => {
    const trialsToExport = trial ? [trial] : trials;
    
    if (trialsToExport.length === 0) {
      toast({
        title: "No trials to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      'Trial Number',
      'Typed Text',
      'Target Text',
      'Time (s)',
      'WPM',
      'Accuracy (%)',
      'Total Drag Distance (px)',
      'Characters',
      'Avg Time/Char (s)',
      'Date/Time'
    ];

    const rows = trialsToExport.map((t, index) => [
      trials.length - trials.findIndex(trial => trial.id === t.id),
      `"${t.typed_text}"`,
      `"${t.target_text}"`,
      (t.elapsed_time / 1000).toFixed(1),
      t.wpm,
      t.accuracy,
      t.total_drag_distance,
      t.character_count,
      (t.avg_time_per_char / 1000).toFixed(3),
      new Date(t.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = trial 
      ? `trial_${trials.findIndex(t => t.id === trial.id) + 1}.csv`
      : `all_trials_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: trial ? "Trial exported to CSV" : "All trials exported to CSV",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading trials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Keyboard
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">Saved Trials</h1>
          
          <div className="w-32"></div>
        </div>

        {trials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No trials saved yet</p>
            <p className="text-muted-foreground text-sm mt-2">
              Complete and submit trials to see them here
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => exportToCSV()}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export All Trials to CSV
              </Button>
            </div>

            <div className="space-y-4">
              {trials.map((trial, index) => (
                <div
                  key={trial.id}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Trial {trials.length - index}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trial.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(trial)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </Button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Typed Text:</p>
                    <p className="text-foreground font-mono">{trial.typed_text}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatTime(trial.elapsed_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">WPM</p>
                      <p className="text-lg font-semibold text-foreground">{trial.wpm}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-lg font-semibold text-foreground">{trial.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Drag Distance</p>
                      <p className="text-lg font-semibold text-foreground">
                        {trial.total_drag_distance}px
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Characters</p>
                      <p className="text-lg font-semibold text-foreground">
                        {trial.character_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Time/Char</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatTime(trial.avg_time_per_char)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MSD</p>
                      <p className="text-lg font-semibold text-foreground">
                        {Math.round(trial.total_drag_distance / trial.character_count)}px
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedTrials;
