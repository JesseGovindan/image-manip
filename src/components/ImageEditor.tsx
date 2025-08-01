import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as fabric from 'fabric';

export type Tool = 'brush' | 'text' | 'add-image' | 'none';

export interface ImageEditorHandle {
  getImageDataUrl: () => string | undefined;
}

interface ImageEditorProps {
  image: string;
  tool: Tool;
  brushColor: string;
  brushSize: number;
}

const ImageEditor = forwardRef<ImageEditorHandle, ImageEditorProps>(
  ({ image, tool, brushColor, brushSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useImperativeHandle(ref, () => ({
      getImageDataUrl: () => {
        if (fabricRef.current) {
          return fabricRef.current.toDataURL({ format: 'png', multiplier: 1 });
        }
        return undefined;
      },
    }), []);

    useEffect(() => {
      let isMounted = true;
      if (!canvasRef.current) return;
      // Clean up previous fabric instance
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
      // Create new fabric canvas
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: '#23272e',
        selection: false,
      });
      fabricRef.current = fabricCanvas;

      // Load the image (fabric v5+ signature: url, callback, options)
      fabric.FabricImage.fromURL(image).then(img => {
        if (!img || !isMounted) return;
        // Fit image to canvas size
        const maxW = 1000;
        const maxH = 700;
        let scale = 1;
        if (img.width && img.height) {
          scale = Math.min(maxW / img.width, maxH / img.height, 1);
          img.scale(scale);
          fabricCanvas.setDimensions({
            width: img.width * scale,
            height: img.height * scale,
          });
        }
        fabricCanvas.backgroundImage = img;
        fabricCanvas.requestRenderAll();
      });
      return () => {
        isMounted = false;
        fabricCanvas.dispose();
      };
    }, [image]);

    // Update drawing mode, brush color, and size when tool/brush changes
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      if (tool === 'brush') {
        canvas.isDrawingMode = true;
        // Ensure the brush is initialized
        if (!canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushSize;
      } else {
        canvas.isDrawingMode = false;
      }
    }, [tool, brushColor, brushSize]);

    return (
      <div style={{ boxShadow: '0 4px 32px #0008', borderRadius: 8, background: '#23272e' }}>
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

export default ImageEditor; 