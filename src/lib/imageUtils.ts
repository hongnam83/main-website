export const compressImage = (file: File, maxDimension: number = 800, quality: number = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate object URL directly from file, no need to use FileReader
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    
    img.onload = () => {
      // Optional: revoke object URL to free memory
      URL.revokeObjectURL(objectUrl);
      
      const canvas = document.createElement('canvas');
      let targetWidth = img.width;
      let targetHeight = img.height;

      // Constrain box
      if (img.width > maxDimension || img.height > maxDimension) {
        if (img.width > img.height) {
          targetWidth = maxDimension;
          targetHeight = Math.round((img.height / img.width) * maxDimension);
        } else {
          targetHeight = maxDimension;
          targetWidth = Math.round((img.width / img.height) * maxDimension);
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      // Fix background for JPEG by filling with white
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
  });
};
