import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconPalette, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

const generatePalette = (baseColor: string): string[] => {
  // Simple palette generation - in production, use a proper color theory library
  const colors: string[] = [baseColor];
  
  // Generate complementary and analogous colors
  // This is a simplified version
  for (let i = 1; i < 5; i++) {
    const hue = (parseInt(baseColor.slice(1, 3), 16) + i * 30) % 360;
    const hex = `#${hue.toString(16).padStart(2, '0')}${baseColor.slice(3, 5)}${baseColor.slice(5, 7)}`;
    colors.push(hex);
  }
  
  return colors;
};

export const ColorPalette = () => {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [palette, setPalette] = useState<string[]>([]);
  const { showToast } = useToast();

  const handleGenerate = () => {
    const newPalette = generatePalette(baseColor);
    setPalette(newPalette);
    showToast('Palette generated');
  };

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconPalette className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Color Palette Generator
          </h1>
          <p className="text-muted-foreground">Generate color palettes from a base color</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Base Color</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-20 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer"
          >
            Generate Palette
          </button>

          {palette.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {palette.map((color, idx) => (
                <div key={idx} className="space-y-2">
                  <div
                    className="w-full h-24 rounded-lg border-2 border-border cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handleCopy(color)}
                  />
                  <div className="text-center">
                    <div className="font-mono text-xs break-all">{color}</div>
                    <button
                      onClick={() => handleCopy(color)}
                      className="mt-1 p-1 hover:bg-muted rounded transition-colors cursor-pointer"
                      title="Copy"
                    >
                      <IconCopy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
