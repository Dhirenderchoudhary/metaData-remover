import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconDeviceDesktop, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const BrowserInfo = () => {
  const [info, setInfo] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    const browserInfo: Record<string, string> = {
      'User Agent': navigator.userAgent,
      'Platform': navigator.platform,
      'Language': navigator.language,
      'Languages': navigator.languages?.join(', ') || '',
      'Cookie Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
      'Online Status': navigator.onLine ? 'Online' : 'Offline',
      'Screen Width': `${window.screen.width}px`,
      'Screen Height': `${window.screen.height}px`,
      'Window Width': `${window.innerWidth}px`,
      'Window Height': `${window.innerHeight}px`,
      'Color Depth': `${screen.colorDepth} bits`,
      'Pixel Ratio': window.devicePixelRatio?.toString() || 'N/A',
      'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Timezone Offset': `${new Date().getTimezoneOffset()} minutes`,
    };

    setInfo(browserInfo);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  const copyAll = () => {
    const allText = Object.entries(info)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    handleCopy(allText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconDeviceDesktop className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Browser Info
          </h1>
          <p className="text-muted-foreground">Display browser and device information</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">System Information</h2>
            <button
              onClick={copyAll}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm"
            >
              <IconCopy className="w-4 h-4" />
              Copy All
            </button>
          </div>
          <div className="space-y-3">
            {Object.entries(info).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between p-3 bg-background/50 rounded-lg border border-border">
                <span className="text-sm font-medium text-muted-foreground">{key}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm text-foreground text-right break-all max-w-md">{value}</span>
                  <button
                    onClick={() => handleCopy(value)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy"
                  >
                    <IconCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
