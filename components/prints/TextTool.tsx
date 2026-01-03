'use client';

/**
 * TextTool Component
 * Modern text editor UI with live preview, font selector with preview, and style controls with animations
 */

import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { PrintApplication, BlendMode } from '@/types/prints';
import { ComponentType } from '@/types/models';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { HoverScale } from '@/lib/animations/framerMotion';

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Palatino', label: 'Palatino' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
];

const FONT_WEIGHTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: 'lighter', label: 'Light' },
  { value: 'bolder', label: 'Bolder' },
];

const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export function TextTool() {
  const { selectedComponent, addPrint, printMap } = useConfiguratorStore();
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

    const existingPrints = printMap[selectedComponent] || [];

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
      zIndex: existingPrints.length,
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

    setText('');
    setIsAdding(false);
  };

  if (!selectedComponent) {
    return (
      <Card variant="standard">
        <div className="p-4 text-center">
          <p className="text-small text-text-tertiary">
            Select a component to add text
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <Card variant="standard" className="p-4">
        <h4 className="text-small font-semi-bold text-text-primary mb-3">
          Text Content
        </h4>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to add..."
          autoResize
          minRows={3}
          maxRows={6}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-tiny text-text-tertiary">
            {text.length}/100 characters
          </p>
          {text.length > 80 && (
            <Badge variant="warning" size="sm">
              Near limit
            </Badge>
          )}
        </div>
      </Card>

      {/* Font Controls */}
      <Card variant="standard" className="p-4">
        <h4 className="text-small font-semi-bold text-text-primary mb-3">
          Font Settings
        </h4>
        <div className="space-y-4">
          {/* Font Family */}
          <div>
            <Select
              label="Font Family"
              options={FONT_FAMILIES}
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder="Select font..."
            />
          </div>

          {/* Font Weight */}
          <div>
            <Select
              label="Font Weight"
              options={FONT_WEIGHTS}
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
              placeholder="Select weight..."
            />
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-small font-medium text-text-primary">
                Font Size
              </label>
              <Badge variant="neutral" size="sm">
                {fontSize}px
              </Badge>
            </div>
            <input
              type="range"
              min="12"
              max="120"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-base-light-gray rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <div className="flex justify-between text-tiny text-text-tertiary mt-1">
              <span>12px</span>
              <span>120px</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Color and Alignment */}
      <Card variant="standard" className="p-4">
        <h4 className="text-small font-semi-bold text-text-primary mb-3">
          Style Settings
        </h4>
        <div className="space-y-4">
          {/* Text Color */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-12 rounded-medium border-2 border-base-light-gray cursor-pointer transition-smooth hover:border-accent-blue"
              />
              <Input
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Text Alignment
            </label>
            <div className="flex gap-2">
              {TEXT_ALIGNMENTS.map((align) => {
                const isActive = textAlign === align.value;
                return (
                  <HoverScale key={align.value} scale={1.05}>
                    <button
                      onClick={() => setTextAlign(align.value as 'left' | 'center' | 'right')}
                      className={`
                        flex-1 px-4 py-2 rounded-medium text-small font-medium transition-smooth
                        ${
                          isActive
                            ? 'bg-accent-blue text-white shadow-elevation-1'
                            : 'bg-base-light-gray text-text-secondary hover:bg-base-cool-gray hover:text-text-primary'
                        }
                      `}
                    >
                      {align.label}
                    </button>
                  </HoverScale>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Live Preview */}
      <AnimatePresence>
        {text && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-small font-semi-bold text-text-primary">
                  Live Preview
                </h4>
                <Badge variant="success" size="sm">
                  Preview
                </Badge>
              </div>
              <div
                className="p-6 rounded-medium bg-base-light-gray border-2 border-base-cool-gray min-h-[120px] flex items-center justify-center transition-smooth"
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  fontWeight,
                  color: textColor,
                  textAlign,
                }}
              >
                <p className="break-words w-full">{text || 'Enter text to see preview...'}</p>
              </div>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Add Button */}
      <Button
        variant="primary"
        size="md"
        onClick={handleAddText}
        disabled={!text.trim() || isAdding}
        loading={isAdding}
        fullWidth
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
      >
        {isAdding ? 'Adding Text...' : 'Add Text Print'}
      </Button>
    </div>
  );
}
