import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconShield, IconCheck, IconX } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  feedback: string[];
}

export const PasswordStrength = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<StrengthResult | null>(null);
  const { showToast } = useToast();

  const calculateStrength = (pwd: string): StrengthResult => {
    let score = 0;
    const feedback: string[] = [];

    if (pwd.length === 0) {
      return { score: 0, label: 'Empty', color: 'text-muted-foreground', feedback: [] };
    }

    // Length checks
    if (pwd.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 0.5;

    // Character variety
    if (/[a-z]/.test(pwd)) score += 0.5;
    else feedback.push('Add lowercase letters');
    if (/[A-Z]/.test(pwd)) score += 0.5;
    else feedback.push('Add uppercase letters');
    if (/[0-9]/.test(pwd)) score += 0.5;
    else feedback.push('Add numbers');
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 0.5;
    else feedback.push('Add special characters (!@#$%^&*)');

    // Common patterns (negative)
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 0.5;
      feedback.push('Avoid repeating characters');
    }
    if (/123|abc|qwe|password/i.test(pwd)) {
      score -= 1;
      feedback.push('Avoid common sequences');
    }
    if (/password|123456|qwerty/i.test(pwd)) {
      score -= 2;
      feedback.push('Avoid common passwords');
    }

    score = Math.max(0, Math.min(4, Math.round(score)));

    let label: string;
    let color: string;

    if (score === 0) {
      label = 'Very Weak';
      color = 'text-red-500';
    } else if (score === 1) {
      label = 'Weak';
      color = 'text-orange-500';
    } else if (score === 2) {
      label = 'Fair';
      color = 'text-yellow-500';
    } else if (score === 3) {
      label = 'Good';
      color = 'text-blue-500';
    } else {
      label = 'Strong';
      color = 'text-emerald-500';
    }

    return { score, label, color, feedback };
  };

  const handleAnalyze = () => {
    if (!password.trim()) {
      showToast('Please enter a password', 'error');
      return;
    }
    const result = calculateStrength(password);
    setStrength(result);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconShield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Password Strength Checker
          </h1>
          <p className="text-muted-foreground">
            Analyze your password strength and get improvement suggestions
          </p>
        </div>

        {/* Input */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value) {
                setStrength(calculateStrength(e.target.value));
              } else {
                setStrength(null);
              }
            }}
            placeholder="Enter password to analyze..."
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={!password.trim()}
            className="mt-4 w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Analyze Password
          </button>
        </div>

        {/* Results */}
        {strength && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Strength: <span className={strength.color}>{strength.label}</span></h2>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-2 rounded-full ${
                      i < strength.score
                        ? strength.color.replace('text-', 'bg-')
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Length</p>
                <p className="text-lg font-semibold">{password.length}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Has Uppercase</p>
                <p className="text-lg font-semibold">
                  {/[A-Z]/.test(password) ? (
                    <IconCheck className="w-5 h-5 text-emerald-500 inline" />
                  ) : (
                    <IconX className="w-5 h-5 text-red-500 inline" />
                  )}
                </p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Has Numbers</p>
                <p className="text-lg font-semibold">
                  {/[0-9]/.test(password) ? (
                    <IconCheck className="w-5 h-5 text-emerald-500 inline" />
                  ) : (
                    <IconX className="w-5 h-5 text-red-500 inline" />
                  )}
                </p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Has Symbols</p>
                <p className="text-lg font-semibold">
                  {/[^a-zA-Z0-9]/.test(password) ? (
                    <IconCheck className="w-5 h-5 text-emerald-500 inline" />
                  ) : (
                    <IconX className="w-5 h-5 text-red-500 inline" />
                  )}
                </p>
              </div>
            </div>

            {/* Feedback */}
            {strength.feedback.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Suggestions:</h3>
                <ul className="space-y-1">
                  {strength.feedback.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <IconX className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {strength.feedback.length === 0 && strength.score >= 3 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-500">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-5 h-5" />
                  <span className="font-semibold">Great password! Keep it secure.</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
