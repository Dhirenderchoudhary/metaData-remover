import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconCalculator, IconBackspace, IconRefresh } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const { showToast } = useToast();

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          showToast('Cannot divide by zero', 'error');
          return firstValue;
        }
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    
    // Format large numbers with commas
    if (Math.abs(num) >= 1e9) {
      return num.toExponential(6);
    }
    
    // Format with commas for readability
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const Button = ({ 
    onClick, 
    children, 
    className = '', 
    wide = false 
  }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    className?: string;
    wide?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`${wide ? 'col-span-2' : ''} h-16 rounded-xl font-semibold text-lg transition-all active:scale-95 hover:opacity-90 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconCalculator className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Calculator
          </h1>
          <p className="text-muted-foreground">
            Simple and powerful calculator
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          {/* Display */}
          <div className="bg-background border border-border rounded-xl p-6 mb-6 min-h-[100px] flex items-end justify-end">
            <div className="text-right w-full">
              <div className="text-sm text-muted-foreground mb-1 h-5">
                {previousValue !== null && operation && (
                  <span>{formatDisplay(String(previousValue))} {operation}</span>
                )}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground break-all overflow-x-auto">
                {formatDisplay(display)}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button onClick={clear} className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <IconRefresh className="w-5 h-5 mx-auto" />
            </Button>
            <Button onClick={handleBackspace} className="bg-secondary text-foreground hover:bg-secondary/80">
              <IconBackspace className="w-5 h-5 mx-auto" />
            </Button>
            <Button onClick={() => performOperation('÷')} className="bg-primary/10 text-primary hover:bg-primary/20">
              ÷
            </Button>
            <Button onClick={() => performOperation('×')} className="bg-primary/10 text-primary hover:bg-primary/20">
              ×
            </Button>

            {/* Row 2 */}
            <Button onClick={() => inputNumber('7')} className="bg-secondary text-foreground hover:bg-secondary/80">
              7
            </Button>
            <Button onClick={() => inputNumber('8')} className="bg-secondary text-foreground hover:bg-secondary/80">
              8
            </Button>
            <Button onClick={() => inputNumber('9')} className="bg-secondary text-foreground hover:bg-secondary/80">
              9
            </Button>
            <Button onClick={() => performOperation('-')} className="bg-primary/10 text-primary hover:bg-primary/20">
              −
            </Button>

            {/* Row 3 */}
            <Button onClick={() => inputNumber('4')} className="bg-secondary text-foreground hover:bg-secondary/80">
              4
            </Button>
            <Button onClick={() => inputNumber('5')} className="bg-secondary text-foreground hover:bg-secondary/80">
              5
            </Button>
            <Button onClick={() => inputNumber('6')} className="bg-secondary text-foreground hover:bg-secondary/80">
              6
            </Button>
            <Button onClick={() => performOperation('+')} className="bg-primary/10 text-primary hover:bg-primary/20">
              +
            </Button>

            {/* Row 4 */}
            <Button onClick={() => inputNumber('1')} className="bg-secondary text-foreground hover:bg-secondary/80">
              1
            </Button>
            <Button onClick={() => inputNumber('2')} className="bg-secondary text-foreground hover:bg-secondary/80">
              2
            </Button>
            <Button onClick={() => inputNumber('3')} className="bg-secondary text-foreground hover:bg-secondary/80">
              3
            </Button>
            <Button onClick={handleEquals} className="bg-primary text-primary-foreground hover:opacity-90 row-span-2">
              =
            </Button>

            {/* Row 5 */}
            <Button onClick={() => inputNumber('0')} wide className="bg-secondary text-foreground hover:bg-secondary/80">
              0
            </Button>
            <Button onClick={inputDecimal} className="bg-secondary text-foreground hover:bg-secondary/80">
              .
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
