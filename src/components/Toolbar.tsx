import React, { useCallback, useRef } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import interact from 'interactjs';
import { Slider } from "../components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Download, Printer, Upload, ChevronLeft, ChevronRight,PencilIcon,
  SignatureIcon,TypeIcon, TextCursorInputIcon,ImageIcon,HighlighterIcon,SquareSquare,ArrowRightLeftIcon,ArrowUpDownIcon } from 'lucide-react'
import SignatureModal from './SignatureModal'
import DrawModal from './DrawModal'
import AnnotationModal from './AnnotationModal'

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
  pageOverlays: { [key: number]: HTMLDivElement };
}

export function Toolbar({ 
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
  pageOverlays
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

  const makeElementDraggable = useCallback((element: HTMLElement) => {
    interact(element)
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        listeners: {
          move: dragMoveListener,
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: resizeMoveListener,
        }
      });
  }, []);

  const dragMoveListener = (event: Interact.DragEvent) => {
    const target = event.target as HTMLElement;
    const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute('data-x', x.toString());
    target.setAttribute('data-y', y.toString());
  };

  const resizeMoveListener = (event: Interact.ResizeEvent) => {
    const target = event.target as HTMLElement;
    let x = (parseFloat(target.getAttribute('data-x') || '0') || 0);
    let y = (parseFloat(target.getAttribute('data-y') || '0') || 0);

    target.style.width = `${event.rect.width}px`;
    target.style.height = `${event.rect.height}px`;

      // Check if event.deltaRect exists before accessing its properties
      if (event.deltaRect) {
        x += event.deltaRect.left;
        y += event.deltaRect.top;
      }

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute('data-x', x.toString());
    target.setAttribute('data-y', y.toString());
  };

  const addElementToOverlay = useCallback((element: HTMLElement) => {
    if (pageOverlays[pageNum]) {
      pageOverlays[pageNum].appendChild(element);
      makeElementDraggable(element);
    }
  }, [pageNum, pageOverlays, makeElementDraggable]);

    

  return (
    <div className="row toolbar">
      <div className="col d-flex flex-wrap gap-2 align-items-center">
        <Button variant="dark" id="zoomIn" title="Zoom Out" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="dark" id="zoomOut" title="Zoom In" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
        {/* <Slider
          className="w-24"
          min={50}
          max={200}
          step={1}
          value={[scale * 100]}
          onValueChange={(value) => setScale(value[0] / 100)}
        />
        <span className="text-sm">{Math.round(scale * 100)}%</span> */}
        <Input type="range" className="form-range align-self-center" id="zoomSlider" min="50" max="200" value={[scale * 100]}
          onValueChange={(value:any) => setScale(value[0] / 100)} />
        <span className="align-self-center" id="zoomValue">{Math.round(scale * 100)}%</span>
        <Button variant="dark" size="icon" id="fitWidth" title="Fit Width" ><ArrowRightLeftIcon className="h-4 w-4" /></Button>
        <Button variant="dark" size="icon" id="fitHeight"  title="Fit Height" ><ArrowUpDownIcon className="h-4 w-4" /></Button>
        <Button variant="dark" size="icon" id="rotateLeft"  title="Rotate Left"  onClick={handleRotateLeft}><RotateCcw className="h-4 w-4" /></Button>
        <Button variant="dark" size="icon" id="rotateRight"  title="Roatate Right"  onClick={handleRotateRight}><RotateCw className="h-4 w-4" /></Button>
        <SignatureModal addElementToOverlay={addElementToOverlay} /> 
        <Button variant="dark" size="icon" id="textBtn" title="Text" onClick={handleAddText}><TypeIcon className="h-4 w-4" /> Text</Button> 
        <DrawModal addElementToOverlay={addElementToOverlay} />
        <Button variant="dark" size="icon" id="imageBtn" title="Image" onClick={() => imageInputRef.current?.click()}><ImageIcon className="h-4 w-4" /> Image</Button>
        <input
        type="file"
        ref={imageInputRef}
        style={{ display: 'none' }}
        accept="image/*" 
        onChange={handleImageUpload}
      />
        <Button variant="dark" size="icon" id="highlightBtn" title="Highlight"><HighlighterIcon className="h-4 w-4" /> Highlight</Button>    
        <AnnotationModal addElementToOverlay={addElementToOverlay}  />
        <Button variant="dark" size="icon" id="inputBtn" title="Input" onClick={handleAddInput}><TextCursorInputIcon className="h-4 w-4" />Input</Button>
        <Button variant="dark" size="icon" id="downloadBtn" title="Download" onClick={handleDownload}><Download className="h-4 w-4" /> Download</Button>
        <Button variant="dark" size="icon" id="printBtn" title="Print" onClick={handlePrint}><Printer className="h-4 w-4" /> Print</Button>
        <Button variant="dark" size="icon" id="getJsonBtn" title="GET Json" onClick={handleGetJson}>Get JSON</Button>
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

        <div className="page-nav d-flex align-items-center ms-auto">
          <Button variant="dark" size="icon" onClick={handlePrevPage}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="mt-3 d-flex">
            <Input
              type="number"
              value={pageNum}
              onChange={(value:any) => setPageNum(Math.max(1, Math.min(Number(value), numPages)))}
              className="ms-2 text-center me-2"
            />
            <span className="w-100 text-sm p-1" >/ {numPages}</span>
          </div>
          <Button variant="dark" size="icon" onClick={handleNextPage}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>)
}