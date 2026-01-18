import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconFileText, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export const LoremIpsum = () => {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');
  const { showToast } = useToast();

  const generateWords = (n: number): string => {
    const words: string[] = [];
    for (let i = 0; i < n; i++) {
      words.push(loremWords[i % loremWords.length]);
    }
    return words.join(' ');
  };

  const generateSentences = (n: number): string => {
    const sentences: string[] = [];
    for (let i = 0; i < n; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 5;
      const words = generateWords(wordCount);
      sentences.push(words.charAt(0).toUpperCase() + words.slice(1) + '.');
    }
    return sentences.join(' ');
  };

  const generateParagraphs = (n: number): string => {
    const paragraphs: string[] = [];
    for (let i = 0; i < n; i++) {
      const sentenceCount = Math.floor(Math.random() * 3) + 2;
      paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join('\n\n');
  };

  const handleGenerate = () => {
    let result = '';
    if (type === 'words') {
      result = generateWords(count);
    } else if (type === 'sentences') {
      result = generateSentences(count);
    } else {
      result = generateParagraphs(count);
    }
    setOutput(result);
    showToast('Generated successfully');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconFileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Lorem Ipsum Generator
          </h1>
          <p className="text-muted-foreground">Generate placeholder text</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div className="flex gap-4">
            {(['words', 'sentences', 'paragraphs'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setOutput('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer capitalize ${
                  type === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="100"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer"
          >
            Generate
          </button>

          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Output</label>
                <button onClick={handleCopy} className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer" title="Copy">
                  <IconCopy className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-64 px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm resize-none"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
