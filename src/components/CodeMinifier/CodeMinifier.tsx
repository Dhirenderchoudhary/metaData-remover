import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconCode, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

type CodeType = 'javascript' | 'css' | 'html';

export const CodeMinifier = () => {
  const [codeType, setCodeType] = useState<CodeType>('javascript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { showToast } = useToast();

  const minify = (code: string, type: CodeType): string => {
    let minified = code;

    // Remove comments
    if (type === 'javascript') {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
      minified = minified.replace(/\/\/.*$/gm, '');
    } else if (type === 'css') {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    } else if (type === 'html') {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove extra whitespace
    minified = minified.replace(/\s+/g, ' ');
    minified = minified.replace(/\s*([{}:;,])\s*/g, '$1');
    minified = minified.trim();

    return minified;
  };

  const handleMinify = () => {
    if (!input.trim()) {
      showToast('Please enter code to minify', 'error');
      return;
    }
    const minified = minify(input, codeType);
    setOutput(minified);
    showToast('Code minified successfully');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Code Minifier
          </h1>
          <p className="text-muted-foreground">Minify JavaScript, CSS, and HTML</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div className="flex gap-4">
            {(['javascript', 'css', 'html'] as CodeType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setCodeType(type);
                  setOutput('');
                }}
                className={`px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                  codeType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Input</label>
                {input && (
                  <button onClick={() => handleCopy(input)} className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer" title="Copy">
                    <IconCopy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOutput('');
                }}
                className="w-full h-96 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
                spellCheck={false}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Minified Output</label>
                {output && (
                  <button onClick={() => handleCopy(output)} className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer" title="Copy">
                    <IconCopy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-96 px-4 py-3 bg-muted/30 border border-border rounded-xl font-mono text-sm resize-none"
                spellCheck={false}
              />
            </div>
          </div>

          <button
            onClick={handleMinify}
            disabled={!input.trim()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Minify Code
          </button>
        </div>
      </motion.div>
    </div>
  );
};
