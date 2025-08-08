import { Box, Typography, Slider, Input } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface BrushOptionsProps {
  brushColor: string;
  brushSize: number;
  showColorPicker: boolean;
  setShowColorPicker: (v: boolean | ((v: boolean) => boolean)) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  handleColorChange: (c: ColorResult) => void;
}

export default function BrushOptions({
  brushColor,
  brushSize,
  showColorPicker,
  setShowColorPicker,
  setBrushColor,
  setBrushSize,
  handleColorChange,
}: BrushOptionsProps) {
  return (
    <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <PaletteIcon sx={{ mb: 1 }} onClick={() => setShowColorPicker(v => !v)} style={{ cursor: 'pointer' }} />
      {showColorPicker && (
        <Box sx={{
          position: 'fixed',
          top: 120,
          zIndex: 9999,
          background: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}>
          <SketchPicker color={brushColor} onChange={handleColorChange} />
        </Box>
      )}
      <Typography variant="caption" sx={{ mt: 2 }}>Brush Size</Typography>
      <Slider
        min={1}
        max={100}
        value={brushSize}
        onChange={(_, v) => setBrushSize(Number(v))}
        orientation="vertical"
        sx={{ height: 120, mt: 1 }}
      />
      <Input
        value={brushSize}
        size="small"
        onChange={e => setBrushSize(Number(e.target.value))}
        inputProps={{ min: 1, max: 100, type: 'number', style: { width: 40, textAlign: 'center' } }}
        sx={{ mt: 1 }}
      />
    </Box>
  );
}
