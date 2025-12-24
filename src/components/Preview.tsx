'use client';

import { forwardRef } from 'react';
import { Camera, Download, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebsiteOption, RTPStyle, TextRow, LayoutOption } from '@/types';

interface PreviewProps {
  selectedWebsite: WebsiteOption;
  selectedStyle: RTPStyle;
  selectedBackground: string;
  selectedLayout: LayoutOption;
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

// Telegram Icon Component
const TelegramIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({
  selectedWebsite,
  selectedStyle,
  selectedBackground,
  selectedLayout,
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

  // Render layout based on selection
  const renderLayout = () => {
    switch (selectedLayout.id) {
      case 'neon-glow':
        return <NeonGlowLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      case 'cyber-frame':
        return <CyberFrameLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      case 'golden-luxury':
        return <GoldenLuxuryLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      case 'matrix':
        return <MatrixLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      case 'holographic':
        return <HolographicLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      case 'glassmorphism':
        return <GlassmorphismLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      case 'retro-arcade':
        return <RetroArcadeLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
      default:
        return <ClassicLayout
          website={selectedWebsite}
          style={selectedStyle}
          headerTitle={headerTitle}
          texts={allTexts}
          telegram={telegramFooter}
        />;
    }
  };

  return (
    <div className="relative">
      {/* Preview Container - Fixed 1000x1000 */}
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{
          width: '1000px',
          height: '1000px',
          backgroundImage: `url("${selectedBackground}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: selectedStyle.backgroundColor,
        }}
      >
        {renderLayout()}
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

// Layout Props Interface
interface LayoutProps {
  website: WebsiteOption;
  style: RTPStyle;
  headerTitle: string;
  texts: string[];
  telegram: string;
}

// ============ CLASSIC LAYOUT ============
const ClassicLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
    {/* Overlay */}
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(180deg, ${style.backgroundColor}DD 0%, ${style.backgroundColor}99 50%, ${style.backgroundColor}DD 100%)`,
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl">
      {/* Logo */}
      <img
        src={website.logo}
        alt={website.name}
        className="h-28 w-auto object-contain mb-8"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
      />

      {/* Header Title */}
      {headerTitle && (
        <h1
          className="text-4xl font-bold text-center mb-10 tracking-widest"
          style={{
            color: style.primaryColor,
            textShadow: `0 0 30px ${style.primaryColor}80`,
          }}
        >
          {headerTitle}
        </h1>
      )}

      {/* Text Lines */}
      <div className="w-full space-y-4">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-8 py-4 rounded-xl text-center font-bold text-2xl"
            style={{
              background: `linear-gradient(135deg, ${style.accentColor}CC 0%, ${style.accentColor}99 100%)`,
              border: `3px solid ${style.primaryColor}60`,
              color: style.secondaryColor,
              boxShadow: `0 8px 30px ${style.primaryColor}40`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Telegram */}
      {telegram && (
        <div className="mt-10 flex items-center gap-3">
          <TelegramIcon color={style.primaryColor} size={32} />
          <span
            className="text-2xl font-semibold"
            style={{ color: style.primaryColor, textShadow: `0 0 15px ${style.primaryColor}60` }}
          >
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ NEON GLOW LAYOUT ============
const NeonGlowLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/70" />

    {/* Neon Frame */}
    <div
      className="absolute inset-8 rounded-3xl"
      style={{
        border: `4px solid ${style.primaryColor}`,
        boxShadow: `
          0 0 20px ${style.primaryColor},
          0 0 40px ${style.primaryColor}80,
          0 0 60px ${style.primaryColor}40,
          inset 0 0 20px ${style.primaryColor}20
        `,
      }}
    />

    {/* Corner accents */}
    {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
      <div
        key={i}
        className={`absolute ${pos} w-16 h-16`}
        style={{
          borderTop: i < 2 ? `4px solid ${style.secondaryColor}` : 'none',
          borderBottom: i >= 2 ? `4px solid ${style.secondaryColor}` : 'none',
          borderLeft: i % 2 === 0 ? `4px solid ${style.secondaryColor}` : 'none',
          borderRight: i % 2 === 1 ? `4px solid ${style.secondaryColor}` : 'none',
          boxShadow: `0 0 15px ${style.secondaryColor}`,
        }}
      />
    ))}

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl">
      <img
        src={website.logo}
        alt={website.name}
        className="h-24 w-auto object-contain mb-8"
        style={{ filter: `drop-shadow(0 0 20px ${style.primaryColor})` }}
      />

      {headerTitle && (
        <h1
          className="text-5xl font-black text-center mb-10 tracking-wider"
          style={{
            color: style.primaryColor,
            textShadow: `
              0 0 10px ${style.primaryColor},
              0 0 20px ${style.primaryColor},
              0 0 40px ${style.primaryColor}
            `,
          }}
        >
          {headerTitle}
        </h1>
      )}

      <div className="w-full space-y-5">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-6 py-4 rounded-lg text-center font-bold text-xl"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: `2px solid ${style.primaryColor}`,
              color: style.secondaryColor,
              boxShadow: `0 0 20px ${style.primaryColor}60, inset 0 0 10px ${style.primaryColor}20`,
              textShadow: `0 0 10px ${style.secondaryColor}`,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {telegram && (
        <div className="mt-10 flex items-center gap-3">
          <TelegramIcon color={style.primaryColor} size={28} />
          <span
            className="text-xl font-bold"
            style={{ color: style.primaryColor, textShadow: `0 0 20px ${style.primaryColor}` }}
          >
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ CYBER FRAME LAYOUT ============
const CyberFrameLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    {/* Scanlines */}
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
      }}
    />

    {/* Cyber Frame */}
    <div className="absolute inset-6">
      {/* Top bar */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-2"
        style={{ background: style.primaryColor, boxShadow: `0 0 20px ${style.primaryColor}` }}
      />
      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-2"
        style={{ background: style.primaryColor, boxShadow: `0 0 20px ${style.primaryColor}` }}
      />
      {/* Left bar */}
      <div
        className="absolute left-0 top-1/4 bottom-1/4 w-2"
        style={{ background: style.secondaryColor, boxShadow: `0 0 20px ${style.secondaryColor}` }}
      />
      {/* Right bar */}
      <div
        className="absolute right-0 top-1/4 bottom-1/4 w-2"
        style={{ background: style.secondaryColor, boxShadow: `0 0 20px ${style.secondaryColor}` }}
      />
      {/* Corner pieces */}
      <div className="absolute top-0 left-0 w-1/4 h-2" style={{ background: style.primaryColor }} />
      <div className="absolute top-0 left-0 w-2 h-1/4" style={{ background: style.primaryColor }} />
      <div className="absolute top-0 right-0 w-1/4 h-2" style={{ background: style.primaryColor }} />
      <div className="absolute top-0 right-0 w-2 h-1/4" style={{ background: style.primaryColor }} />
      <div className="absolute bottom-0 left-0 w-1/4 h-2" style={{ background: style.primaryColor }} />
      <div className="absolute bottom-0 left-0 w-2 h-1/4" style={{ background: style.primaryColor }} />
      <div className="absolute bottom-0 right-0 w-1/4 h-2" style={{ background: style.primaryColor }} />
      <div className="absolute bottom-0 right-0 w-2 h-1/4" style={{ background: style.primaryColor }} />
    </div>

    {/* Overlay */}
    <div className="absolute inset-0" style={{ background: `${style.backgroundColor}CC` }} />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-16">
      <img
        src={website.logo}
        alt={website.name}
        className="h-24 w-auto object-contain mb-6"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
      />

      {headerTitle && (
        <div className="relative mb-8">
          <h1
            className="text-4xl font-black text-center tracking-[0.3em] uppercase"
            style={{ color: style.primaryColor }}
          >
            {headerTitle}
          </h1>
          <div
            className="absolute -bottom-2 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${style.primaryColor}, transparent)` }}
          />
        </div>
      )}

      <div className="w-full space-y-4">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="relative px-6 py-4 text-center font-mono font-bold text-xl"
            style={{ color: style.secondaryColor }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${style.accentColor}00, ${style.accentColor}80, ${style.accentColor}00)`,
                clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
              }}
            />
            <span className="relative">{text}</span>
          </div>
        ))}
      </div>

      {telegram && (
        <div className="mt-10 flex items-center gap-3 px-6 py-2" style={{ background: `${style.accentColor}40` }}>
          <TelegramIcon color={style.primaryColor} size={28} />
          <span className="text-xl font-mono" style={{ color: style.primaryColor }}>
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ GOLDEN LUXURY LAYOUT ============
const GoldenLuxuryLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/60" />

    {/* Ornamental Frame */}
    <div
      className="absolute inset-10 rounded-lg"
      style={{
        border: `6px solid #D4AF37`,
        boxShadow: `
          inset 0 0 30px rgba(212,175,55,0.2),
          0 0 30px rgba(212,175,55,0.3)
        `,
      }}
    />
    <div
      className="absolute inset-12 rounded-lg"
      style={{ border: `2px solid #D4AF3780` }}
    />

    {/* Corner Ornaments */}
    {['top-10 left-10', 'top-10 right-10', 'bottom-10 left-10', 'bottom-10 right-10'].map((pos, i) => (
      <div
        key={i}
        className={`absolute ${pos} w-20 h-20 flex items-center justify-center`}
      >
        <div
          className="w-12 h-12 rotate-45"
          style={{
            border: '3px solid #D4AF37',
            background: 'linear-gradient(135deg, #D4AF3740, transparent)',
          }}
        />
      </div>
    ))}

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl">
      <img
        src={website.logo}
        alt={website.name}
        className="h-28 w-auto object-contain mb-6"
        style={{ filter: 'drop-shadow(0 4px 15px rgba(212,175,55,0.5))' }}
      />

      {headerTitle && (
        <div className="relative mb-8">
          <h1
            className="text-4xl font-serif font-bold text-center tracking-widest"
            style={{
              background: 'linear-gradient(180deg, #FFD700, #D4AF37, #B8860B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(212,175,55,0.5)',
            }}
          >
            {headerTitle}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <div className="w-2 h-2 rotate-45" style={{ background: '#D4AF37' }} />
            <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
          </div>
        </div>
      )}

      <div className="w-full space-y-4">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-8 py-4 rounded-lg text-center font-semibold text-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(30,20,10,0.9), rgba(50,40,20,0.9))',
              border: '2px solid #D4AF37',
              color: '#FFD700',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,215,0,0.2)',
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {telegram && (
        <div className="mt-10 flex items-center gap-3">
          <TelegramIcon color="#D4AF37" size={28} />
          <span className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ MATRIX LAYOUT ============
const MatrixLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    {/* Matrix rain effect overlay */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(180deg, transparent 0%, ${style.primaryColor}10 50%, transparent 100%),
          repeating-linear-gradient(90deg, ${style.primaryColor}05 0px, ${style.primaryColor}05 1px, transparent 1px, transparent 20px)
        `,
      }}
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/80" />

    {/* Grid lines */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(${style.primaryColor}40 1px, transparent 1px),
          linear-gradient(90deg, ${style.primaryColor}40 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-12">
      <img
        src={website.logo}
        alt={website.name}
        className="h-24 w-auto object-contain mb-8"
        style={{ filter: `drop-shadow(0 0 10px ${style.primaryColor})` }}
      />

      {headerTitle && (
        <h1
          className="text-4xl font-mono font-bold text-center mb-10 tracking-widest"
          style={{
            color: style.primaryColor,
            textShadow: `0 0 10px ${style.primaryColor}, 0 0 20px ${style.primaryColor}80`,
          }}
        >
          [{headerTitle}]
        </h1>
      )}

      <div className="w-full space-y-4 font-mono">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-6 py-3 text-center text-xl"
            style={{
              background: `${style.primaryColor}10`,
              border: `1px solid ${style.primaryColor}60`,
              color: style.primaryColor,
              textShadow: `0 0 5px ${style.primaryColor}`,
            }}
          >
            <span style={{ color: style.secondaryColor }}>&gt;</span> {text}
          </div>
        ))}
      </div>

      {telegram && (
        <div
          className="mt-10 flex items-center gap-3 px-4 py-2"
          style={{ border: `1px solid ${style.primaryColor}40` }}
        >
          <TelegramIcon color={style.primaryColor} size={24} />
          <span className="font-mono" style={{ color: style.primaryColor }}>
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ HOLOGRAPHIC LAYOUT ============
const HolographicLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
    {/* Rainbow gradient overlay */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: 'linear-gradient(135deg, #ff000020, #ff800020, #ffff0020, #00ff0020, #0080ff20, #8000ff20, #ff00ff20)',
      }}
    />

    {/* Holographic frame */}
    <div
      className="absolute inset-8 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        border: '2px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(2px)',
        boxShadow: `
          0 0 30px rgba(255,255,255,0.1),
          inset 0 0 30px rgba(255,255,255,0.05)
        `,
      }}
    />

    {/* Shimmer effect lines */}
    <div
      className="absolute inset-8 rounded-2xl overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)
        `,
        backgroundSize: '200% 200%',
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl">
      <img
        src={website.logo}
        alt={website.name}
        className="h-28 w-auto object-contain mb-8"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }}
      />

      {headerTitle && (
        <h1
          className="text-5xl font-bold text-center mb-10 tracking-wider"
          style={{
            background: `linear-gradient(90deg, ${style.primaryColor}, ${style.secondaryColor}, ${style.primaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,255,255,0.3)',
          }}
        >
          {headerTitle}
        </h1>
      )}

      <div className="w-full space-y-4">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-8 py-4 rounded-xl text-center font-bold text-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {telegram && (
        <div className="mt-10 flex items-center gap-3">
          <TelegramIcon color="#fff" size={28} />
          <span className="text-xl font-semibold text-white">
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ GLASSMORPHISM LAYOUT ============
const GlassmorphismLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
    {/* Glass card */}
    <div
      className="absolute inset-16 rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
      }}
    />

    {/* Accent circles */}
    <div
      className="absolute top-20 left-20 w-40 h-40 rounded-full opacity-30 blur-2xl"
      style={{ background: style.primaryColor }}
    />
    <div
      className="absolute bottom-20 right-20 w-60 h-60 rounded-full opacity-20 blur-3xl"
      style={{ background: style.secondaryColor }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">
      <img
        src={website.logo}
        alt={website.name}
        className="h-24 w-auto object-contain mb-8"
        style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))' }}
      />

      {headerTitle && (
        <h1
          className="text-4xl font-bold text-center mb-10 tracking-wide"
          style={{
            color: style.primaryColor,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          {headerTitle}
        </h1>
      )}

      <div className="w-full space-y-4">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-6 py-4 rounded-2xl text-center font-semibold text-xl"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {telegram && (
        <div
          className="mt-10 flex items-center gap-3 px-6 py-3 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <TelegramIcon color={style.primaryColor} size={24} />
          <span className="font-medium" style={{ color: style.primaryColor }}>
            {telegram}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============ RETRO ARCADE LAYOUT ============
const RetroArcadeLayout = ({ website, style, headerTitle, texts, telegram }: LayoutProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
    {/* CRT effect */}
    <div
      className="absolute inset-0 pointer-events-none opacity-5"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)',
      }}
    />

    {/* Pixelated border */}
    <div className="absolute inset-6">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-4 flex">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{ background: i % 2 === 0 ? style.primaryColor : style.secondaryColor }}
          />
        ))}
      </div>
      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 flex">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{ background: i % 2 === 0 ? style.secondaryColor : style.primaryColor }}
          />
        ))}
      </div>
      {/* Left border */}
      <div className="absolute top-4 bottom-4 left-0 w-4 flex flex-col">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 w-full"
            style={{ background: i % 2 === 0 ? style.primaryColor : style.secondaryColor }}
          />
        ))}
      </div>
      {/* Right border */}
      <div className="absolute top-4 bottom-4 right-0 w-4 flex flex-col">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 w-full"
            style={{ background: i % 2 === 0 ? style.secondaryColor : style.primaryColor }}
          />
        ))}
      </div>
    </div>

    {/* Dark background */}
    <div className="absolute inset-10 bg-black/90" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">
      <img
        src={website.logo}
        alt={website.name}
        className="h-24 w-auto object-contain mb-6"
        style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
      />

      {headerTitle && (
        <h1
          className="text-4xl font-bold text-center mb-8 tracking-widest uppercase"
          style={{
            color: style.primaryColor,
            textShadow: `
              4px 4px 0 ${style.accentColor},
              -2px -2px 0 ${style.secondaryColor}
            `,
            fontFamily: 'monospace',
          }}
        >
          {headerTitle}
        </h1>
      )}

      <div className="w-full space-y-3">
        {texts.map((text, idx) => (
          <div
            key={idx}
            className="px-6 py-3 text-center font-bold text-lg uppercase tracking-wider"
            style={{
              background: style.accentColor,
              border: `4px solid ${style.primaryColor}`,
              color: style.secondaryColor,
              fontFamily: 'monospace',
              boxShadow: `4px 4px 0 ${style.primaryColor}`,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {telegram && (
        <div className="mt-8 flex items-center gap-3">
          <TelegramIcon color={style.primaryColor} size={24} />
          <span
            className="text-lg uppercase tracking-wider"
            style={{ color: style.primaryColor, fontFamily: 'monospace' }}
          >
            {telegram}
          </span>
        </div>
      )}

      {/* Insert coin text */}
      <div
        className="mt-6 text-sm tracking-widest animate-pulse"
        style={{ color: style.secondaryColor, fontFamily: 'monospace' }}
      >
        INSERT COIN TO CONTINUE
      </div>
    </div>
  </div>
);

export default Preview;
