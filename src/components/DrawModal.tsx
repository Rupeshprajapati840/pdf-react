import React, { useState, useRef, useCallback, useEffect } from 'react' 
import { Modal,Form, Button } from 'react-bootstrap';
import { PencilIcon } from 'lucide-react' 

interface DrawModalProps {  
  addElementToOverlay: (element: HTMLElement) => void;
}

export default function DrawModal({ addElementToOverlay}: DrawModalProps) { 
  const canvasRef = useRef<HTMLCanvasElement>(null) 
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.strokeStyle = 'black';
      context.lineWidth = 2;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const onHide = () => {
    setShowDrawModal(false)
  }

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const img = new Image();
      img.src = dataUrl;
      img.className = 'draggable';
      img.style.position = 'absolute';
      img.style.left = '10px';
      img.style.top = '10px';
      img.style.width = '150px';
      addElementToOverlay(img);
      onHide();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    }
  };
 

  return (
    <>
      <Button variant="dark"  id="drawBtn" title="Draw" onClick={() => setShowDrawModal(true)}><PencilIcon className="h-4 w-4" /> Draw</Button>
      <Modal show={showDrawModal}  onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Drawing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal></>
  )
}