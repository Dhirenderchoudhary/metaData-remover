import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconClock, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const DateTimeConverter = () => {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'timestamp' | 'datetime' | 'iso'>('timestamp');
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const convert = () => {
    if (!input.trim()) {
      showToast('Please enter a date/time', 'error');
      return;
    }

    let date: Date | null = null;

    try {
      if (inputType === 'timestamp') {
        const ts = parseInt(input);
        if (isNaN(ts)) throw new Error('Invalid timestamp');
        date = new Date(ts * 1000);
      } else if (inputType === 'iso') {
        date = new Date(input);
      } else {
        date = new Date(input);
      }

      if (isNaN(date.getTime())) throw new Error('Invalid date');

      const timestamp = Math.floor(date.getTime() / 1000);
      const iso = date.toISOString();
      const local = date.toLocaleString();
      const utc = date.toUTCString();
      const unix = date.getTime();

      setOutputs({
        'Unix Timestamp (seconds)': timestamp.toString(),
        'Unix Timestamp (milliseconds)': unix.toString(),
        'ISO 8601': iso,
        'Local String': local,
        'UTC String': utc,
        'Date Only': date.toLocaleDateString(),
        'Time Only': date.toLocaleTimeString(),
      });

      showToast('Converted successfully');
    } catch (err) {
      showToast('Invalid date/time format', 'error');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconClock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Date/Time Converter
          </h1>
          <p className="text-muted-foreground">Convert between date/time formats</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Input Type</label>
            <select
              value={inputType}
              onChange={(e) => {
                setInputType(e.target.value as any);
                setOutputs({});
              }}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="timestamp">Unix Timestamp</option>
              <option value="datetime">Date/Time String</option>
              <option value="iso">ISO 8601</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Input</label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setOutputs({});
              }}
              placeholder={inputType === 'timestamp' ? '1699123456' : '2024-01-01 12:00:00'}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>

          <button
            onClick={convert}
            disabled={!input.trim()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Convert
          </button>

          {Object.keys(outputs).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Output Formats</h3>
              {Object.entries(outputs).map(([label, value]) => (
                <div key={label} className="bg-background/50 rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <button
                      onClick={() => handleCopy(value)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                      title="Copy"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-1 font-mono text-sm break-all">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
