import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconHash, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

type Base = 2 | 8 | 10 | 16;

export const NumberBaseConverter = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const convert = (value: string, from: Base): Record<string, string> => {
    let decimal: number;

    try {
      if (from === 10) {
        decimal = parseInt(value, 10);
      } else if (from === 2) {
        decimal = parseInt(value, 2);
      } else if (from === 8) {
        decimal = parseInt(value, 8);
      } else {
        decimal = parseInt(value, 16);
      }

      if (isNaN(decimal)) throw new Error('Invalid number');

      return {
        Binary: decimal.toString(2),
        Octal: decimal.toString(8),
        Decimal: decimal.toString(10),
        Hexadecimal: decimal.toString(16).toUpperCase(),
      };
    } catch {
      throw new Error('Invalid number for selected base');
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      showToast('Please enter a number', 'error');
      return;
    }

    try {
      const result = convert(input, fromBase);
      setOutputs(result);
      showToast('Converted successfully');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Conversion failed', 'error');
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
            <IconHash className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Number Base Converter
          </h1>
          <p className="text-muted-foreground">Convert between binary, octal, decimal, and hexadecimal</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">From Base</label>
            <select
              value={fromBase}
              onChange={(e) => {
                setFromBase(parseInt(e.target.value) as Base);
                setOutputs({});
              }}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value={2}>Binary (2)</option>
              <option value={8}>Octal (8)</option>
              <option value={10}>Decimal (10)</option>
              <option value={16}>Hexadecimal (16)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Input Number</label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setOutputs({});
              }}
              placeholder={fromBase === 2 ? '1010' : fromBase === 8 ? '12' : fromBase === 10 ? '10' : 'A'}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Convert
          </button>

          {Object.keys(outputs).length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(outputs).map(([base, value]) => (
                <div key={base} className="bg-background/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{base}</span>
                    <button
                      onClick={() => handleCopy(value)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                      title="Copy"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-mono text-lg break-all">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
