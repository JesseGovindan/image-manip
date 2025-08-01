import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar as MuiToolbar } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import type { Tool } from '../ImageEditor';
import BrushOptions from '../BrushOptions';
import type { ColorResult } from 'react-color';

interface ToolbarDrawerProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  drawerWidth: number;
  brushColor: string;
  brushSize: number;
  showColorPicker: boolean;
  setShowColorPicker: (v: boolean | ((v: boolean) => boolean)) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  handleColorChange: (c: ColorResult) => void;
}

export default function ToolbarDrawer(props: ToolbarDrawerProps) {
  const {
    tool, setTool, drawerWidth,
    brushColor, brushSize, showColorPicker, setShowColorPicker, setBrushColor, setBrushSize, handleColorChange
  } = props;
  return (
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
        {[
          { key: 'brush', icon: <BrushIcon />, label: 'Brush' },
          { key: 'text', icon: <TextFieldsIcon />, label: 'Text' },
          { key: 'add-image', icon: <AddPhotoAlternateIcon />, label: 'Add Img' },
        ].map(({ key, icon, label }) => (
          <ListItem
            key={key}
            component="button"
            onClick={() => setTool(key as Tool)}
            sx={tool === key ? { backgroundColor: 'rgba(100, 100, 255, 0.2)' } : {}}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} sx={{ display: 'none' }} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {[
          { key: 'undo', icon: <UndoIcon />, label: 'Undo' },
          { key: 'redo', icon: <RedoIcon />, label: 'Redo' },
        ].map(({ key, icon, label }) => (
          <ListItem key={key} component="button">
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} sx={{ display: 'none' }} />
          </ListItem>
        ))}
      </List>
      {/* Brush options */}
      {tool === 'brush' && (
        <BrushOptions
          brushColor={brushColor}
          brushSize={brushSize}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          setBrushColor={setBrushColor}
          setBrushSize={setBrushSize}
          drawerWidth={drawerWidth}
          handleColorChange={handleColorChange}
        />
      )}
    </Drawer>
  );
}
