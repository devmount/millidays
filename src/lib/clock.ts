// Utilities to draw a clock

export enum TimeMode {
  Millidays = 'md',
  Milliseconds = 'ms',
}

export const rect = (width = 10, height = 1.5, x = 35, rotation = 0, color = 'black') => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  node.setAttribute('width', width.toString());
  node.setAttribute('height', height.toString());
  node.setAttribute('x', x.toString());
  node.setAttribute('rx', '.5');
  node.setAttribute('ry', '.5');
  node.setAttribute('fill', color);

  node.style.transform = `rotate(${rotation - 90}deg)`;
  node.style.transformOrigin = `0px ${height / 2}px`;
  node.style.translate = `0px -${height / 2}px`;

  return node;
};

export const text = (text = '', radius = 30, angle = 0, color = 'black', fontSize = '1rem', fontWeight = '400') => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  const x = (radius - text.length + 1) * Math.cos((Math.PI / 180) * angle); // x coordinate in percent
  const y = radius * Math.sin((Math.PI / 180) * angle); // y coordinate in percent

  node.innerHTML = text;
  node.style.fontFamily =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
  node.style.fontSize = fontSize;
  node.style.fontWeight = fontWeight;

  node.setAttribute('x', `${x}%`);
  node.setAttribute('y', `${y}%`);
  node.setAttribute('dominant-baseline', 'middle');
  node.setAttribute('text-anchor', 'middle');
  // node.setAttribute('y', '-10');
  node.setAttribute('fill', color);

  return node;
};
