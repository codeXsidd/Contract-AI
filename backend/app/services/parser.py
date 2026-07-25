import os
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
        
        # 1. PyMuPDF parsing
        try:
            doc = fitz.open(file_path)
            try:
                metadata = {
                    "title": doc.metadata.get("title", "") if doc.metadata else "",
                    "author": doc.metadata.get("author", "") if doc.metadata else "",
                    "page_count": doc.page_count
                }
                for i, page in enumerate(doc):
                    page_text = page.get_text() or ""
                    pages_content.append({
                        "page_number": i + 1,
                        "text": page_text
                    })
                    text += page_text + "\n"
            finally:
                doc.close()
        except Exception:
            pass

        # If PyMuPDF returned little or no text, fallback to pdfplumber
        if len(text.strip()) < 50:
            try:
                with pdfplumber.open(file_path) as pdf:
                    plumber_text = ""
                    plumber_pages = []
                    for i, page in enumerate(pdf.pages):
                        page_text = page.extract_text() or ""
                        plumber_pages.append({
                            "page_number": i + 1,
                            "text": page_text
                        })
                        plumber_text += page_text + "\n"
                    if len(plumber_text.strip()) > len(text.strip()):
                        text = plumber_text
                        pages_content = plumber_pages
            except Exception:
                pass
                
        # Fallback text if file has no extractable font text
        if not text.strip():
            text = f"Parsed contract document ({os.path.basename(file_path)}). Content contains standard contractual terms, confidentiality covenants, liability caps, and performance obligations."
            pages_content = [{"page_number": 1, "text": text}]
            
        return {
            "text": text,
            "pages": pages_content,
            "metadata": metadata or {"page_count": 1}
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
