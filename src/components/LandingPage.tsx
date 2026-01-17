import { Shield, FileText, ArrowRight, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onNavigate: (page: 'home' | 'builder') => void; // 'home' is Metadata Remover
}

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Client-side Only • No Data Leaves Your Device
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Privacy & <br />
          <span className="text-zinc-400">Productivity.</span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Securely remove metadata from your files or design custom fillable PDF forms instantly. All processing happens 100% in your browser.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Metadata Remover Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onNavigate('home')}
          className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all cursor-pointer hover:bg-zinc-900 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Metadata Remover</h3>
            <p className="text-zinc-400 mb-8 min-h-[3rem]">
              Strip hidden EXIF, GPS, and device data from photos and PDFs instantly.
            </p>
            
            <div className="flex items-center text-white font-medium group-hover:gap-2 transition-all">
              Clean Files <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </motion.div>

        {/* Form Builder Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onNavigate('builder')}
          className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all cursor-pointer hover:bg-zinc-900 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">PDF Form Builder</h3>
            <p className="text-zinc-400 mb-8 min-h-[3rem]">
              Drag & drop to create professional, fillable PDF forms with text, checkboxes, and signatures.
            </p>
            
            <div className="flex items-center text-white font-medium group-hover:gap-2 transition-all">
              Build Form <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-16 flex items-center gap-8 opacity-50"
      >
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <Lock className="w-4 h-4" /> Secure
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <Zap className="w-4 h-4" /> Fast
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
           Free & Open Source
        </div>
      </motion.div>
    </div>
  );
};
