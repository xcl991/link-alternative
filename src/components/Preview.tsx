'use client';

import { forwardRef } from 'react';
import { Camera, Download, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebsiteOption, RTPStyle, TextRow } from '@/types';

interface PreviewProps {
  selectedWebsite: WebsiteOption;
  selectedStyle: RTPStyle;
  selectedBackground: string;
  headerTitle: string;
  text1: string;
  text2: string;
  additionalTexts: TextRow[];
  telegramFooter: string;

  // Screenshot actions
  onPrepareImage: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onShare: () => void;
  browserCapabilities: {
    clipboard: boolean;
    webShare: boolean;
    html2canvas: boolean;
  };
  isImageReady: boolean;
  isProcessing: boolean;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({
  selectedWebsite,
  selectedStyle,
  selectedBackground,
  headerTitle,
  text1,
  text2,
  additionalTexts,
  telegramFooter,
  onPrepareImage,
  onDownload,
  onCopy,
  onShare,
  browserCapabilities,
  isImageReady,
  isProcessing,
}, ref) => {
  // Combine all texts
  const allTexts = [text1, text2, ...additionalTexts.map(t => t.text)].filter(t => t.trim() !== '');

  return (
    <div className="relative">
      {/* Preview Container */}
      <div
        ref={ref}
        className="relative overflow-hidden rounded-lg"
        style={{
          backgroundImage: `url("${selectedBackground}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: selectedStyle.backgroundColor,
          minHeight: '400px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Overlay for better text visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${selectedStyle.backgroundColor}99 0%, ${selectedStyle.backgroundColor}CC 50%, ${selectedStyle.backgroundColor}99 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 min-h-[400px]">
          {/* Logo (Header 1) */}
          <div className="mb-6">
            <img
              src={selectedWebsite.logo}
              alt={selectedWebsite.name}
              className="h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))',
              }}
            />
          </div>

          {/* Header Title (Header 2) */}
          {headerTitle && (
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 tracking-wider"
              style={{
                color: selectedStyle.primaryColor,
                textShadow: `0 0 20px ${selectedStyle.primaryColor}80, 0 0 40px ${selectedStyle.primaryColor}40`,
              }}
            >
              {headerTitle}
            </h1>
          )}

          {/* Text Lines Container */}
          <div className="w-full max-w-lg space-y-3">
            {allTexts.map((text, idx) => (
              <div
                key={idx}
                className="px-6 py-3 rounded-lg text-center font-semibold text-lg md:text-xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${selectedStyle.accentColor}CC 0%, ${selectedStyle.accentColor}99 100%)`,
                  border: `2px solid ${selectedStyle.primaryColor}60`,
                  color: selectedStyle.secondaryColor,
                  boxShadow: `0 4px 15px ${selectedStyle.primaryColor}30, inset 0 1px 0 ${selectedStyle.primaryColor}30`,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Telegram Footer */}
          {telegramFooter && (
            <div className="mt-8 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill={selectedStyle.primaryColor}
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span
                className="text-lg font-semibold"
                style={{
                  color: selectedStyle.primaryColor,
                  textShadow: `0 0 10px ${selectedStyle.primaryColor}60`,
                }}
              >
                {telegramFooter}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div
        className="absolute bottom-4 right-4 flex gap-2"
        data-screenshot-ignore="true"
      >
        {!isImageReady ? (
          <Button
            onClick={onPrepareImage}
            disabled={isProcessing}
            className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Screenshot
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              onClick={onDownload}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            {browserCapabilities.clipboard && (
              <Button
                onClick={onCopy}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            )}
            {browserCapabilities.webShare && (
              <Button
                onClick={onShare}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
