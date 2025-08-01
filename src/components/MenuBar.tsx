import { AppBar, Toolbar as MuiToolbar, Typography, Button } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';

interface MenuBarProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export default function MenuBar({ onFileChange, onSave }: MenuBarProps) {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <MuiToolbar variant="dense">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Image Editor</Typography>
        <Button color="inherit" component="label" startIcon={<PhotoCamera />}>Load Image<input type="file" accept="image/*" hidden onChange={onFileChange} /></Button>
        <Button color="inherit" startIcon={<SaveIcon />} onClick={onSave}>Save</Button>
      </MuiToolbar>
    </AppBar>
  );
}
