import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as fabric from 'fabric';

export type Tool = 'brush' | 'text' | 'add-image' | 'none' | 'line';

export interface ImageEditorHandle {
  getImageDataUrl: () => string | undefined;
  undo: () => void;
  redo: () => void;
}

interface ImageEditorProps {
  image: string;
  tool: Tool;
  brushColor: string;
  brushSize: number;
  setCanRedo: (canRedo: boolean) => void;
  setCanUndo: (canUndo: boolean) => void;
}

const ImageEditor = forwardRef<ImageEditorHandle, ImageEditorProps>(
  ({ image, tool, brushColor, brushSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    // History stacks for undo/redo
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);

    useImperativeHandle(ref, () => ({
      getImageDataUrl: () => {
        if (fabricRef.current) {
          return fabricRef.current.toDataURL({ format: 'png', multiplier: 1 });
        }
        return undefined;
      },
      undo: () => {
        const canvas = fabricRef.current;
        if (!canvas || undoStack.current.length < 2) return;
        // Pop current state, push to redo
        const current = undoStack.current.pop();
        if (current) redoStack.current.push(current);
        const prev = undoStack.current[undoStack.current.length - 1];
        if (prev) {
          canvas.loadFromJSON(prev, () => {
            canvas.renderAll();
          });
        }
      },
      redo: () => {
        const canvas = fabricRef.current;
        if (!canvas || redoStack.current.length === 0) return;
        const next = redoStack.current.pop();
        if (next) {
          undoStack.current.push(next);
          canvas.loadFromJSON(next, () => {
            canvas.renderAll();
          });
        }
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
        // Save initial state to undo stack
        undoStack.current = [fabricCanvas.toJSON() as unknown as string];
        redoStack.current = [];
      });
      // Listen for changes to push to undo stack
      const saveState = () => {
        console.log('Saving state');
        // Only push if not identical to last
        const canvas = fabricRef.current;
        if (!canvas) {
          console.warn('Fabric canvas not initialized');
          return;
        }
        const json = canvas.toJSON() as unknown as string;
        const hasStateChanged = undoStack.current[undoStack.current.length - 1] !== json;
        if (!hasStateChanged) {
          console.log('State has not changed, skipping save');
          return;
        }

        undoStack.current.push(json);
        // Clear redo stack on new action
        redoStack.current = [];
      };
      fabricCanvas.on('object:added', saveState);
      fabricCanvas.on('object:modified', saveState);
      fabricCanvas.on('object:removed', saveState);
      fabricCanvas.on('path:created', saveState);


      return () => {
        isMounted = false;
        fabricCanvas.dispose();
      };
    }, [image]);

    useEffect(() => {
      const fabricCanvas = fabricRef.current
      if (!fabricCanvas) {
        return
      }
      let line: fabric.Line | undefined = undefined

      const handleMouseDown = (o: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (tool !== 'line') {
          return
        }
        const pointer = fabricCanvas.getViewportPoint(o.e)
        line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          strokeWidth: brushSize,
          stroke: brushColor,
        })
        line.selectable = false
        line.evented = false
        line.strokeUniform = true
        fabricCanvas.add(line)
      }

      fabricCanvas.on('mouse:down', handleMouseDown)

      const handleMouseMove = (o: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (!line) {
          return
        }

        const pointer = fabricCanvas.getViewportPoint(o.e)
        line.set({
          x2: pointer.x,
          y2: pointer.y,
        })

        fabricCanvas.renderAll()
      }
      fabricCanvas.on('mouse:move', handleMouseMove)

      const handleMouseUp = (o: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (!line || !fabricCanvas) {
          return
        }

        const { x, y } = fabricCanvas.getViewportPoint(o.e)
        const boundary = fabricCanvas.calcViewportBoundaries().br
        const withinBounds = x >= 0 && x <= boundary.x && y >= 0 && y <= boundary.y
        if (!withinBounds) {
          fabricCanvas.remove(line)
          line = undefined
          return
        }

        line.setCoords()
        fabricCanvas.fire('object:modified')
        line = undefined
      }

      fabricCanvas.on('mouse:up', handleMouseUp)

      return () => {
        fabricCanvas.off('mouse:down', handleMouseDown)
        fabricCanvas.off('mouse:move', handleMouseMove)
        fabricCanvas.off('mouse:up', handleMouseUp)
      }
    }, [fabricRef, brushColor, brushSize, tool])

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
      } 
      else {
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
