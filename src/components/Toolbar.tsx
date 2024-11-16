import React, { useCallback, useRef } from 'react'
import { Form, Button } from 'react-bootstrap';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Download, Printer, Upload, ChevronLeft, ChevronRight,PencilIcon,
  SignatureIcon,TypeIcon, TextCursorInputIcon,ImageIcon,HighlighterIcon,SquareSquare,ArrowRightLeftIcon,ArrowUpDownIcon } from 'lucide-react'
import SignatureModal from './SignatureModal'
import DrawModal from  '../components/DrawModal'
import AnnotationModal from '../components/AnnotationModal'

interface ToolbarProps {
  scale: number
  setScale: (scale: number) => void
  handleZoomIn: () => void
  handleZoomOut: () => void
  handleRotateLeft: () => void
  handleRotateRight: () => void
  handleDownload: () => void
  handlePrint: () => void 
  handleGetJson:()=> void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  pageNum: number
  numPages: number
  handlePrevPage: () => void
  handleNextPage: () => void
  setPageNum: (pageNum: number) => void 
  addElementToOverlay:(element: HTMLElement) => void
  handleReadFile:() => void
}

export default function Toolbar({ 
  scale,
  setScale,
  handleZoomIn,
  handleZoomOut,
  handleRotateLeft,
  handleRotateRight,
  handleDownload,
  handlePrint, 
  handleGetJson,
  handleFileUpload,
  pageNum,
  numPages,
  handlePrevPage,
  handleNextPage,
  setPageNum, 
  addElementToOverlay,
  handleReadFile
}: ToolbarProps) {


  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleAddText = () => {
    const text = prompt('Enter text:');
    if (text) {
      const textElement = document.createElement('div');
      textElement.textContent = text;
      textElement.className = 'draggable';
      textElement.style.position = 'absolute';
      textElement.style.left = '10px';
      textElement.style.top = '10px';
      textElement.style.color = 'black';
      textElement.style.padding = '5px';
      addElementToOverlay(textElement);
    }
  }; 

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          img.className = 'draggable';
          img.style.position = 'absolute';
          img.style.left = '10px';
          img.style.top = '10px';
          img.style.width = '150px';
          addElementToOverlay(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddInput = () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control draggable';
    input.style.position = 'absolute';
    input.style.left = '10px';
    input.style.top = '10px';
    input.style.width = '150px';
    addElementToOverlay(input);
  };
 

  return (
    <div className="row toolbar">
      <div className="col d-flex flex-wrap gap-2 align-items-center">
        <Button variant="dark" id="zoomIn" title="Zoom Out" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="dark" id="zoomOut" title="Zoom In" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button> 
        <Form.Control type="range" className="form-range" id="zoomSlider" min="50" max="200" value={(scale * 100).toString()} 
          onChange={(e) => setScale(parseInt(e.target.value) / 100)} style={{ width: '180px' }}  /> 
        <span className="align-self-center" style={{width:'50px'}} id="zoomValue">{Math.round(scale * 100)}%</span>



        <Button variant="dark"   id="fitWidth" title="Fit Width" ><ArrowRightLeftIcon className="h-4 w-4" /></Button>
        <Button variant="dark"   id="fitHeight"  title="Fit Height" ><ArrowUpDownIcon className="h-4 w-4" /></Button>
        <Button variant="dark"   id="rotateLeft"  title="Rotate Left"  onClick={handleRotateLeft}><RotateCcw className="h-4 w-4" /></Button>
        <Button variant="dark"   id="rotateRight"  title="Roatate Right"  onClick={handleRotateRight}><RotateCw className="h-4 w-4" /></Button>
        <SignatureModal addElementToOverlay={addElementToOverlay} /> 
        <Button variant="dark"id="textBtn" title="Text" onClick={handleAddText}><TypeIcon className="h-4 w-4" /> Text</Button> 
        <DrawModal addElementToOverlay={addElementToOverlay} />
        <Button variant="dark"id="imageBtn" title="Image" onClick={() => imageInputRef.current?.click()}><ImageIcon className="h-4 w-4" /> Image</Button>
        <input
        type="file"
        ref={imageInputRef}
        style={{ display: 'none' }}
        accept="image/*" 
        onChange={handleImageUpload}
      />
        <Button variant="dark" id="highlightBtn" title="Highlight"><HighlighterIcon className="h-4 w-4" /> Highlight</Button>    
        <AnnotationModal addElementToOverlay={addElementToOverlay}  />
        <Button variant="dark" id="inputBtn" title="Input" onClick={handleAddInput}><TextCursorInputIcon className="h-4 w-4" />Input</Button>
        <Button variant="dark" id="downloadBtn" title="Download" onClick={handleDownload}><Download className="h-4 w-4" /> Download</Button>
        <Button variant="dark" id="printBtn" title="Print" onClick={handlePrint}><Printer className="h-4 w-4" /> Print</Button>
        <Button variant="dark" id="getJsonBtn" title="GET Json" onClick={handleGetJson}>Get JSON</Button>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button variant="dark" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />Upload PDF
        </Button> 
        <Button variant="dark" id="readJsonBtn" title="GET Json" onClick={handleReadFile }>Read JSON File</Button>
        <div className="page-nav d-flex align-items-center ms-auto">
          <Button variant="dark" onClick={handlePrevPage}><ChevronLeft className="h-4 w-4" /></Button>
          <div className=" d-flex">
            <Form.Control
              type="number"
              value={pageNum}
              onChange={(e) => setPageNum(Math.max(1, Math.min(Number(e.target.value), numPages)))}
              className="ms-2 text-center me-2"
            />
            <span className="w-100 text-sm p-1" >/ {numPages}</span>
          </div>
          <Button variant="dark" onClick={handleNextPage}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>)
}