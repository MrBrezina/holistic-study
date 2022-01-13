import drawBot as db

holifonts = {}
for f in db.installedFonts():
    if "Holisticissimo" in f:
        _, suf = f.split("-")
        holifonts[suf] = f

w, h = 200, 200

def draw_sample(letter, top, bottom, drawline=True):

    fsize = 175
    with savedState():
        # draw background and settings
        db.fill(0)
        db.stroke(None)
        db.translate(0, 50)
        # get x-height
        db.fontSize(fsize)
        db.font(holifonts[top])
        xh = db.fontXHeight()
        # clipping paths
        top_path = db.BezierPath()
        letter_ = db.FormattedString(
            letter,
            font=holifonts[top],
            fontSize=fsize,
            fill=0,
        )
        top_path.text(letter_, (w / 2, 0), align="center")
        top_clip = db.BezierPath()
        top_clip.rect(0, xh / 2, w, h)
        bottom_path = db.BezierPath()
        letter_ = db.FormattedString(
            letter,
            font=holifonts[bottom],
            fontSize=fsize,
            fill=0,
        )
        bottom_path.text(letter_, (w / 2, 0), align="center")
        bottom_clip = db.BezierPath()
        bottom_clip.rect(0, -50, w, 50 + xh / 2)
        # draw top
        with db.savedState():
            db.clipPath(top_clip)
            db.drawPath(top_path)  # so that DrawBot outlines the letter in SVG
        # draw bottom
        with db.savedState():
            db.clipPath(bottom_clip)
            db.drawPath(bottom_path)  # so that DrawBot outlines the letter in SVG
        # draw line
        if drawline:
            db.stroke(1, 0, 0)
            db.fill(None)
            db.strokeWidth(1)
            db.line((0, xh / 2), (w, xh / 2))

# draw samples
for letter in "aehjnu": # not using ilv
    for top in "ABCD":
        for bottom in "ABCD":
            db.newDrawing()
            db.newPage(w, h)
            db.fill(1)
            db.rect(0, 0, w, h)
            draw_sample(letter, top, bottom)
            samplename = "%s_%s%s" % (letter, top, bottom)
            db.saveImage("SVGs/%s.svg" % samplename)
            # db.saveImage("PDFs/%s.pdf" % samplename)
            db.endDrawing()

# draw mask
db.newDrawing()
db.newPage(w, h)
db.fill(1)
db.rect(0, 0, w, h)
db.stroke(0)
db.strokeWidth(3)
db.fill(None)
rows = 16
bit = w / (rows + 1) / 2
for y in range(0, rows):
    with db.savedState():
        db.translate(2 * bit, 2 * bit * (y + 1))
        for x in range(0, rows):
            with db.savedState():
                db.translate(2 * bit * x, 0)
                db.rotate(randint(0, 90))
                db.line((-bit + 1, 0), (bit - 1, 0))
                db.line((0, -bit + 1), (0, bit - 1))

db.stroke(None)
db.fill(1, 0, 0)
bit *= 1.5
db.oval((w - bit) / 2, (h - bit) / 2, bit, bit)
        
db.saveImage("SVGs/mask.svg")
db.endDrawing()

db.newDrawing()
db.newPage(w, h)
db.fill(1)
db.rect(0, 0, w, h)
db.saveImage("SVGs/empty.svg")
# db.saveImage("PDFs/empty.pdf")
db.endDrawing()