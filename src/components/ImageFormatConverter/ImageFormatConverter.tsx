import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconPhoto, IconDownload } from '@tabler/icons-react';
import { FileUpload } from '../ui/file-upload';
import { useToast } from '../ui/toast';

type Format = 'png' | 'jpeg' | 'webp';

export const ImageFormatConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setConvertedUrl(null);
    }
  };

  const handleConvert = () => {
    if (!file) {
      showToast('Please select an image', 'error');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
        canvas.toBlob((blob) => {
          if (blob) {
            setConvertedUrl(URL.createObjectURL(blob));
            showToast('Image converted successfully');
          }
        }, mimeType);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${format}`;
    a.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconPhoto className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Image Format Converter
          </h1>
          <p className="text-muted-foreground">Convert images between PNG, JPEG, and WebP</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          {!file ? (
            <FileUpload onChange={handleFileSelect} isProcessing={false} />
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Target Format</label>
                <div className="flex gap-4">
                  {(['png', 'jpeg', 'webp'] as Format[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFormat(f);
                        setConvertedUrl(null);
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer uppercase ${
                        format === f
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConvert}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer"
              >
                Convert Image
              </button>

              {convertedUrl && (
                <div className="space-y-4">
                  <img src={convertedUrl} alt="Converted" className="w-full rounded-lg border border-border" />
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-3 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <IconDownload className="w-5 h-5" />
                    Download Converted Image
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
