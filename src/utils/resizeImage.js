const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;
        image.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Calculate new dimensions while maintaining the aspect ratio
          let newWidth = image.width;
          let newHeight = image.height;
  
          if (newWidth > maxWidth) {
            newHeight = (maxWidth / newWidth) * newHeight;
            newWidth = maxWidth;
          }
  
          if (newHeight > maxHeight) {
            newWidth = (maxHeight / newHeight) * newWidth;
            newHeight = maxHeight;
          }
  
          // Resize the canvas
          canvas.width = newWidth;
          canvas.height = newHeight;
  
          // Draw the image on the canvas
          ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
          // Convert canvas to Blob (resized image)
          canvas.toBlob((blob) => {
            resolve(blob);
          }, file.type || 'image/png');
        };
      };
  
      reader.onerror = reject;
  
      // Read the file as DataURL
      reader?.readAsDataURL(file);
    });
  };
  export default resizeImage;