import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconCode, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

interface Match {
  match: string;
  index: number;
  groups: string[];
}

export const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({ global: true, ignoreCase: false, multiline: false });
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const testRegex = () => {
    setError(null);
    setMatches([]);

    if (!pattern.trim()) {
      showToast('Please enter a regex pattern', 'error');
      return;
    }

    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';

      const regex = new RegExp(pattern, flagString);
      const testMatches: Match[] = [];
      let match;

      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          testMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          testMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(testMatches);
      if (testMatches.length === 0) {
        showToast('No matches found');
      } else {
        showToast(`Found ${testMatches.length} match(es)`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid regex pattern';
      setError(errorMsg);
      showToast('Invalid regex pattern', 'error');
    }
  };

  const highlightMatches = (text: string, matches: Match[]): React.ReactNode[] => {
    if (matches.length === 0) return [<span key="text">{text}</span>];

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>{text.substring(lastIndex, match.index)}</span>
        );
      }
      parts.push(
        <mark
          key={`match-${idx}`}
          className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded"
        >
          {match.match}
        </mark>
      );
      lastIndex = match.index + match.match.length;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Regex Tester
          </h1>
          <p className="text-muted-foreground">
            Test regular expressions with sample text
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          {/* Pattern */}
          <div>
            <label className="block text-sm font-medium mb-2">Regular Expression Pattern</label>
            <div className="relative">
              <input
                type="text"
                value={pattern}
                onChange={(e) => {
                  setPattern(e.target.value);
                  setError(null);
                  setMatches([]);
                }}
                placeholder="/pattern/flags or just pattern"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
              {pattern && (
                <button
                  onClick={() => handleCopy(pattern)}
                  className="absolute top-2 right-2 p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  title="Copy pattern"
                >
                  <IconCopy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Flags */}
          <div>
            <label className="block text-sm font-medium mb-2">Flags</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.global}
                  onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Global (g)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.ignoreCase}
                  onChange={(e) => setFlags({ ...flags, ignoreCase: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Ignore Case (i)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.multiline}
                  onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Multiline (m)</span>
              </label>
            </div>
          </div>

          {/* Test String */}
          <div>
            <label className="block text-sm font-medium mb-2">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => {
                setTestString(e.target.value);
                setMatches([]);
              }}
              placeholder="Enter text to test against the regex pattern..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>

          <button
            onClick={testRegex}
            disabled={!pattern.trim()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Test Regex
          </button>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Results */}
          {matches.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Matches ({matches.length})</h3>
              <div className="bg-background border border-border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                {matches.map((match, idx) => (
                  <div key={idx} className="p-2 bg-muted/50 rounded text-sm">
                    <div className="font-mono">
                      <span className="text-muted-foreground">Match {idx + 1}:</span>{' '}
                      <span className="font-semibold">{match.match}</span>
                      <span className="text-muted-foreground ml-2">at index {match.index}</span>
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Groups: {match.groups.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlighted Text */}
          {matches.length > 0 && testString && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Highlighted Text</h3>
              <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm">
                {highlightMatches(testString, matches)}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
