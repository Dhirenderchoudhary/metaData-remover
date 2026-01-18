import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconPalette, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

export const ColorPicker = () => {
  const [color, setColor] = useState('#3b82f6');
  const [formats, setFormats] = useState<ColorFormats | null>(null);
  const { showToast } = useToast();

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  const updateFormats = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setFormats({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateFormats(newColor);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  useEffect(() => {
    updateFormats(color);
  }, [color]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconPalette className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Color Picker & Converter
          </h1>
          <p className="text-muted-foreground">
            Pick colors and convert between formats
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          {/* Color Picker */}
          <div className="flex items-center gap-4">
            <div
              className="w-32 h-32 rounded-xl border-2 border-border shadow-lg"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Color Picker</label>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setColor(val);
                    updateFormats(val);
                  } else {
                    setColor(val);
                  }
                }}
                className="mt-2 w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Formats */}
          {formats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formats).map(([format, value]) => (
                <div key={format} className="bg-background/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium uppercase">{format}</span>
                    <button
                      onClick={() => handleCopy(value)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                      title="Copy"
                    >
                      <IconCopy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
