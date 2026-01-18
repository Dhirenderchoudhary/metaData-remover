import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconBarcode, IconDownload, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const BarcodeGenerator = () => {
  const [text, setText] = useState('');
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const generateBarcode = () => {
    if (!text.trim()) {
      showToast('Please enter text to encode', 'error');
      return;
    }

    // Using a simple barcode-like visualization
    // For production, use a library like JsBarcode: npm install jsbarcode
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Simple barcode pattern
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const barWidth = (charCode % 3) + 1;
        const x = (i * 20) + 10;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, 20, barWidth, 60);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          setBarcodeUrl(URL.createObjectURL(blob));
          showToast('Barcode generated');
        }
      }, 'image/png');
    }
  };

  const handleDownload = () => {
    if (!barcodeUrl) return;
    const a = document.createElement('a');
    a.href = barcodeUrl;
    a.download = 'barcode.png';
    a.click();
  };

  const handleCopy = () => {
    if (barcodeUrl) {
      fetch(barcodeUrl)
        .then((res) => res.blob())
        .then((blob) => {
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          showToast('Barcode copied to clipboard');
        });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconBarcode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Barcode Generator
          </h1>
          <p className="text-muted-foreground">Generate barcodes from text</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Text to Encode</label>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setBarcodeUrl(null);
              }}
              placeholder="Enter text to generate barcode..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>

          <button
            onClick={generateBarcode}
            disabled={!text.trim()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Generate Barcode
          </button>

          {barcodeUrl && (
            <div className="space-y-4">
              <div className="bg-background border border-border rounded-lg p-4 flex justify-center">
                <img src={barcodeUrl} alt="Barcode" className="max-w-full" />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconDownload className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconCopy className="w-5 h-5" />
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
