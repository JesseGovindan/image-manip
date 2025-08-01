import { useState, useRef } from 'react';
import { Box, CssBaseline } from '@mui/material';
import type { ColorResult } from 'react-color';
import ImageEditor from './components/ImageEditor';
import type { Tool, ImageEditorHandle } from './components/ImageEditor';
import FilePicker from './components/FilePicker';
import MenuBar from './components/MenuBar';
import ToolbarDrawer from './components/Toolbar/ToolbarDrawer';
import './App.css';

const drawerWidth = 80;

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('brush');
  const [brushColor, setBrushColor] = useState<string>('#ff0000');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const imageEditorRef = useRef<ImageEditorHandle>(null);

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
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      <MenuBar onFileChange={handleFileChange} onSave={handleSave} />
      <ToolbarDrawer
        tool={tool}
        setTool={setTool}
        drawerWidth={drawerWidth}
        brushColor={brushColor}
        brushSize={brushSize}
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        setBrushColor={setBrushColor}
        setBrushSize={setBrushSize}
        handleColorChange={handleColorChange}
      />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.900', p: 0, ml: `${drawerWidth}px`, mt: '48px', height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ImageEditor ref={imageEditorRef} image={image} tool={tool} brushColor={brushColor} brushSize={brushSize} />
      </Box>
    </Box>
  );
}
