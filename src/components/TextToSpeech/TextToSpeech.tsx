import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconSpeakerphone, IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { showToast } = useToast();

  const handleSpeak = () => {
    if (!text.trim()) {
      showToast('Please enter text to speak', 'error');
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        showToast('Speech synthesis failed', 'error');
      };

      window.speechSynthesis.speak(utterance);
      showToast('Speaking...');
    } else {
      showToast('Speech synthesis not supported', 'error');
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconSpeakerphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Text to Speech
          </h1>
          <p className="text-muted-foreground">Convert text to speech using browser API</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to speak..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rate: {rate.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pitch: {pitch.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={isSpeaking ? handleStop : handleSpeak}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSpeaking ? (
                <>
                  <IconPlayerPause className="w-5 h-5" />
                  Stop
                </>
              ) : (
                <>
                  <IconPlayerPlay className="w-5 h-5" />
                  Speak
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
