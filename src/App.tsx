import { useState, useRef } from 'react';
import { Box, CssBaseline, AppBar, Toolbar as MuiToolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Slider, Input, Divider } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import BrushIcon from '@mui/icons-material/Brush';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PaletteIcon from '@mui/icons-material/Palette';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';
import ImageEditor from './components/ImageEditor';
import type { Tool, ImageEditorHandle } from './components/ImageEditor';
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
    // Centered file picker
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Image Editor</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            size="large"
          >
            Load Image
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
        </Box>
      </Box>
    );
  }

  // Main editor UI
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      {/* Menu Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <MuiToolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Image Editor</Typography>
          <Button color="inherit" component="label" startIcon={<PhotoCamera />}>Load Image<input type="file" accept="image/*" hidden onChange={handleFileChange} /></Button>
          <Button color="inherit" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
        </MuiToolbar>
      </AppBar>
      {/* Toolbar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', pt: 6 },
        }}
      >
        <MuiToolbar />
        <List>
          <ListItem component="button" onClick={() => setTool('brush')}
            sx={tool === 'brush' ? { backgroundColor: 'rgba(100, 100, 255, 0.2)' } : {}}>
            <ListItemIcon><BrushIcon /></ListItemIcon>
            <ListItemText primary="Brush" sx={{ display: 'none' }} />
          </ListItem>
          <ListItem component="button" onClick={() => setTool('text')}
            sx={tool === 'text' ? { backgroundColor: 'rgba(100, 100, 255, 0.2)' } : {}}>
            <ListItemIcon><TextFieldsIcon /></ListItemIcon>
            <ListItemText primary="Text" sx={{ display: 'none' }} />
          </ListItem>
          <ListItem component="button" onClick={() => setTool('add-image')}
            sx={tool === 'add-image' ? { backgroundColor: 'rgba(100, 100, 255, 0.2)' } : {}}>
            <ListItemIcon><AddPhotoAlternateIcon /></ListItemIcon>
            <ListItemText primary="Add Img" sx={{ display: 'none' }} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem component="button">
            <ListItemIcon><UndoIcon /></ListItemIcon>
            <ListItemText primary="Undo" sx={{ display: 'none' }} />
          </ListItem>
          <ListItem component="button">
            <ListItemIcon><RedoIcon /></ListItemIcon>
            <ListItemText primary="Redo" sx={{ display: 'none' }} />
          </ListItem>
        </List>
        {/* Brush options */}
        {tool === 'brush' && (
          <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <PaletteIcon sx={{ mb: 1 }} onClick={() => setShowColorPicker(v => !v)} style={{ cursor: 'pointer' }} />
            {showColorPicker && (
              <Box sx={{
                position: 'fixed',
                left: drawerWidth + 100,
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
        )}
      </Drawer>
      {/* Editor Area */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.900', p: 0, ml: `${drawerWidth}px`, mt: '48px', height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ImageEditor ref={imageEditorRef} image={image} tool={tool} brushColor={brushColor} brushSize={brushSize} />
      </Box>
    </Box>
  );
}
