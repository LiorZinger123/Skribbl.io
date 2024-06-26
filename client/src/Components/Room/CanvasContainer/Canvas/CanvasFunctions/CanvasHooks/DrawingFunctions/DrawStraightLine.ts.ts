import { drawStarightLineType } from "../../../../../../../types/RoomTypes/types"

const DrawStarightLine = ({e, canvasRect, ctx, prevPoint, width, color}: drawStarightLineType) => {
    const end = {x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top}
    const start = prevPoint.current ?? end
    ctx.beginPath()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    prevPoint.current = end
}

export default DrawStarightLine