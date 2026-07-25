import fitz  # PyMuPDF
import pdfplumber
import docx
from typing import Dict, Any

class DocumentParser:
    @staticmethod
    def parse_pdf(file_path: str) -> Dict[str, Any]:
        """
        Parses a PDF using PyMuPDF for quick retrieval and pdfplumber as fallback.
        """
        text = ""
        metadata = {}
        pages_content = []
        
        try:
            # 1. PyMuPDF parsing
            doc = fitz.open(file_path)
            metadata = {
                "title": doc.metadata.get("title", ""),
                "author": doc.metadata.get("author", ""),
                "page_count": doc.page_count
            }
            
            for i, page in enumerate(doc):
                page_text = page.get_text()
                pages_content.append({
                    "page_number": i + 1,
                    "text": page_text
                })
                text += page_text + "\n"
                
            # If PyMuPDF returned little or no text, fallback to pdfplumber
            if len(text.strip()) < 100:
                text = ""
                pages_content = []
                with pdfplumber.open(file_path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        page_text = page.extract_text() or ""
                        pages_content.append({
                            "page_number": i + 1,
                            "text": page_text
                        })
                        text += page_text + "\n"
                        
        except Exception as e:
            raise RuntimeError(f"Error parsing PDF file: {str(e)}")
            
        return {
            "text": text,
            "pages": pages_content,
            "metadata": metadata
        }

    @staticmethod
    def parse_docx(file_path: str) -> Dict[str, Any]:
        """
        Parses a Microsoft Word DOCX file using python-docx.
        """
        text = ""
        pages_content = []
        
        try:
            doc = docx.Document(file_path)
            paragraphs_text = [p.text for p in doc.paragraphs]
            text = "\n".join(paragraphs_text)
            
            # DOCX doesn't have native fixed pages, so treat sections/paragraphs as chunks
            pages_content.append({
                "page_number": 1,
                "text": text
            })
        except Exception as e:
            raise RuntimeError(f"Error parsing DOCX file: {str(e)}")
            
        return {
            "text": text,
            "pages": pages_content,
            "metadata": {"page_count": 1}
        }

    @classmethod
    def parse_file(cls, file_path: str) -> Dict[str, Any]:
        ext = file_path.split(".")[-1].lower()
        if ext == "pdf":
            return cls.parse_pdf(file_path)
        elif ext in ["docx", "doc"]:
            return cls.parse_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")
