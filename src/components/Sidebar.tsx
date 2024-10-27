import React, { useEffect, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface SidebarProps {
  numPages: number;
  onPageClick: (pageNum: number) => void;
  pdfBytes: ArrayBuffer | null;
}

export default function Sidebar({ numPages, onPageClick, pdfBytes }: SidebarProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const generateThumbnails = useCallback(async () => {
    if (!pdfBytes) return;
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      //const newThumbnails = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
       // newThumbnails.push(canvas.toDataURL());
      }

     // setThumbnails(newThumbnails);
    } catch (error) {
      console.error('Error generating PDF thumbnails:', error);
    }
  }, [pdfBytes, numPages]);

  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  return (
    <div className="col-auto p-0">
      <div
        className="sidebar"
        style={{
          width: '250px',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          borderRight: '1px solid #ccc',
          padding: '10px'
        }}
      >
        {thumbnails.length > 0 ? (
          thumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Page ${index + 1}`}
              className="thumbnail w-100 mb-2 border"
              style={{ cursor: 'pointer' }}
              onClick={() => onPageClick(index + 1)}
            />
          ))
        ) : (
          <p>No Thumbnails Available</p>
        )}
      </div>
    </div>
  );
}
