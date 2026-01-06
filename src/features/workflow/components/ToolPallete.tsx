import React, { useState } from 'react';
import { Panel } from '@xyflow/react';
import { useNodeType } from '@/features/workflow/hooks/useNodeType';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { SaveWorkflow } from '@/features/workflow/components/SaveWorkflow';
import { Settings, Eraser, Moon, Sun } from 'lucide-react';
import { getAllShapes, getShapeConfig, getAllStickers, getStickerConfig } from '@/features/workflow/constants/shape-config';
import { ShapeType } from '@/features/workflow/constants/shape-config';
import { useCanvasUiStore } from '@/features/workflow/state/use-canvas-ui-store';

export const ToolPallete: React.FC = () => {
  const [_, setType] = useNodeType();
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  
  const eraserMode = useCanvasUiStore((state) => state.eraserMode);
  const toggleEraserMode = useCanvasUiStore((state) => state.toggleEraserMode);
  const isDarkMode = useCanvasUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useCanvasUiStore((state) => state.toggleDarkMode);

  const shapes = getAllShapes();
  const stickers = getAllStickers();

  const onDragStart = (event: React.DragEvent, shapeType: ShapeType) => {
    setType?.(shapeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Panel position="top-left" className="flex flex-col gap-2 border p-2 rounded-xl bg-white shadow-md max-w-xs dark:bg-gray-800 dark:border-gray-700">
      {/* Title */}
      <h3 className="text-xs font-bold text-gray-700 px-1 dark:text-gray-200">Shapes</h3>

      {/* Shapes Grid */}
      <div className="grid grid-cols-4 gap-1">
        {shapes.map((shapeType) => {
          const config = getShapeConfig(shapeType);
          return (
            <button
              key={shapeType}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              style={{
                backgroundColor: config.lightColor,
              }}
              onDragStart={(event) => onDragStart(event as any, shapeType)}
              onMouseDown={(event) => event.stopPropagation()}
              draggable
              title={config.description}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>
                {config.icon}
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300" style={{ color: config.color }}>
                {config.name.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-1 dark:border-gray-600" />

      {/* Tools Row */}
      <div className="flex gap-1 justify-center flex-wrap">
        {/* Dark Mode Toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleDarkMode}
          className="text-xs py-1 px-2 h-7 flex items-center gap-1"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
        </Button>

        {/* Eraser Toggle */}
        <Button
          variant={eraserMode ? "destructive" : "secondary"}
          size="sm"
          onClick={toggleEraserMode}
          className="text-xs py-1 px-2 h-7 flex items-center gap-1"
          title={eraserMode ? "Disable eraser mode (E)" : "Enable eraser mode (E)"}
        >
          <Eraser className="w-3 h-3" />
          {eraserMode ? "ON" : "OFF"}
        </Button>

        {/* Sticker Picker */}
        <Popover open={showStickerPicker} onOpenChange={setShowStickerPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs py-1 px-2 h-7"
              title="Add sticker badge to selected node"
            >
              ✨ Sticker
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2 dark:bg-gray-800 dark:border-gray-700">
            <h4 className="text-xs font-semibold mb-2 dark:text-gray-200">Stickers</h4>
            <div className="grid grid-cols-5 gap-1">
              {stickers.map((stickerType) => {
                const config = getStickerConfig(stickerType);
                return (
                  <button
                    key={stickerType}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors flex flex-col items-center gap-0.5 group dark:hover:bg-gray-700"
                    onClick={() => setShowStickerPicker(false)}
                    title={config.description}
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 text-center dark:text-gray-400 dark:group-hover:text-gray-200">
                      {config.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Save Workflow */}
        <SaveWorkflow />

        {/* Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer inline-flex items-center justify-center p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200 h-7 w-7 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Settings & Export/Import</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Panel>
  );
};