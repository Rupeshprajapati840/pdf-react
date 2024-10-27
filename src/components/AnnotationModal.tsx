import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { SquareSquare } from 'lucide-react';
import { Modal } from 'react-bootstrap';

interface AnnotationModalProps {
  addElementToOverlay: (element: HTMLElement) => void;
}

export default function AnnotationModal({ addElementToOverlay }: AnnotationModalProps) { 
  const [annotationText, setAnnotationText] = useState('');
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);


  const handleAddAnnotation = useCallback(() => {
    if (annotationText) {
      const annotationElement = document.createElement('div');
      annotationElement.textContent = annotationText;
      annotationElement.className = 'annotation draggable';
      annotationElement.style.position = 'absolute';
      annotationElement.style.left = '10px';
      annotationElement.style.top = '10px';
      annotationElement.style.padding = '5px';
      annotationElement.style.maxWidth = '200px'; 
      addElementToOverlay(annotationElement);
      setAnnotationText('');
      onHide();
  
    }
  }, [annotationText]);

  const onHide = () => {
    setShowAnnotationModal(false)
  }
  const handleClear = () => {
    setAnnotationText('');
  };

  return (
    <>
   <Button variant="dark" size="icon" id="annotationBtn" title="Annotation" onClick={() => setShowAnnotationModal(true)}><SquareSquare className="h-4 w-4" /> Annotate</Button>
    <Modal show={showAnnotationModal}  onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Drawing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Textarea
          placeholder="Enter your annotation"
          value={annotationText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnnotationText(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" onClick={handleAddAnnotation}>
          Save
        </Button>
      </Modal.Footer>
    </Modal></> 
  );
}
