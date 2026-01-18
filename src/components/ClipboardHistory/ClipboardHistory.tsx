import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconClipboard, IconCopy, IconTrash } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
}

export const ClipboardHistory = () => {
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('clipboardHistory');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handlePaste = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const newItem: ClipboardItem = {
            id: Date.now().toString(),
            text,
            timestamp: Date.now(),
          };
          const updated = [newItem, ...items.filter((i) => i.text !== text)].slice(0, 50);
          setItems(updated);
          localStorage.setItem('clipboardHistory', JSON.stringify(updated));
        }
      } catch (err) {
        // Clipboard API may not be available
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [items]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem('clipboardHistory', JSON.stringify(updated));
    showToast('Item deleted');
  };

  const handleClear = () => {
    setItems([]);
    localStorage.removeItem('clipboardHistory');
    showToast('History cleared');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconClipboard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Clipboard History
          </h1>
          <p className="text-muted-foreground">Store and manage clipboard items</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">History ({items.length})</h2>
            {items.length > 0 && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors cursor-pointer text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <IconClipboard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No clipboard history yet</p>
              <p className="text-sm mt-1">Copy something to see it here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start justify-between p-3 bg-background/50 rounded-lg border border-border hover:bg-background transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-sm font-mono break-all">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(item.text)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        title="Copy"
                      >
                        <IconCopy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
