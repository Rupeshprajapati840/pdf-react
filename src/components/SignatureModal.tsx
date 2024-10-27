import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabItem } from "../components/ui/tabs";
import { SignatureIcon } from 'lucide-react';
import { Modal } from 'react-bootstrap';


interface SignatureModalProps {
  addElementToOverlay: (element: HTMLElement) => void;
}

export default function SignatureModal({ addElementToOverlay }: SignatureModalProps) {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [activeTab, setActiveTab] = useState('draw');
  const [signatureText, setSignatureText] = useState('');
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 2;
      }
    }
  }, [currentColor]);

  const handleSaveSignature = () => {
    let signatureDataUrl: string | undefined;

    if (activeTab === 'draw') {
      signatureDataUrl = signatureCanvasRef.current?.toDataURL('image/png');
    } else if (activeTab === 'type') {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCanvas.width = 400;
        tempCanvas.height = 200;
        tempCtx.font = `48px ${currentFont}`;
        tempCtx.fillStyle = currentColor;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(signatureText, tempCanvas.width / 2, tempCanvas.height / 2);
        signatureDataUrl = tempCanvas.toDataURL('image/png');
      }
    } else if (activeTab === 'image') {
      signatureDataUrl = imagePreview || undefined;
    }

    if (signatureDataUrl) {
      const img = new Image();
      img.src = signatureDataUrl;
      img.onload = function () {
        const aspect = img.width / img.height;
        const maxWidth = 200;
        const width = Math.min(maxWidth, img.width);
        const height = width / aspect;

        img.width = width;
        img.height = height;
        img.className = 'draggable';
        img.style.position = 'absolute';
        img.style.left = '10px';
        img.style.top = '10px';
        addElementToOverlay(img);
      };

      onHide();
    }
  };

  const onHide = () => {
    setShowSignatureModal(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context?.beginPath();
    }
  };

  // Define the tab items for the Tabs component
  const tabItems: TabItem[] = [
    {
      key: 'draw',
      title: 'Draw',
      content: (
        <div>
          <canvas
            ref={signatureCanvasRef}
            width={400}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="border border-gray-300"
          />
          <Input
            type="color"
            value={currentColor}
            onChange={(value:any) => setCurrentColor(value)}
            className="mt-2"
          />
        </div>
      ),
    },
    {
      key: 'image',
      title: 'Image',
      content: (
        <div>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="mb-2"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Signature preview" className="max-w-full h-auto" />
          )}
        </div>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      content: (
        <div>
        <Input
          type="text"
          value={signatureText}
          onChange={(value:any) => setSignatureText(value)}
          placeholder="Type your signature"
          className="mb-2"
        />
        {/* <Select
          value={currentFont}
          onValueChange={setCurrentFont}
          className="mb-2"
        >
          <Select.Option value="Arial">Arial</Select.Option>
          <Select.Option value="Times New Roman">Times New Roman</Select.Option>
          <Select.Option value="Courier">Courier</Select.Option>
        </Select> */}
        <Input
          type="color"
          value={currentColor}
          onChange={(value:any) => setCurrentColor(value)}
        />
      </div>
      ),
    },

  ];




  return (
    <>
      <Button variant="dark" size="icon" id="signatureBtn" title="Signature" onClick={() => setShowSignatureModal(true)}><SignatureIcon className="h-4 w-4" /> Signature</Button>
      <Modal show={showSignatureModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Drawing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs items={tabItems} defaultActiveKey="draw" />
        </Modal.Body>
        <Modal.Footer>
         {/*  <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button> */}
        <Button variant="primary" onClick={handleSaveSignature}>
          Save
        </Button>
      </Modal.Footer>
    </Modal >
    </>

 
  );
}
