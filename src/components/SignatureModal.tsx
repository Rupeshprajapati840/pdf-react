import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Form, Button, Tabs, Tab } from 'react-bootstrap';

import { SignatureIcon, Trash2Icon } from 'lucide-react';
import { Modal } from 'react-bootstrap';

interface SignatureModalProps {
  addElementToOverlay: (element: HTMLElement) => void;
}

export default function SignatureModal({ addElementToOverlay }: SignatureModalProps) {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [activeTab, setActiveTab] = useState('draw');
  const [signatureText, setSignatureText] = useState('');
  const [currentFont, setCurrentFont] = useState('Caveat'); // Default font
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
    } else if (activeTab === 'image' && imagePreview) {
      signatureDataUrl = imagePreview; 
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
    setShowSignatureModal(false);
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  }, []);

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

  const clearDrawing = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearText = () => {
    setSignatureText('');
  };
  const handleSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key); // Only update if key is not null
    }
  };

  const handleColorClick = (color: string) => {
    setCurrentColor(color); // Set the current color to the clicked button's data-color
  };
  const handleFontClick = (font: string) => {
    setCurrentFont(font); // Set the current font to the clicked button's data-font
  };
  return (
    <>
      <Button variant="dark" onClick={() => setShowSignatureModal(true)}>
        <SignatureIcon className="h-4 w-4 mr-2" /> Signature
      </Button>
      <Modal show={showSignatureModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Signature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="draw" activeKey={activeTab} id="uncontrolled-tab-example" className="mb-3" onSelect={handleSelect} >
            <Tab eventKey="draw" title="Draw">
              <div className='text-center'>

                <canvas
                  ref={signatureCanvasRef}
                  width={465}
                  height={250}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  className="border border-gray-300"
                />
                <div className="mt-2 flex justify-between items-center">
                  <div className="color-selector mb-3">
                    <button
                      className={`color-option ${currentColor === '#000000' ? 'active' : ''}`}
                      data-color="#000000"
                      style={{ backgroundColor: '#000000' }}
                      onClick={() => handleColorClick('#000000')}
                    ></button>
                    <button
                      className={`color-option ${currentColor === '#2293fb' ? 'active' : ''}`}
                      data-color="#2293fb"
                      style={{ backgroundColor: '#2293fb' }}
                      onClick={() => handleColorClick('#2293fb')}
                    ></button>
                    <button
                      className={`color-option ${currentColor === '#4636e3' ? 'active' : ''}`}
                      data-color="#4636e3"
                      style={{ backgroundColor: '#4636e3' }}
                      onClick={() => handleColorClick('#4636e3')}
                    ></button>
                  </div>
                  <Button onClick={clearDrawing} variant="danger" size="sm">
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </Tab>
            <Tab eventKey="image" title="Image">
              <div>
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="mb-2"
                />
                {imagePreview && (
                  <div className="relative text-center">
                    <img src={imagePreview} alt="Signature preview" style={{ maxWidth: '200px' }} className="max-w-full h-auto" />
                    <br /> <Button onClick={clearImage} variant="danger" size="sm" className="mt-2">
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey="type" title="Type">
              <div className='text-center'>

                <Form.Control
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Type your signature"
                  className="mb-2"
                /> 

                <div className="font-selector mb-3">
                  <button
                    className={`font-option ${currentFont === 'Caveat' ? 'active' : ''}`}
                    style={{ fontFamily: 'Caveat' }}
                    data-font="Caveat"
                    onClick={() => handleFontClick('Caveat')}  
                  >
                    Signature
                  </button>
                  <button
                    className={`font-option ${currentFont === 'Pacifico' ? 'active' : ''}`}
                    style={{ fontFamily: 'Pacifico' }}
                    data-font="Pacifico"
                    onClick={() => handleFontClick('Pacifico')}  
                  >
                    Signature
                  </button>
                  <button
                    className={`font-option ${currentFont === 'Marck Script' ? 'active' : ''}`}
                    style={{ fontFamily: 'Marck Script' }}
                    data-font="Marck Script"
                    onClick={() => handleFontClick('Marck Script')}  
                  >
                    Signature
                  </button>
                  <button
                    className={`font-option ${currentFont === 'Meddon' ? 'active' : ''}`}
                    style={{ fontFamily: 'Meddon' }}
                    data-font="Meddon"
                    onClick={() => handleFontClick('Meddon')} 
                  >
                    Signature
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="color-selector mb-3">
                    <button
                      className={`color-option ${currentColor === '#000000' ? 'active' : ''}`}
                      data-color="#000000"
                      style={{ backgroundColor: '#000000' }}
                      onClick={() => handleColorClick('#000000')}
                    ></button>
                    <button
                      className={`color-option ${currentColor === '#2293fb' ? 'active' : ''}`}
                      data-color="#2293fb"
                      style={{ backgroundColor: '#2293fb' }}
                      onClick={() => handleColorClick('#2293fb')}
                    ></button>
                    <button
                      className={`color-option ${currentColor === '#4636e3' ? 'active' : ''}`}
                      data-color="#4636e3"
                      style={{ backgroundColor: '#4636e3' }}
                      onClick={() => handleColorClick('#4636e3')}
                    ></button>
                  </div>
                  <Button onClick={clearText} variant="danger" size="sm">
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleSaveSignature}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}