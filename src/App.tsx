import { useState, useRef } from 'react';
import { Box, CssBaseline } from '@mui/material';
import type { ColorResult } from 'react-color';
import ImageEditor from './components/ImageEditor';
import type { Tool, ImageEditorHandle } from './components/ImageEditor';
import FilePicker from './components/FilePicker';
import MenuBar from './components/MenuBar';
import ToolbarDrawer from './components/Toolbar/ToolbarDrawer';
import './App.css';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('brush');
  const [brushColor, setBrushColor] = useState<string>('#ff0000');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const imageEditorRef = useRef<ImageEditorHandle>(null);
  const [canRedo, setCanRedo] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (c: ColorResult) => setBrushColor(c.hex);

  const handleSave = () => {
    const dataUrl = imageEditorRef.current?.getImageDataUrl();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!image) {
    return <FilePicker onFileChange={handleFileChange} />;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '48px 1fr',
        gridTemplateColumns: 'min-content 1fr',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <CssBaseline />
      {/* MenuBar spans both columns */}
      <Box sx={{ gridColumn: '1 / span 2', gridRow: 1, zIndex: 1201 }}>
        <MenuBar onFileChange={handleFileChange} onSave={handleSave} />
      </Box>
      {/* ToolbarDrawer in first column, second row */}
      <Box sx={{ gridColumn: 1, gridRow: 2, minWidth: 'auto' }}>
        <ToolbarDrawer
          tool={tool}
          setTool={setTool}
          brushColor={brushColor}
          brushSize={brushSize}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          setBrushColor={setBrushColor}
          setBrushSize={setBrushSize}
          handleColorChange={handleColorChange}
          onUndo={() => imageEditorRef.current?.undo()}
          onRedo={() => imageEditorRef.current?.redo()}
          canRedo={canRedo}
          canUndo={canUndo}
        />
      </Box>
      {/* Main editor area in second column, second row */}
      <Box
        component="main"
        sx={{
          gridColumn: 2,
          gridRow: 2,
          bgcolor: 'grey.900',
          p: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ImageEditor
          ref={imageEditorRef}
          image={image}
          tool={tool}
          brushColor={brushColor}
          brushSize={brushSize}
          setCanRedo={setCanRedo}
          setCanUndo={setCanUndo}
        />
      </Box>
    </Box>
  );
}
