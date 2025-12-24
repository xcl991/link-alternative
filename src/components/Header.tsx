'use client';

import { useState } from 'react';
import { ChevronDown, Shuffle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WebsiteOption, RTPStyle, BackgroundCategory, TextRow } from '@/types';

interface HeaderProps {
  // Website
  selectedWebsite: WebsiteOption;
  onWebsiteChange: (website: WebsiteOption) => void;
  websites: WebsiteOption[];

  // Background
  selectedBackground: string;
  onBackgroundChange: (bg: string) => void;
  backgroundCategories: BackgroundCategory[];

  // Style
  selectedStyle: RTPStyle;
  onStyleChange: (style: RTPStyle) => void;
  styles: RTPStyle[];

  // Content
  headerTitle: string;
  onHeaderTitleChange: (title: string) => void;
  text1: string;
  onText1Change: (text: string) => void;
  text2: string;
  onText2Change: (text: string) => void;
  additionalTexts: TextRow[];
  onAddText: () => void;
  onRemoveText: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  telegramFooter: string;
  onTelegramFooterChange: (text: string) => void;

  // Actions
  onShuffleBackground: () => void;
  onShuffleStyle: () => void;
}

export default function Header({
  selectedWebsite,
  onWebsiteChange,
  websites,
  selectedBackground,
  onBackgroundChange,
  backgroundCategories,
  selectedStyle,
  onStyleChange,
  styles,
  headerTitle,
  onHeaderTitleChange,
  text1,
  onText1Change,
  text2,
  onText2Change,
  additionalTexts,
  onAddText,
  onRemoveText,
  onUpdateText,
  telegramFooter,
  onTelegramFooterChange,
  onShuffleBackground,
  onShuffleStyle,
}: HeaderProps) {
  const [isWebsiteOpen, setIsWebsiteOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [isBgCategoryOpen, setIsBgCategoryOpen] = useState(false);
  const [selectedBgCategory, setSelectedBgCategory] = useState<BackgroundCategory>(backgroundCategories[0]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-xl space-y-4">
      {/* Row 1: Website & Style Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Website Selector */}
        <div className="space-y-2">
          <Label className="text-gray-300">Website</Label>
          <div className="relative">
            <button
              onClick={() => setIsWebsiteOpen(!isWebsiteOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <span className="text-white truncate">{selectedWebsite.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isWebsiteOpen ? 'rotate-180' : ''}`} />
            </button>
            {isWebsiteOpen && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {websites.map((website) => (
                  <button
                    key={website.id}
                    onClick={() => {
                      onWebsiteChange(website);
                      setIsWebsiteOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors ${
                      selectedWebsite.id === website.id ? 'bg-blue-600/20 text-blue-400' : 'text-white'
                    }`}
                  >
                    {website.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Style Selector */}
        <div className="space-y-2">
          <Label className="text-gray-300">Style Warna</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <button
                onClick={() => setIsStyleOpen(!isStyleOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedStyle.primaryColor }}
                  />
                  <span className="text-white truncate">{selectedStyle.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStyleOpen && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        onStyleChange(style);
                        setIsStyleOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                        selectedStyle.id === style.id ? 'bg-blue-600/20 text-blue-400' : 'text-white'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: style.primaryColor }}
                      />
                      {style.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onShuffleStyle}
              className="shrink-0"
              title="Acak Style"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Background Category */}
        <div className="space-y-2">
          <Label className="text-gray-300">Kategori Background</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <button
                onClick={() => setIsBgCategoryOpen(!isBgCategoryOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <span className="text-white truncate">{selectedBgCategory.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBgCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBgCategoryOpen && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {backgroundCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedBgCategory(cat);
                        onBackgroundChange(cat.backgrounds[0]);
                        setIsBgCategoryOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors ${
                        selectedBgCategory.id === cat.id ? 'bg-blue-600/20 text-blue-400' : 'text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onShuffleBackground}
              className="shrink-0"
              title="Acak Background"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Background Thumbnails */}
        <div className="space-y-2">
          <Label className="text-gray-300">Pilih Background</Label>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {selectedBgCategory.backgrounds.map((bg, idx) => (
              <button
                key={idx}
                onClick={() => onBackgroundChange(bg)}
                className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedBackground === bg ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <img
                  src={bg}
                  alt={`BG ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Content Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Header Title */}
        <div className="space-y-2">
          <Label className="text-gray-300">Header / Judul</Label>
          <Input
            value={headerTitle}
            onChange={(e) => onHeaderTitleChange(e.target.value)}
            placeholder="LINK ALTERNATIF"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Text 1 */}
        <div className="space-y-2">
          <Label className="text-gray-300">Text 1</Label>
          <Input
            value={text1}
            onChange={(e) => onText1Change(e.target.value)}
            placeholder="www.example.com"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Text 2 */}
        <div className="space-y-2">
          <Label className="text-gray-300">Text 2</Label>
          <Input
            value={text2}
            onChange={(e) => onText2Change(e.target.value)}
            placeholder="www.example2.com"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Telegram Footer */}
        <div className="space-y-2">
          <Label className="text-gray-300">Footer Telegram</Label>
          <Input
            value={telegramFooter}
            onChange={(e) => onTelegramFooterChange(e.target.value)}
            placeholder="@username"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Row 3: Additional Text Rows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Text Tambahan</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddText}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Text
          </Button>
        </div>
        {additionalTexts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {additionalTexts.map((row, idx) => (
              <div key={row.id} className="flex gap-2">
                <Input
                  value={row.text}
                  onChange={(e) => onUpdateText(row.id, e.target.value)}
                  placeholder={`Text ${idx + 3}`}
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemoveText(row.id)}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
