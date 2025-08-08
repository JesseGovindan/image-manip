import * as fabric from 'fabric';

export function CreateBrushTool(fabricCanvas: fabric.Canvas, brushSize: number, brushColor: string) {
  fabricCanvas.isDrawingMode = true;
  // Ensure the brush is initialized
  if (!fabricCanvas.freeDrawingBrush) {
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
  }
  fabricCanvas.freeDrawingBrush.color = brushColor;
  fabricCanvas.freeDrawingBrush.width = brushSize;

  return () => {
    fabricCanvas.isDrawingMode = false
  }
}
