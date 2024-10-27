import React from 'react'

interface PDFViewerProps {
  pdfViewerRef: React.RefObject<HTMLDivElement>
}

export default function PDFViewer({ pdfViewerRef }: PDFViewerProps) {
  return (
    <div className="col position-relative">
      <div id="pdf-viewer" ref={pdfViewerRef} className="w-full h-full"></div>
    </div>
  )
}