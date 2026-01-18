import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconArrowsExchange } from '@tabler/icons-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume';

const conversions: Record<UnitCategory, Record<string, { toBase: number; fromBase: number }>> = {
  length: {
    meter: { toBase: 1, fromBase: 1 },
    kilometer: { toBase: 1000, fromBase: 0.001 },
    centimeter: { toBase: 0.01, fromBase: 100 },
    millimeter: { toBase: 0.001, fromBase: 1000 },
    inch: { toBase: 0.0254, fromBase: 39.3701 },
    foot: { toBase: 0.3048, fromBase: 3.28084 },
    yard: { toBase: 0.9144, fromBase: 1.09361 },
    mile: { toBase: 1609.34, fromBase: 0.000621371 },
  },
  weight: {
    kilogram: { toBase: 1, fromBase: 1 },
    gram: { toBase: 0.001, fromBase: 1000 },
    pound: { toBase: 0.453592, fromBase: 2.20462 },
    ounce: { toBase: 0.0283495, fromBase: 35.274 },
    ton: { toBase: 1000, fromBase: 0.001 },
  },
  temperature: {
    celsius: { toBase: 1, fromBase: 1 },
    fahrenheit: { toBase: 1, fromBase: 1 },
    kelvin: { toBase: 1, fromBase: 1 },
  },
  volume: {
    liter: { toBase: 1, fromBase: 1 },
    milliliter: { toBase: 0.001, fromBase: 1000 },
    gallon: { toBase: 3.78541, fromBase: 0.264172 },
    quart: { toBase: 0.946353, fromBase: 1.05669 },
    pint: { toBase: 0.473176, fromBase: 2.11338 },
    cup: { toBase: 0.236588, fromBase: 4.22675 },
  },
};

export const UnitConverter = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const convert = (value: number, from: string, to: string, cat: UnitCategory): number => {
    if (cat === 'temperature') {
      if (from === 'celsius' && to === 'fahrenheit') return (value * 9) / 5 + 32;
      if (from === 'fahrenheit' && to === 'celsius') return ((value - 32) * 5) / 9;
      if (from === 'celsius' && to === 'kelvin') return value + 273.15;
      if (from === 'kelvin' && to === 'celsius') return value - 273.15;
      if (from === 'fahrenheit' && to === 'kelvin') return ((value - 32) * 5) / 9 + 273.15;
      if (from === 'kelvin' && to === 'fahrenheit') return ((value - 273.15) * 9) / 5 + 32;
      return value;
    }

    const fromConv = conversions[cat][from];
    const toConv = conversions[cat][to];
    if (!fromConv || !toConv) return value;

    const baseValue = value * fromConv.toBase;
    return baseValue * toConv.fromBase;
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    if (value && !isNaN(parseFloat(value))) {
      const result = convert(parseFloat(value), fromUnit, toUnit, category);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setToValue('');
    }
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    if (value && !isNaN(parseFloat(value))) {
      const result = convert(parseFloat(value), toUnit, fromUnit, category);
      setFromValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setFromValue('');
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    const tempVal = fromValue;
    setFromValue(toValue);
    setToValue(tempVal);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconArrowsExchange className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Unit Converter
          </h1>
          <p className="text-muted-foreground">Convert between different units</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div className="flex gap-4 flex-wrap">
            {(['length', 'weight', 'temperature', 'volume'] as UnitCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  const units = Object.keys(conversions[cat]);
                  setFromUnit(units[0]);
                  setToUnit(units[1] || units[0]);
                  setFromValue('');
                  setToValue('');
                }}
                className={`px-4 py-2 rounded-lg border-2 transition-all capitalize cursor-pointer ${
                  category === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => handleFromChange(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
              <select
                value={fromUnit}
                onChange={(e) => {
                  setFromUnit(e.target.value);
                  if (fromValue) handleFromChange(fromValue);
                }}
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {Object.keys(conversions[category]).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapUnits}
              className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors cursor-pointer"
              title="Swap units"
            >
              <IconArrowsExchange className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <input
                type="number"
                value={toValue}
                onChange={(e) => handleToChange(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
              <select
                value={toUnit}
                onChange={(e) => {
                  setToUnit(e.target.value);
                  if (fromValue) handleFromChange(fromValue);
                }}
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {Object.keys(conversions[category]).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
