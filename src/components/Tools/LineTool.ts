import * as fabric from 'fabric';

export function CreateLineTool(fabricCanvas: fabric.Canvas, brushSize: number, brushColor: string) {
  let line: fabric.Line | undefined = undefined

  const handleMouseDown = (o: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
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
}
