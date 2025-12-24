'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle, Copy, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Preview from '@/components/Preview';
import { WEBSITES, RTP_STYLES, BACKGROUND_CATEGORIES, BACKGROUNDS } from '@/data/config';
import { WebsiteOption, RTPStyle, TextRow } from '@/types';

export default function Home() {
  // Website & Style States
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteOption>(WEBSITES[0]);
  const [selectedStyle, setSelectedStyle] = useState<RTPStyle>(RTP_STYLES[0]);
  const [selectedBackground, setSelectedBackground] = useState<string>(BACKGROUND_CATEGORIES[0].backgrounds[0]);

  // Content States
  const [headerTitle, setHeaderTitle] = useState<string>('LINK ALTERNATIF');
  const [text1, setText1] = useState<string>('www.galaxy77bet.com');
  const [text2, setText2] = useState<string>('www.galaxy77bet.net');
  const [additionalTexts, setAdditionalTexts] = useState<TextRow[]>([]);
  const [telegramFooter, setTelegramFooter] = useState<string>('@galaxy77bet');

  // Download states
  const previewRef = useRef<HTMLDivElement>(null);
  const [cachedImage, setCachedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'processing' | 'ready'>('idle');

  // Browser capabilities
  const [browserCapabilities, setBrowserCapabilities] = useState({
    clipboard: false,
    webShare: false,
    html2canvas: true,
  });

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Check browser capabilities on mount
  useEffect(() => {
    const checkCapabilities = () => {
      const hasClipboard = !!(navigator.clipboard && typeof navigator.clipboard.write === 'function');
      const hasWebShare = !!(typeof navigator.share === 'function' && typeof navigator.canShare === 'function');
      setBrowserCapabilities({
        clipboard: hasClipboard,
        webShare: hasWebShare,
        html2canvas: true,
      });
    };
    checkCapabilities();
  }, []);

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add text row
  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    setAdditionalTexts([...additionalTexts, { id: newId, text: '' }]);
  };

  // Remove text row
  const handleRemoveText = (id: string) => {
    setAdditionalTexts(additionalTexts.filter(t => t.id !== id));
  };

  // Update text row
  const handleUpdateText = (id: string, text: string) => {
    setAdditionalTexts(additionalTexts.map(t => t.id === id ? { ...t, text } : t));
  };

  // Shuffle functions
  const shuffleBackground = useCallback(() => {
    const allBackgrounds = BACKGROUNDS;
    const randomBg = allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];
    setSelectedBackground(randomBg);
  }, []);

  const shuffleStyle = useCallback(() => {
    const randomStyle = RTP_STYLES[Math.floor(Math.random() * RTP_STYLES.length)];
    setSelectedStyle(randomStyle);
  }, []);

  // Reset cached image when settings change
  useEffect(() => {
    setCachedImage(null);
    setDownloadStatus('idle');
  }, [selectedWebsite, selectedStyle, selectedBackground, headerTitle, text1, text2, additionalTexts, telegramFooter]);

  // Convert image URL to base64 via proxy
  const imageToBase64 = async (url: string): Promise<string> => {
    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return url;
    }
  };

  // Prepare image for download
  const prepareImage = async () => {
    if (!previewRef.current) return;

    setIsProcessing(true);
    setDownloadStatus('processing');

    try {
      const { toPng } = await import('html-to-image');
      const element = previewRef.current;

      // Store original image sources for restoration
      const originalSrcs: Map<HTMLImageElement, string> = new Map();

      // Helper to check if URL is external
      const isExternalUrl = (url: string): boolean => {
        return Boolean(url && (url.startsWith('http') || url.startsWith('//')));
      };

      // Convert ALL external images to base64 before screenshot
      const allImages = element.querySelectorAll('img');
      await Promise.all(
        Array.from(allImages).map(async (img) => {
          const src = img.src;
          if (isExternalUrl(src)) {
            originalSrcs.set(img, src);
            try {
              const base64 = await imageToBase64(src);
              img.src = base64;
              await new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                } else {
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                }
              });
            } catch (e) {
              console.error('Failed to convert image:', src, e);
            }
          }
        })
      );

      // Wait for fonts
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Get background as base64
      let bgBase64 = selectedBackground;
      if (isExternalUrl(selectedBackground)) {
        try {
          bgBase64 = await imageToBase64(selectedBackground);
        } catch (e) {
          console.error('Failed to convert background:', e);
        }
      }

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: window.devicePixelRatio || 2,
        backgroundColor: selectedStyle.backgroundColor || '#000000',
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return node.getAttribute('data-screenshot-ignore') !== 'true';
          }
          return true;
        },
        style: {
          backgroundImage: `url("${bgBase64}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      });

      setCachedImage(dataUrl);
      setDownloadStatus('ready');

      // Restore original image sources
      originalSrcs.forEach((src, img) => {
        img.src = src;
      });

    } catch (error) {
      console.error('Error preparing image:', error);
      setDownloadStatus('idle');
      let errorMessage = 'Gagal memproses gambar. ';
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Silakan coba lagi.';
      }
      showNotification('error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download the cached image
  const downloadImage = () => {
    if (!cachedImage) return;
    const link = document.createElement('a');
    link.download = `LinkAlternatif-${selectedWebsite.name}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = cachedImage;
    link.click();
    showNotification('success', 'Gambar berhasil didownload!');
  };

  // Copy to Clipboard
  const copyToClipboard = async () => {
    if (!cachedImage) {
      showNotification('error', 'Silakan prepare image terlebih dahulu');
      return;
    }

    if (!browserCapabilities.clipboard) {
      showNotification('error', 'Browser Anda tidak mendukung fitur copy to clipboard');
      return;
    }

    try {
      const response = await fetch(cachedImage);
      const blob = await response.blob();
      const clipboardItem = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([clipboardItem]);
      showNotification('success', 'Gambar berhasil dicopy ke clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showNotification('error', 'Gagal copy ke clipboard. Coba gunakan download.');
    }
  };

  // Share via Web Share API
  const shareImage = async () => {
    if (!cachedImage) {
      showNotification('error', 'Silakan prepare image terlebih dahulu');
      return;
    }

    if (!browserCapabilities.webShare) {
      showNotification('error', 'Browser Anda tidak mendukung fitur share');
      return;
    }

    try {
      const response = await fetch(cachedImage);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `LinkAlternatif-${selectedWebsite.name}-${new Date().toISOString().split('T')[0]}.png`,
        { type: 'image/png' }
      );

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        showNotification('error', 'Browser Anda tidak dapat share file gambar');
        return;
      }

      await navigator.share({
        title: `Link Alternatif ${selectedWebsite.name}`,
        text: `Link Alternatif untuk ${selectedWebsite.name}`,
        files: [file],
      });

      showNotification('success', 'Gambar berhasil dishare!');
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        showNotification('info', 'Share dibatalkan');
      } else {
        console.error('Error sharing:', error);
        showNotification('error', 'Gagal share gambar. Coba gunakan download.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl animate-slide-in-right flex items-center gap-3 max-w-md ${
          notification.type === 'success' ? 'bg-green-600 text-white' :
          notification.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        }`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Controls */}
        <Header
          selectedWebsite={selectedWebsite}
          onWebsiteChange={setSelectedWebsite}
          websites={WEBSITES}
          selectedBackground={selectedBackground}
          onBackgroundChange={setSelectedBackground}
          backgroundCategories={BACKGROUND_CATEGORIES}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          styles={RTP_STYLES}
          headerTitle={headerTitle}
          onHeaderTitleChange={setHeaderTitle}
          text1={text1}
          onText1Change={setText1}
          text2={text2}
          onText2Change={setText2}
          additionalTexts={additionalTexts}
          onAddText={handleAddText}
          onRemoveText={handleRemoveText}
          onUpdateText={handleUpdateText}
          telegramFooter={telegramFooter}
          onTelegramFooterChange={setTelegramFooter}
          onShuffleBackground={shuffleBackground}
          onShuffleStyle={shuffleStyle}
        />

        {/* Main Content */}
        <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-400">
              Link Alternative Generator
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Generate gambar Link Alternatif untuk website Anda
            </p>
          </div>

          {/* Browser Compatibility Status */}
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Status Kompatibilitas Browser
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${browserCapabilities.html2canvas ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-300">Screenshot: </span>
                <span className={browserCapabilities.html2canvas ? 'text-green-400' : 'text-red-400'}>
                  {browserCapabilities.html2canvas ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${browserCapabilities.clipboard ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-gray-300">Copy to Clipboard: </span>
                <span className={browserCapabilities.clipboard ? 'text-green-400' : 'text-yellow-400'}>
                  {browserCapabilities.clipboard ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${browserCapabilities.webShare ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-gray-300">Web Share API: </span>
                <span className={browserCapabilities.webShare ? 'text-green-400' : 'text-yellow-400'}>
                  {browserCapabilities.webShare ? 'Supported' : 'Not Supported'}
                </span>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={downloadImage}
                disabled={!cachedImage || isProcessing}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  cachedImage && !isProcessing
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>

              <button
                onClick={copyToClipboard}
                disabled={!cachedImage || isProcessing || !browserCapabilities.clipboard}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  cachedImage && !isProcessing && browserCapabilities.clipboard
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Copy className="w-5 h-5" />
                Copy to Clipboard
              </button>

              <button
                onClick={shareImage}
                disabled={!cachedImage || isProcessing || !browserCapabilities.webShare}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  cachedImage && !isProcessing && browserCapabilities.webShare
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Status Messages */}
            <div className="space-y-2">
              {downloadStatus === 'ready' && (
                <div className="text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Gambar siap didownload, dicopy, atau dishare
                </div>
              )}

              {!cachedImage && (
                <div className="text-cyan-400 text-sm font-semibold">
                  Klik tombol &quot;Screenshot&quot; di pojok kanan bawah preview untuk mulai
                </div>
              )}
            </div>
          </div>

          {/* Screenshot Result */}
          {cachedImage && (
            <div className="mb-6 p-6 bg-gray-800 rounded-lg border-2 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-green-400">Screenshot Berhasil!</h3>
                <div className="flex gap-3">
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>
              <div className="overflow-auto rounded-lg border-2 border-gray-700 bg-black">
                <img src={cachedImage} alt="Screenshot Result" className="w-full" />
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="overflow-x-auto">
            <Preview
              ref={previewRef}
              selectedWebsite={selectedWebsite}
              selectedStyle={selectedStyle}
              selectedBackground={selectedBackground}
              headerTitle={headerTitle}
              text1={text1}
              text2={text2}
              additionalTexts={additionalTexts}
              telegramFooter={telegramFooter}
              onPrepareImage={prepareImage}
              onDownload={downloadImage}
              onCopy={copyToClipboard}
              onShare={shareImage}
              browserCapabilities={browserCapabilities}
              isImageReady={!!cachedImage}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">Cara Penggunaan:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Pilih website dari dropdown</li>
            <li>Atur style warna dan background sesuai keinginan</li>
            <li>Isi Header/Judul (misal: LINK ALTERNATIF)</li>
            <li>Isi Text 1 dan Text 2 dengan link alternatif</li>
            <li>Tambahkan text tambahan jika diperlukan</li>
            <li>Isi Footer Telegram dengan username Telegram</li>
            <li>Klik tombol <strong className="text-cyan-400">&quot;Screenshot&quot;</strong> di pojok kanan bawah preview</li>
            <li>Download, Copy, atau Share gambar hasil screenshot</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
