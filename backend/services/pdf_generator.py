import io
import logging
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

logger = logging.getLogger(__name__)

def generate_analysis_pdf(analysis_data: dict, filename: str) -> bytes:
    """Generate a PDF report for the given analysis data."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#6366f1')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        textColor=colors.HexColor('#0f172a')
    )

    story = []
    
    # Title
    story.append(Paragraph("ThreadCounty Analysis Report", title_style))
    story.append(Paragraph(f"File: {filename}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Core Metrics Table
    story.append(Paragraph("Core Metrics", heading_style))
    
    data = [
        ['Metric', 'Value'],
        ['Thread Density', f"{analysis_data.get('thread_density', 0)} threads/cm"],
        ['Fabric Type', analysis_data.get('fabric_type', 'Unknown')],
        ['Warp Count', f"{analysis_data.get('warp_count', 0)} threads/cm"],
        ['Weft Count', f"{analysis_data.get('weft_count', 0)} threads/cm"],
        ['Confidence Score', f"{analysis_data.get('confidence', 0)}%"],
        ['Uniformity', f"{analysis_data.get('uniformity', 0)}%"]
    ]
    
    t = Table(data, colWidths=[150, 300])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(t)
    story.append(Spacer(1, 30))
    
    # Suggestions
    story.append(Paragraph("AI Suggestions", heading_style))
    for suggestion in analysis_data.get('ai_suggestions', []):
        story.append(Paragraph(f"• {suggestion.get('text', '')}", styles['Normal']))
        story.append(Spacer(1, 6))

    try:
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        raise
