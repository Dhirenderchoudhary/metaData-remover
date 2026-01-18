import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlayerPlay, IconPlayerPause, IconRefresh, IconFlag } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

export const Stopwatch = () => {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lapStartTime, setLapStartTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (time === 0) {
        setLapStartTime(0);
      } else {
        setLapStartTime(time);
      }
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLapStartTime(0);
  };

  const handleLap = () => {
    if (isRunning || time > 0) {
      const lapTime = time - lapStartTime;
      const newLap: Lap = {
        id: Date.now(),
        time: time,
        lapTime: lapTime,
      };
      setLaps((prev) => [newLap, ...prev]);
      setLapStartTime(time);
      showToast('Lap recorded');
    }
  };

  const getLapTimeColor = (lapTime: number, allLaps: Lap[]): string => {
    if (allLaps.length <= 1) return 'text-foreground';
    
    const lapTimes = allLaps.map(l => l.lapTime);
    const fastest = Math.min(...lapTimes);
    const slowest = Math.max(...lapTimes);
    
    if (lapTime === fastest) return 'text-emerald-500 font-semibold';
    if (lapTime === slowest) return 'text-red-500 font-semibold';
    return 'text-foreground';
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconPlayerPlay className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Stopwatch
          </h1>
          <p className="text-muted-foreground">
            Track time with lap functionality
          </p>
        </div>

        {/* Stopwatch Display */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl md:text-7xl font-bold text-foreground font-mono mb-4">
              {formatTime(time)}
            </div>
            {laps.length > 0 && (
              <div className="text-lg text-muted-foreground">
                Lap {laps.length + 1}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="p-4 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Reset"
            >
              <IconRefresh className="w-6 h-6" />
            </button>

            <button
              onClick={handleStartStop}
              className={`p-6 rounded-full transition-all cursor-pointer ${
                isRunning
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
              title={isRunning ? 'Stop' : 'Start'}
            >
              {isRunning ? (
                <IconPlayerPause className="w-8 h-8" />
              ) : (
                <IconPlayerPlay className="w-8 h-8" />
              )}
            </button>

            <button
              onClick={handleLap}
              disabled={!isRunning && time === 0}
              className="p-4 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Lap"
            >
              <IconFlag className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <IconFlag className="w-5 h-5 text-primary" />
              Laps ({laps.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {laps.map((lap, index) => (
                  <motion.div
                    key={lap.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {laps.length - index}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Time</div>
                        <div className="font-mono font-semibold">{formatTime(lap.time)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Lap Time</div>
                      <div className={`font-mono font-semibold ${getLapTimeColor(lap.lapTime, laps)}`}>
                        {formatTime(lap.lapTime)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {laps.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <IconFlag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No laps recorded yet</p>
            <p className="text-sm mt-1">Press the lap button while running to record laps</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
