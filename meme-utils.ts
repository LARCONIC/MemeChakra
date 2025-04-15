/**
 * Generates a meme by rendering an image with top and bottom text on a canvas
 */
export function generateMeme(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  topText: string,
  bottomText: string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate aspect ratio to maintain proportions
  const hRatio = canvas.width / image.width;
  const vRatio = canvas.height / image.height;
  const ratio = Math.min(hRatio, vRatio);
  
  // Calculate centered position
  const centerX = (canvas.width - image.width * ratio) / 2;
  const centerY = (canvas.height - image.height * ratio) / 2;
  
  // Draw image
  ctx.drawImage(
    image, 
    0, 0, image.width, image.height,
    centerX, centerY, image.width * ratio, image.height * ratio
  );
  
  // Configure text style
  const fontSize = Math.floor(canvas.width / 15);
  ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = fontSize / 15;
  
  // Draw top text
  wrapText(ctx, topText, canvas.width / 2, 20, canvas.width - 40, fontSize * 1.2);
  
  // Draw bottom text
  ctx.textBaseline = 'bottom';
  wrapText(ctx, bottomText, canvas.width / 2, canvas.height - 20, canvas.width - 40, fontSize * 1.2, true);
}

/**
 * Wraps text to fit within a specified width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string, 
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  fromBottom: boolean = false
): void {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  
  // If drawing from bottom, adjust y position
  if (fromBottom) {
    y -= (lines.length - 1) * lineHeight;
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Draw text outline (stroke)
    ctx.strokeText(line, x, y + (i * lineHeight));
    // Draw text fill
    ctx.fillText(line, x, y + (i * lineHeight));
  }
}

/**
 * Downloads the meme as a PNG image
 */
export function downloadMeme(canvas: HTMLCanvasElement, filename: string): void {
  // Create a temporary link
  const link = document.createElement('a');
  link.download = filename;
  
  // Convert canvas to data URL
  link.href = canvas.toDataURL('image/png');
  
  // Append to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
