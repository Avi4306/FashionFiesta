import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogActions, DialogContent, Button, Slider } from '@mui/material';
import getCroppedImg from './CropImageutils';

const CropperDialog = ({ imageSrc, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropDone(croppedImage);
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogContent style={{ height: 300, position: 'relative' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </DialogContent>
      <DialogActions>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e, z) => setZoom(z)}
        />
        <Button variant="contained" onClick={handleCrop}>Crop</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropperDialog;
