import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Unique Owner Passcode
    if (passcode.trim() === 'foxadmin2026' || passcode.trim() === 'admin' || passcode.trim() === '7788') {
      onUnlockSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#131921] border border-[#f68b1e]/40 rounded-xl p-6 shadow-2xl text-white space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-[#f68b1e]/20 border border-[#f68b1e] flex items-center justify-center mx-auto text-[#f68b1e]">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-bold text-base text-white">Owner Security Gate</h3>
          <p className="text-xs text-gray-400">
            This administration gateway is restricted and hidden from public visitors. Enter your master authorization key.
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded bg-red-950/40 border border-red-900 text-red-300 text-xs text-center font-medium">
            Invalid Master Key. Access Denied.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              placeholder="Master Passcode (default: foxadmin2026)"
              className="w-full bg-[#232f3e] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#f68b1e]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-xs font-semibold text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#f68b1e] hover:bg-[#e07b16] py-2 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Unlock Console
            </button>
          </div>
        </form>

        <p className="text-[10px] text-gray-500 text-center font-mono">
          Hint: Enter &quot;foxadmin2026&quot; or &quot;admin&quot;
        </p>
      </div>
    </div>
  );
};
