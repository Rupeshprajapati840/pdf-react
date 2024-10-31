'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist'
import interact from 'interactjs';
import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import PDFViewer from './PDFViewer'

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

export default function PDFUserViewer() {
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageOverlays, setPageOverlays] = useState<{ [key: number]: HTMLDivElement }>([])
  const jsonDataRef = useRef(jsonData); // Store jsonData in a ref
  const pdfViewerRef = useRef<HTMLDivElement>(null)

  const loadInitialPDF = useCallback(async () => {
    try {
      const response = await fetch('https://getsamplefiles.com/download/pdf/sample-2.pdf')
      const arrayBuffer = await response.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      await loadPdf(uint8Array)
    } catch (error) {
      console.error('Error loading initial PDF:', error)
    }
  }, [])

  useEffect(() => {
    loadInitialPDF()
  }, [loadInitialPDF])

  useEffect(() => {
    if (pdfBlob) {
      renderPdf()
    }
  }, [pdfBlob, scale, rotation, pageNum])


  
  useEffect(() => {
    jsonDataRef.current = jsonData;
  }, [jsonData]);

  

  const loadPdf = async (pdfData: Uint8Array) => {
    try {
      const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
      setPdfBlob(pdfBlob);
      const pdfDoc = await PDFDocument.load(pdfData);
      setPdfDoc(pdfDoc);
      setPageOverlays([]); 
      setNumPages(pdfDoc.getPageCount());
      setPageNum(1);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const renderPdf = async () => {
    if (!pdfBlob || !pdfViewerRef.current) return;

    try {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const pdf = await pdfjs.getDocument({ url: pdfUrl }).promise;
      const page = await pdf.getPage(pageNum);

      const originalViewport = page.getViewport({ scale: 1, rotation });

      // Calculate the scale to fit the page width to the container
      const containerWidth = pdfViewerRef.current.clientWidth;
      const scale = containerWidth / originalViewport.width;

      const viewport = page.getViewport({ scale, rotation });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';

      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      }

      pdfViewerRef.current.innerHTML = '';
      pdfViewerRef.current.appendChild(canvas);
 

      if (!pageOverlays[pageNum]) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.id = `overlay_${pageNum}`;
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = `${canvas.width}px`;
        overlay.style.height = `${canvas.height}px`;
        pdfViewerRef.current.appendChild(overlay);
        setPageOverlays((prevOverlays) => ({ ...prevOverlays, [pageNum]: overlay }));
      }
      else {
        pdfViewerRef.current.appendChild(pageOverlays[pageNum]);
      }

      // Revoke the object URL after rendering
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error('Error rendering PDF:', error);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer.slice(0)); // Copy the buffer immediately
        setPageNum(0);
        await loadPdf(uint8Array);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }, []);

  const handleZoomIn = useCallback(() => setScale(prevScale => Math.min(prevScale + 0.1, 2)), [])
  const handleZoomOut = useCallback(() => setScale(prevScale => Math.max(prevScale - 0.1, 0.5)), [])
  const handleRotateLeft = useCallback(() => setRotation(prevRotation => (prevRotation - 90 + 360) % 360), [])
  const handleRotateRight = useCallback(() => setRotation(prevRotation => (prevRotation + 90) % 360), [])
  const handlePrevPage = useCallback(() => setPageNum(prevPageNum => Math.max(prevPageNum - 1, 1)), [])
  const handleNextPage = useCallback(() => setPageNum(prevPageNum => Math.min(prevPageNum + 1, numPages)), [numPages])

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



  const convertImageToPng = useCallback((imgElement: HTMLImageElement): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx?.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
      canvas.toBlob((blob) => resolve(blob as Blob), 'image/png');
    });
  }, []);

  const handleDownload = useCallback(async () => {
    try {

      if (pdfDoc) {
        const pages = pdfDoc.getPages();
        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
          const page = pages[pageIndex];
          const { width, height } = page.getSize();
          const overlay = pageOverlays[pageIndex + 1];

          if (overlay) {
            const elements = Array.from(overlay.querySelectorAll('.draggable'));
            for (const element of elements) {
              const rect = element.getBoundingClientRect();
              const overlayRect = overlay.getBoundingClientRect();

              const pdfX = (rect.left - overlayRect.left) / overlayRect.width * width;
              const pdfY = height - ((rect.top - overlayRect.top) / overlayRect.height * height) - (rect.height / overlayRect.height * height);

              if (element instanceof HTMLImageElement) {
                try {
                  const pngBlob = await convertImageToPng(element);
                  const pngArrayBuffer = await pngBlob.arrayBuffer();
                  const pngImage = await pdfDoc.embedPng(pngArrayBuffer);
                  page.drawImage(pngImage, {
                    x: pdfX,
                    y: pdfY,
                    width: (rect.width / overlayRect.width) * width,
                    height: (rect.height / overlayRect.height) * height,
                  });
                } catch (error) {
                  console.error(`Error embedding image on page ${pageIndex + 1}:`, error);
                }
              } else if (element instanceof HTMLDivElement || element instanceof HTMLInputElement) {
                const text = element.textContent || (element as HTMLInputElement).value || '';
                page.drawText(text, {
                  x: pdfX,
                  y: pdfY,
                  size: 12 * (height / overlayRect.height),
                  color: rgb(0, 0, 0),
                });
              } else if (element.classList.contains('annotation')) {
                page.drawRectangle({
                  x: pdfX,
                  y: pdfY,
                  width: (rect.width / overlayRect.width) * width,
                  height: (rect.height / overlayRect.height) * height,
                  color: rgb(1, 1, 0),
                });
              }
            }
          }
        }

        const PdfBytes = await pdfDoc.save();
        const blob = new Blob([PdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "modified.pdf";
        link.click();
      }
      // toast({
      //   title: "PDF Downloaded",
      //   description: "Your modified PDF has been successfully downloaded.",
      // });
    } catch (error) {
      console.error("Error saving PDF:", error);
      // toast({
      //   title: "Error",
      //   description: "An error occurred while saving the PDF. Please try again.",
      //   variant: "destructive",
      // });
    }
  }, [pdfBlob, pageOverlays, convertImageToPng]);


  const convertJSONToOverlays = useCallback(() => { 
    if (!pdfDoc) return; 
    jsonDataRef.current.forEach((item) => {
      if (!pageOverlays[item.page]) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.id = `overlay_${item.page}`;
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none'; 
        setPageOverlays((prevOverlays) => ({ ...prevOverlays, [pageNum]: overlay }));
      }    
      const element = createElementFromJSON(item);
      if (element) { 
        console.log(element);
        addElementToOverlay(element) 
      }
    });
 
  }, [pdfDoc,pageOverlays]);

  const createElementFromJSON = (item: any): HTMLElement | null => {
    let element: HTMLElement | null = null;


    switch (item.type) {
      case 'img':
        element = document.createElement('img');
        (element as HTMLImageElement).src = item.content;
        break;
      case 'div':
      case 'input':
        element = document.createElement(item.type);
        if (item.type === 'input') {
          (element as HTMLInputElement).value = item.content;
        }
        break;
      case 'highlight':
        element = document.createElement('div');
        element.classList.add('annotation');
        break;
      default:
        console.warn(`Unsupported element type: ${item.type}`);
        return null;
    }
    if (element != null) {
      element.className += ' draggable';
      element.style.position = 'absolute';
      element.style.left = `${item.x * 100}%`;
      element.style.top = `${item.y * 100}%`;
      element.style.width = `${item.width * 100}%`;
      element.style.height = `${item.height * 100}%`;
    }
    return element;
  };



  const getJsonData = useCallback(async () => {
    const jsonData = [];

    if (pdfDoc) {
      for (let pageIndex = 1; pageIndex <= pdfDoc.getPageCount(); pageIndex++) {
        const overlay = pageOverlays[pageIndex];
        if (overlay) {
          const elements = Array.from(overlay.querySelectorAll('.draggable'));

          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const overlayRect = overlay.getBoundingClientRect();

            const x = (rect.left - overlayRect.left) / overlayRect.width;
            const y = (rect.top - overlayRect.top) / overlayRect.height;
            const width = rect.width / overlayRect.width;
            const height = rect.height / overlayRect.height;

            let content = '';
            let type = element.tagName.toLowerCase();

            if (element instanceof HTMLElement) {
              content = element.textContent || (element as HTMLInputElement).value || '';
            }

            if (element.classList.contains('annotation')) {
              type = 'highlight';
            }

            if (element instanceof HTMLImageElement) {
              content = await new Promise<string>((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  resolve(canvas.toDataURL('image/png'));
                };
                img.src = element.src;
              });
            }

            jsonData.push({
              type: type,
              content: content,
              x: x,
              y: y,
              width: width,
              height: height,
              page: pageIndex
            });
          }
        }
      }
    }
    return jsonData;
  }, [pdfDoc, pageOverlays]);

  const handleGetJson = useCallback(async () => {
    try {
      const jsonData = await getJsonData();
      console.log(JSON.stringify(jsonData, null, 2));
      // const response = await fetch('/api/save-form', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(jsonData),
      // });
      // const data = await response.json();
      // console.log('Success:', data);
      // toast({
      //   title: "Success",
      //   description: "Form data saved successfully",
      // });
    } catch (error) {
      console.error('Error:', error);
      // toast({
      //   title: "Error",
      //   description: "Error saving form data",
      //   variant: "destructive",
      // });
    }
  }, [getJsonData]);

  const handlePrint = useCallback(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const windowContent = `<iframe width='100%' height='100%' src='${url}'></iframe>`
      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.open()
        printWindow.document.write(windowContent)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }, [pdfBlob])

  return (
    <div className="container-fluid min-h-screen flex flex-col">
      <Toolbar
        scale={scale}
        setScale={setScale}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleRotateLeft={handleRotateLeft}
        handleRotateRight={handleRotateRight}
        handleDownload={handleDownload}
        handlePrint={handlePrint}
        handleGetJson={handleGetJson}
        handleFileUpload={handleFileUpload}
        pageNum={pageNum}
        numPages={numPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        setPageNum={setPageNum}
        setJsonData={setJsonData}
        pageOverlays={pageOverlays}
        addElementToOverlay={addElementToOverlay}
      />
      <div className="row flex-grow-1">
        <Sidebar numPages={numPages} onPageClick={setPageNum} pdfBlob={pdfBlob} />
        <PDFViewer pdfViewerRef={pdfViewerRef} />
        <div className="col-auto p-0">
          <div className="sidebar">
          </div>
        </div>
      </div>

    </div>
  )
}