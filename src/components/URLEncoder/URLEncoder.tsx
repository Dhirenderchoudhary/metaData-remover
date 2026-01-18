import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconLink, IconCopy, IconArrowsExchange } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const URLEncoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { showToast } = useToast();

  const handleEncode = () => {
    if (!input.trim()) {
      showToast('Please enter text to encode', 'error');
      return;
    }
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      showToast('Encoded successfully');
    } catch (err) {
      showToast('Failed to encode', 'error');
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      showToast('Please enter text to decode', 'error');
      return;
    }
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      showToast('Decoded successfully');
    } catch (err) {
      showToast('Failed to decode. Invalid encoded string.', 'error');
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
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
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconLink className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            URL Encoder/Decoder
          </h1>
          <p className="text-muted-foreground">
            Encode or decode URL strings. All processing happens locally.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setMode('encode');
                setOutput('');
              }}
              className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                mode === 'encode'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IconArrowsExchange className="w-5 h-5" />
                <span className="font-semibold">Encode</span>
              </div>
            </button>
            <button
              onClick={() => {
                setMode('decode');
                setOutput('');
              }}
              className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                mode === 'decode'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IconArrowsExchange className="w-5 h-5 rotate-180" />
                <span className="font-semibold">Decode</span>
              </div>
            </button>
          </div>

          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {mode === 'encode' ? 'Text to Encode' : 'Encoded Text to Decode'}
              </label>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setOutput('');
                  }}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter encoded URL string...'}
                  className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
                  spellCheck={false}
                />
                {input && (
                  <button
                    onClick={() => handleCopy(input)}
                    className="absolute top-2 right-2 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                    title="Copy input"
                  >
                    <IconCopy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={!input.trim()}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>

            {/* Output */}
            {output && (
              <div>
                <label className="block text-sm font-medium mb-2">Result</label>
                <div className="relative">
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-32 px-4 py-3 bg-muted/30 border border-border rounded-xl font-mono text-sm resize-none"
                    spellCheck={false}
                  />
                  <button
                    onClick={() => handleCopy(output)}
                    className="absolute top-2 right-2 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                    title="Copy output"
                  >
                    <IconCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
