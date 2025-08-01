import { Box, Typography, Button } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function FilePicker({ onFileChange }: { onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
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
          <input type="file" accept="image/*" hidden onChange={onFileChange} />
        </Button>
      </Box>
    </Box>
  );
}
