document.getElementById('upload').addEventListener('change', handleImage, false);

function handleImage(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvasSize = 200; // Adjust the size of each canvas piece
      const pieces = [
        document.getElementById('piece1').getContext('2d'),
        document.getElementById('piece2').getContext('2d'),
        document.getElementById('piece3').getContext('2d'),
        document.getElementById('piece4').getContext('2d'),
      ];

      const pieceSize = Math.min(img.width, img.height) / 2;
      
      pieces.forEach((ctx, index) => {
        ctx.canvas.width = canvasSize;
        ctx.canvas.height = canvasSize;
      });

      // Top-left piece
      pieces[0].drawImage(img, 0, 0, pieceSize, pieceSize, 0, 0, canvasSize, canvasSize);
      // Top-right piece
      pieces[1].drawImage(img, pieceSize, 0, pieceSize, pieceSize, 0, 0, canvasSize, canvasSize);
      // Bottom-left piece
      pieces[2].drawImage(img, 0, pieceSize, pieceSize, pieceSize, 0, 0, canvasSize, canvasSize);
      // Bottom-right piece
      pieces[3].drawImage(img, pieceSize, pieceSize, pieceSize, pieceSize, 0, 0, canvasSize, canvasSize);
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}
