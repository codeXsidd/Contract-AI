import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from typing import Dict, Any

class ReportGenerator:
    @staticmethod
    def generate_pdf_report(contract_data: Dict[str, Any]) -> bytes:
        """
        Creates an audit-ready executive PDF report.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        
        # Define clean, modern styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=colors.HexColor('#1e3a8a'), # Brand navy
            spaceAfter=15
        )
        
        h2_style = ParagraphStyle(
            'H2Style',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#0f172a'),
            spaceBefore=12,
            spaceAfter=8
        )
        
        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['BodyText'],
            fontSize=10,
            textColor=colors.HexColor('#334155'),
            leading=14
        )
        
        story = []
        
        # Title
        story.append(Paragraph("Contract AI Analysis Audit Report", title_style))
        story.append(Spacer(1, 10))
        
        # Meta Table
        meta_data = [
            [Paragraph("<b>Contract Title:</b>", body_style), Paragraph(contract_data.get("title", "Unknown"), body_style)],
            [Paragraph("<b>Contract Type:</b>", body_style), Paragraph(contract_data.get("type", "General"), body_style)],
            [Paragraph("<b>Risk Score:</b>", body_style), Paragraph(str(contract_data.get("risk_score", "N/A")) + " / 100", body_style)],
            [Paragraph("<b>Health Score:</b>", body_style), Paragraph(str(contract_data.get("health_score", "N/A")) + " / 100", body_style)]
        ]
        
        t = Table(meta_data, colWidths=[120, 360])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(t)
        story.append(Spacer(1, 20))
        
        # Summary Section
        story.append(Paragraph("Executive Summary", h2_style))
        story.append(Paragraph(contract_data.get("summary", "No summary generated for this contract."), body_style))
        story.append(Spacer(1, 15))
        
        # Key Recommendations
        story.append(Paragraph("Negotiation Recommendations", h2_style))
        recs = contract_data.get("recommendations", ["Review standard limitation of liability thresholds."])
        for rec in recs:
            story.append(Paragraph(f"• {rec}", body_style))
            story.append(Spacer(1, 4))
            
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
