'use client';

import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { PrintApplication, BlendMode } from '@/types/prints';
import { ComponentType } from '@/types/models';
import { logger } from '@/lib/logger';

export function TextTool() {
  const { selectedComponent, addPrint } = useConfiguratorStore();
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textColor, setTextColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddText = () => {
    if (!selectedComponent || !text.trim()) {
      logger.warn('Cannot add text: component not selected or text is empty', {
        context: 'TextTool',
        metadata: { hasComponent: !!selectedComponent, hasText: !!text.trim() },
      });
      return;
    }

    setIsAdding(true);

    const textPrint: PrintApplication = {
      id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      textContent: text.trim(),
      textStyle: {
        fontFamily,
        fontSize,
        fontWeight,
        color: textColor,
        textAlign,
      },
      position: { x: 0.5, y: 0.5 },
      scale: 1.0,
      rotation: 0,
      zone: 'front',
      opacity: 1.0,
      blendMode: BlendMode.NORMAL,
      component: selectedComponent,
      zIndex: 0,
    };

    addPrint(selectedComponent, textPrint);

    logger.info('Text print added', {
      context: 'TextTool',
      metadata: {
        component: selectedComponent,
        text: text.trim(),
        printId: textPrint.id,
      },
    });

    // Reset form
    setText('');
    setIsAdding(false);
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to add text.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Text Tool</h3>

      {/* Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to add..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">{text.length}/100 characters</p>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <span className="text-sm text-gray-500">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="120"
          step="1"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Font Family */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Palatino">Palatino</option>
          <option value="Garamond">Garamond</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Impact">Impact</option>
        </select>
      </div>

      {/* Font Weight */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Weight
        </label>
        <select
          value={fontWeight}
          onChange={(e) => setFontWeight(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Light</option>
          <option value="bolder">Bolder</option>
        </select>
      </div>

      {/* Text Color */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Align */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => setTextAlign(align)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                textAlign === align
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {text && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <div
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight,
              color: textColor,
              textAlign,
            }}
            className="break-words"
          >
            {text}
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={handleAddText}
        disabled={!text.trim() || isAdding}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isAdding ? 'Adding...' : 'Add Text Print'}
      </button>
    </div>
  );
}

