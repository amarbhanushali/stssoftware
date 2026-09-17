from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, Image, HRFlowable, Flowable
)
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Samarth-Tech-Software-Portfolio.pdf"
LOGO = ROOT / "public" / "sts-logo.png"
TEAM_IMAGE = ROOT / "assets" / "portfolio" / "team-collaboration.png"
TEAM_PANEL = ROOT / "assets" / "portfolio" / "team-panel.png"
TEAM_WIDE = ROOT / "assets" / "portfolio" / "team-wide.png"
PRODUCT_WIDE = ROOT / "assets" / "portfolio" / "product-wide.png"
AUTOMATION_WIDE = ROOT / "assets" / "portfolio" / "automation-wide.png"
WHATSAPP_URL = "https://wa.me/919922792566"

NAVY = colors.HexColor("#092B57")
BLUE = colors.HexColor("#1565C0")
ORANGE = colors.HexColor("#F47B20")
INK = colors.HexColor("#142033")
SLATE = colors.HexColor("#536174")
PALE = colors.HexColor("#F3F7FC")
LINE = colors.HexColor("#D7E1EE")
WHITE = colors.white

PAGE_W, PAGE_H = A4

def p(text, style):
    return Paragraph(text, style)

def numbered(n, title, body, styles):
    label = f"{n:02d}" if isinstance(n, int) else str(n)
    return Table([[p(label, styles['number']), p(f"<b>{title}</b><br/><font color='#536174'>{body}</font>", styles['body'])]],
                 colWidths=[16*mm, 150*mm], style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),8)]))

def service_card(title, body, styles):
    return Table([[p(f"<b>{title}</b>", styles['card_title']), p(body, styles['card_body'])]], colWidths=[46*mm, 45*mm],
                 style=TableStyle([('BACKGROUND',(0,0),(-1,-1),WHITE),('BOX',(0,0),(-1,-1),0.7,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5*mm),('RIGHTPADDING',(0,0),(-1,-1),5*mm),('TOPPADDING',(0,0),(-1,-1),5*mm),('BOTTOMPADDING',(0,0),(-1,-1),5*mm)]))

class StyledImage(Flowable):
    """A cropped image frame with brand curves and layered edge treatment."""
    def __init__(self, path, width, height):
        super().__init__()
        self.path = str(path)
        self.width = width
        self.height = height
        self._image = ImageReader(self.path)
        self.show_shadow = True

    def wrap(self, available_width, available_height):
        return self.width, self.height + 4*mm

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        radius = 5*mm
        # Soft offset panel gives the image a layered, merged-card appearance.
        if self.show_shadow:
            c.setFillColor(colors.HexColor('#E6EEF8'))
            c.roundRect(3*mm, -3*mm, w, h, radius, fill=1, stroke=0)
        c.saveState()
        path = c.beginPath()
        path.roundRect(0, 0, w, h, radius)
        c.clipPath(path, stroke=0, fill=0)
        c.drawImage(self._image, 0, 0, width=w, height=h, mask='auto')
        # A restrained navy tint unifies photography and illustration with the brand.
        c.setFillColor(colors.Color(0.035, 0.17, 0.34, alpha=0.20))
        c.rect(0, 0, w, h, fill=1, stroke=0)
        # Curved brand lines create an intentional transition over the image.
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.70))
        c.setLineWidth(1.15)
        curve = c.beginPath()
        curve.moveTo(w*.55, -3*mm)
        curve.curveTo(w*.42, h*.28, w*.88, h*.42, w*.73, h+3*mm)
        c.drawPath(curve, stroke=1, fill=0)
        c.setStrokeColor(colors.Color(0.957, 0.482, 0.125, alpha=0.95))
        c.setLineWidth(2.2)
        curve = c.beginPath()
        curve.moveTo(w*.61, -4*mm)
        curve.curveTo(w*.48, h*.30, w*.94, h*.48, w*.79, h+4*mm)
        c.drawPath(curve, stroke=1, fill=0)
        c.restoreState()
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.75))
        c.setLineWidth(.8)
        c.roundRect(0, 0, w, h, radius, fill=0, stroke=1)
        # Brand tabs overlap the image edge so the frame merges into the layout.
        c.setFillColor(ORANGE)
        c.roundRect(7*mm, h-4*mm, 22*mm, 4*mm, 2*mm, fill=1, stroke=0)
        c.setFillColor(BLUE)
        c.roundRect(w-29*mm, 0, 22*mm, 4*mm, 2*mm, fill=1, stroke=0)

def portfolio_image(path, width, height):
    return StyledImage(path, width, height)

class AlignedPanelImage(StyledImage):
    """A panel image whose visible top edge aligns exactly with a table row."""
    def wrap(self, available_width, available_height):
        # The shadow intentionally extends below the reported height; this keeps
        # the image itself flush with the adjacent content panel at the top.
        return self.width, self.height

    def __init__(self, path, width, height):
        super().__init__(path, width, height)
        self.show_shadow = False

def aligned_panel_image(path, width, height):
    return AlignedPanelImage(path, width, height)

class DeliveryRoadmapImage(StyledImage):
    """A process-linked image: visual stage labels match the delivery steps above."""
    STAGES = ('Discover', 'Define', 'Design', 'Build', 'Launch', 'Improve')

    def draw(self):
        super().draw()
        c = self.canv
        w, h = self.width, self.height
        chip_w, chip_h = 25*mm, 8*mm
        gap = (w - chip_w*6) / 7
        y = 7*mm
        for index, label in enumerate(self.STAGES, 1):
            x = gap + (index-1)*(chip_w+gap)
            c.setFillColor(colors.Color(1, 1, 1, alpha=.92))
            c.roundRect(x, y, chip_w, chip_h, 2.4*mm, fill=1, stroke=0)
            c.setFillColor(ORANGE)
            c.circle(x+3.5*mm, y+chip_h/2, 2.1*mm, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont('Helvetica-Bold', 5.6)
            c.drawCentredString(x+3.5*mm, y+chip_h/2-2, str(index))
            c.setFillColor(NAVY)
            c.setFont('Helvetica-Bold', 5.7)
            c.drawString(x+7*mm, y+chip_h/2-2, label)

def delivery_roadmap_image(path, width, height):
    return DeliveryRoadmapImage(path, width, height)

def footer(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setStrokeColor(LINE)
        canvas.line(18*mm, 15*mm, PAGE_W-18*mm, 15*mm)
        canvas.setFont('Helvetica', 7.5)
        canvas.setFillColor(SLATE)
        canvas.drawString(18*mm, 10*mm, 'SAMARTH TECH SOFTWARE  |  COMPANY PORTFOLIO')
        canvas.drawRightString(PAGE_W-18*mm, 10*mm, f'{doc.page}')
    canvas.restoreState()

def cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.circle(PAGE_W-8*mm, PAGE_H-15*mm, 78*mm, fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.circle(PAGE_W-18*mm, PAGE_H-22*mm, 35*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.Color(1,1,1,alpha=.08))
    canvas.circle(16*mm, 22*mm, 58*mm, fill=1, stroke=0)
    if LOGO.exists():
        canvas.setFillColor(WHITE)
        canvas.roundRect(20*mm, PAGE_H-53*mm, 55*mm, 24*mm, 2*mm, fill=1, stroke=0)
        canvas.drawImage(str(LOGO), 23*mm, PAGE_H-50*mm, width=49*mm, height=17*mm, preserveAspectRatio=True, mask='auto')
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 29)
    canvas.drawString(20*mm, PAGE_H-101*mm, 'Technology that fits')
    canvas.drawString(20*mm, PAGE_H-113*mm, 'your business.')
    canvas.setFillColor(colors.HexColor('#DCEBFB'))
    canvas.setFont('Helvetica', 12)
    canvas.drawString(20*mm, PAGE_H-133*mm, 'Company portfolio  |  Software, web, mobile & AI automation')
    canvas.setFillColor(ORANGE)
    canvas.rect(20*mm, PAGE_H-147*mm, 36*mm, 2.3*mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 10)
    canvas.drawString(20*mm, 30*mm, 'SAMARTH TECH SOFTWARE')
    canvas.setFont('Helvetica', 9)
    footer_x, footer_y = 20*mm, 23*mm
    prefix, number, suffix = 'Nashik, Maharashtra, India  |  ', '+91 99227 92566', '  |  stssoftware.in'
    canvas.setFillColor(colors.HexColor('#DCEBFB'))
    canvas.drawString(footer_x, footer_y, prefix)
    number_x = footer_x + stringWidth(prefix, 'Helvetica', 9)
    canvas.setFillColor(ORANGE)
    canvas.drawString(number_x, footer_y, number)
    canvas.setFillColor(colors.HexColor('#DCEBFB'))
    canvas.drawString(number_x + stringWidth(number, 'Helvetica', 9), footer_y, suffix)
    canvas.linkURL(WHATSAPP_URL, (number_x, footer_y-2*mm, number_x + stringWidth(number, 'Helvetica', 9), footer_y+3*mm), relative=0, thickness=0)
    canvas.restoreState()

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=21*mm)
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='eyebrow', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=ORANGE, spaceAfter=4))
    styles.add(ParagraphStyle(name='title1', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=24, leading=29, textColor=NAVY, spaceAfter=8))
    styles.add(ParagraphStyle(name='title2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=16, leading=21, textColor=NAVY, spaceAfter=8))
    styles.add(ParagraphStyle(name='lead', parent=styles['Normal'], fontName='Helvetica', fontSize=11, leading=16, textColor=SLATE, spaceAfter=12))
    styles.add(ParagraphStyle(name='body', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=14, textColor=INK))
    styles.add(ParagraphStyle(name='card_title', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=NAVY))
    styles.add(ParagraphStyle(name='card_body', parent=styles['Normal'], fontName='Helvetica', fontSize=8.6, leading=12.2, textColor=SLATE))
    styles.add(ParagraphStyle(name='number', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=17, leading=18, textColor=ORANGE, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='quote', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=15, leading=21, textColor=NAVY, alignment=TA_CENTER))
    styles.add(ParagraphStyle(name='small', parent=styles['Normal'], fontName='Helvetica', fontSize=8.6, leading=12, textColor=SLATE))

    story = []
    story.append(PageBreak())
    # 1. Introduction
    story += [p('ABOUT US', styles['eyebrow']), p('A practical technology partner for growing businesses.', styles['title1']),
              p('Samarth Tech Software helps organisations turn day-to-day problems into dependable digital systems. We combine clear discovery, thoughtful design and focused engineering to deliver software that people can use with confidence.', styles['lead'])]
    if TEAM_PANEL.exists():
        # This matched pair deliberately has no shadow: both visible panels are
        # exactly 80 mm tall from their shared top edge to their shared baseline.
        story.append(Table([[p('<font color="#FFFFFF"><b>Built around your business.</b></font><br/><br/><font color="#DCEBFB">We bring strategy, experience design and engineering together so your digital investment has a clear purpose from day one.</font>', styles['lead']), aligned_panel_image(TEAM_PANEL, 82*mm, 80*mm)]], colWidths=[92*mm,82*mm], rowHeights=[80*mm], style=TableStyle([('BACKGROUND',(0,0),(0,0),NAVY),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(0,0),8*mm),('RIGHTPADDING',(0,0),(0,0),8*mm),('TOPPADDING',(0,0),(0,0),7*mm),('BOTTOMPADDING',(0,0),(0,0),7*mm),('LEFTPADDING',(1,0),(1,0),0),('RIGHTPADDING',(1,0),(1,0),0),('TOPPADDING',(1,0),(1,0),0),('BOTTOMPADDING',(1,0),(1,0),0)])))
        story.append(Spacer(1,6*mm))
    facts = [[p('<b>What we build</b><br/>Custom software, websites, web applications, mobile apps and AI-enabled workflows.', styles['body']),
              p('<b>How we work</b><br/>A transparent, milestone-led process with regular reviews and clear next steps.', styles['body']),
              p('<b>Where we work</b><br/>Based in Nashik, serving businesses that need a reliable digital delivery partner.', styles['body'])]]
    story.append(Table(facts, colWidths=[57*mm]*3, style=TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),0.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5*mm),('RIGHTPADDING',(0,0),(-1,-1),5*mm),('TOPPADDING',(0,0),(-1,-1),5*mm),('BOTTOMPADDING',(0,0),(-1,-1),5*mm)])))
    story += [Spacer(1,12*mm), p('Our point of view', styles['title2']), p('The right solution is not the most complex one. It is the one that fits your team, supports your customers and can grow with your business. Every engagement starts by understanding the workflow before selecting the technology.', styles['lead']),
              HRFlowable(width='100%', thickness=.8, color=LINE), Spacer(1,6*mm), p('“We build connected, useful systems that make work easier and customer experiences stronger.”', styles['quote'])]
    story.append(PageBreak())
    # 2 services
    story += [p('CAPABILITIES', styles['eyebrow']), p('Digital products built around real business workflows.', styles['title1']), p('From a high-performing website to an internal operations platform, we bring strategy, user experience and development together in one delivery process.', styles['lead'])]
    if PRODUCT_WIDE.exists():
        story += [portfolio_image(PRODUCT_WIDE, 174*mm, 60*mm), Spacer(1,5*mm)]
    cards = [service_card('Custom Software', 'Tailored systems for operations, workflows, dashboards, customer portals and business processes.', styles), service_card('Website Development', 'Modern, responsive websites designed to build credibility, communicate value and generate enquiries.', styles), service_card('Web Applications', 'Secure browser-based tools, admin panels and customer-facing applications that work across devices.', styles), service_card('Mobile Applications', 'Mobile-first experiences for customers, teams and on-the-go operational workflows.', styles), service_card('AI Automation', 'Practical automation for repetitive work, document flows, service responses and internal knowledge tasks.', styles), service_card('Support & Growth', 'Ongoing improvements, monitoring and product evolution after launch.', styles)]
    story.append(Table([[cards[0],cards[1]],[cards[2],cards[3]],[cards[4],cards[5]]], colWidths=[87*mm,87*mm], rowHeights=[42*mm]*3, style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),4*mm),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),4*mm)])))
    story.append(PageBreak())
    # 3 approach
    story += [p('OUR DELIVERY MODEL', styles['eyebrow']), p('Clarity first. Delivery in visible stages.', styles['title1']), p('A successful product is easier to build when everyone agrees on the problem, the priorities and the measures of progress.', styles['lead'])]
    for row in [
        ('01','Discover','Understand users, current workflow, goals, risks and the opportunity behind the request.'),
        ('02','Define','Turn findings into a practical scope, roadmap, user journeys, requirements and milestones.'),
        ('03','Design','Shape the experience through interface design, technical planning and working prototypes.'),
        ('04','Build','Develop in focused iterations, with visible progress and structured quality checks.'),
        ('05','Launch','Prepare the product for launch, train stakeholders and set up the right handover.'),
        ('06','Improve','Use feedback and real usage to prioritise what to refine, automate or expand next.')]:
        story.append(numbered(*row, styles))
    if AUTOMATION_WIDE.exists():
        story += [Spacer(1,5*mm), delivery_roadmap_image(AUTOMATION_WIDE, 174*mm, 60*mm)]
    story.append(PageBreak())
    # 4 architecture
    story += [p('HOW WE THINK', styles['eyebrow']), p('Designed for usefulness, quality and growth.', styles['title1']), p('Technology choices should support the business model, team capability and expected scale. We recommend an approach after the discovery conversation - not before it.', styles['lead'])]
    tabledata = [[p('<b>Experience</b>',styles['card_title']),p('<b>Application</b>',styles['card_title']),p('<b>Operations</b>',styles['card_title'])],
                 [p('Responsive websites, accessible interfaces, clear user journeys and conversion-ready landing pages.',styles['card_body']),p('Reliable web and mobile applications, workflows, reporting and integration-ready systems.',styles['card_body']),p('Secure data handling, role-based access, monitoring, documentation and structured handover.',styles['card_body'])]]
    story.append(Table(tabledata,colWidths=[57*mm]*3,style=TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('TEXTCOLOR',(0,0),(-1,0),WHITE),('BACKGROUND',(0,1),(-1,1),PALE),('GRID',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5*mm),('RIGHTPADDING',(0,0),(-1,-1),5*mm),('TOPPADDING',(0,0),(-1,-1),5*mm),('BOTTOMPADDING',(0,0),(-1,-1),5*mm)])))
    story += [Spacer(1,10*mm), p('What clients can expect', styles['title2'])]
    expectations = [[p('<b>Transparent progress</b><br/>Clear milestones, regular conversations and decisions documented as we go.',styles['body']),p('<b>Built for adoption</b><br/>We focus on the people using the system, not only the features list.',styles['body'])], [p('<b>Practical delivery</b><br/>Scope is prioritised around the highest-value outcome for the business.',styles['body']),p('<b>Long-term perspective</b><br/>A strong launch is the start of a product relationship, not the finish line.',styles['body'])]]
    story.append(Table(expectations,colWidths=[86*mm]*2,style=TableStyle([('BOX',(0,0),(-1,-1),.5,LINE),('INNERGRID',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5*mm),('RIGHTPADDING',(0,0),(-1,-1),5*mm),('TOPPADDING',(0,0),(-1,-1),5*mm),('BOTTOMPADDING',(0,0),(-1,-1),5*mm)])))
    if TEAM_WIDE.exists():
        story += [Spacer(1,8*mm), portfolio_image(TEAM_WIDE, 174*mm, 60*mm)]
    story.append(PageBreak())
    # 5 use cases
    story += [p('TYPICAL ENGAGEMENTS', styles['eyebrow']), p('Where digital systems create the most value.', styles['title1']), p('Every organisation is different, but the same opportunities appear again and again. These are representative engagement types we can explore together.', styles['lead'])]
    usecases = [['Customer acquisition', 'Lead-focused websites, service pages, consultation journeys, SEO foundations and enquiry systems.'],['Operations improvement','Internal tools, workflow automation, approvals, dashboards and process visibility.'],['Customer self-service','Portals, account areas, bookings, status tracking, requests and support experiences.'],['Product digitisation','Turn a service, process or idea into a focused web or mobile product with a launch roadmap.'],['AI-enabled workflows','Assist teams with structured content, knowledge retrieval, repeatable tasks and process acceleration.']]
    for i,(t,b) in enumerate(usecases,1): story.append(numbered(i,t,b,styles))
    story += [Spacer(1,6*mm), p('A good first project is focused enough to deliver value quickly and structured enough to become a strong foundation for what comes next.',styles['quote'])]
    story.append(PageBreak())
    # 6 engagement
    story += [p('WORKING TOGETHER', styles['eyebrow']), p('An engagement model that gives you control.', styles['title1']), p('We adapt the delivery model to the maturity of the idea, the required timeline and the availability of your internal stakeholders.', styles['lead'])]
    engagement = [[p('<b>Discovery & planning</b><br/>For a new idea, a complex workflow or a project that needs clarity before development begins.<br/><br/><font color="#F47B20"><b>Output:</b></font> priorities, user journeys, scope and delivery roadmap.',styles['body']),p('<b>Build & launch</b><br/>For teams ready to move from an approved scope into a working product.<br/><br/><font color="#F47B20"><b>Output:</b></font> tested product, launch plan and handover materials.',styles['body']),p('<b>Continuous improvement</b><br/>For organisations that need a trusted partner to maintain and evolve an existing digital product.<br/><br/><font color="#F47B20"><b>Output:</b></font> prioritised releases, support and measurable improvements.',styles['body'])]]
    story.append(Table(engagement,colWidths=[57*mm]*3,style=TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.5,LINE),('INNERGRID',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5*mm),('RIGHTPADDING',(0,0),(-1,-1),5*mm),('TOPPADDING',(0,0),(-1,-1),5*mm),('BOTTOMPADDING',(0,0),(-1,-1),5*mm)])))
    if PRODUCT_WIDE.exists():
        story += [Spacer(1,8*mm), portfolio_image(PRODUCT_WIDE, 174*mm, 60*mm)]
    story += [Spacer(1,7*mm),p('Every engagement begins with a focused conversation about the outcome you need, the people involved and the systems you use today.',styles['lead'])]
    story.append(PageBreak())
    # 7 call to action
    story += [p('LET’S START WITH THE RIGHT QUESTION', styles['eyebrow']), p('Ready to make your next digital project clearer?', styles['title1']), p('Tell us what you are trying to improve, build or automate. We will help you identify the most practical first step.', styles['lead']), Spacer(1,5*mm)]
    contact = [[p('<b>1. Share the context</b><br/>Your business goal, current challenge and the people the solution needs to support.',styles['body']),p('<b>2. Explore the opportunity</b><br/>We discuss the workflow, options, likely scope and the best next move.',styles['body']),p('<b>3. Agree the plan</b><br/>You receive a clear view of priorities, delivery approach and next steps.',styles['body'])]]
    story.append(Table(contact,colWidths=[57*mm]*3,style=TableStyle([('BACKGROUND',(0,0),(-1,-1),WHITE),('BOX',(0,0),(-1,-1),.6,BLUE),('INNERGRID',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5*mm),('RIGHTPADDING',(0,0),(-1,-1),5*mm),('TOPPADDING',(0,0),(-1,-1),5*mm),('BOTTOMPADDING',(0,0),(-1,-1),5*mm)])))
    story += [Spacer(1,17*mm), p('SAMARTH TECH SOFTWARE', styles['title2']), p('16 Shukhakarta Row Houses, Ganpati Temple, Shivajinagar Dharmaji Colony, Ashok Nagar, Nashik 422012, Maharashtra, India', styles['lead']), p(f'<font color="#1565C0"><b>WhatsApp:</b></font> <link href="{WHATSAPP_URL}" color="#1565C0"><u>+91 99227 92566</u></link><br/><font color="#1565C0"><b>Website:</b></font> stssoftware.in<br/><font color="#1565C0"><b>Consultation:</b></font> stssoftware.in/consultation', styles['body'])]
    doc.build(story, onFirstPage=cover, onLaterPages=footer)
    print(OUT)

if __name__ == '__main__':
    main()
