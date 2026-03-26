import { type OpepenOptions, type Rotation, GRID_SIZE, opepenGrid, prepare } from './core.js';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function arcPath(col: number, row: number, rotation: Rotation): string {
  switch (rotation) {
    case 'topLeft':
      return `M${col+1} ${row+2}L${col+1} ${row+1} ${col} ${row+1}A1 1 0 0 1 ${col+1} ${row}L${col+1} ${row+2}Z`;
    case 'topRight':
      return `M${col} ${row+1}L${col} ${row}A1 1 0 0 1 ${col+1} ${row+1}Z`;
    case 'bottomLeft':
      return `M${col+1} ${row}L${col+1} ${row+1}A1 1 0 0 1 ${col} ${row}Z`;
    case 'bottomRight':
      return `M${col} ${row-1}L${col} ${row} ${col+1} ${row}A1 1 0 0 1 ${col} ${row+1}Z`;
  }
}

export function renderSVG(opts: OpepenOptions = {}): string {
  const { color, bgcolor, spotcolor, imageData } = prepare(opts);

  const sizeAttr = opts.size ? ` width="${opts.size}" height="${opts.size}"` : '';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"${sizeAttr} viewBox="0 0 ${GRID_SIZE} ${GRID_SIZE}">`;
  svg += `<rect width="${GRID_SIZE}" height="${GRID_SIZE}" fill="${esc(bgcolor)}"/>`;

  for (let i = 0; i < imageData.length; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const gridItem = opepenGrid.find(item => item.row === row + 1 && item.col === col + 1);

    // Border pixels
    if (row === 0 || col === 0 || col === GRID_SIZE - 1) {
      if (imageData[i]) {
        const fill = esc(imageData[i] === 1 ? color : spotcolor);
        svg += `<rect x="${col}" y="${row}" width="1" height="1" fill="${fill}"/>`;
      }
    }

    // Opepen grid items
    if (gridItem) {
      const fill = esc(imageData[i] === 1 ? color : spotcolor);

      if (gridItem.type === 'square') {
        svg += `<rect x="${col}" y="${row}" width="1" height="1" fill="${fill}"/>`;
      }

      if (gridItem.type === 'arc' && gridItem.rotation) {
        svg += `<path d="${arcPath(col, row, gridItem.rotation)}" fill="${fill}"/>`;
      }
    }
  }

  svg += '</svg>';
  return svg;
}
