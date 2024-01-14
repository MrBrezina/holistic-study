import drawBot as db
from random import randint

holifonts = {}
for f in db.installedFonts():
    if "Holisticissimo" in f:
        _, suf = f.split("-")
        holifonts[suf] = f

w, h = 1600, 1600
sw, sh = w/4, h/4

letters = "abcdehijlnpqurtz"
variants = "ABCD"

def draw_sample(letter, top, bottom, drawline=True):

    fsize = 350  # 175
    with db.savedState():
        # draw background and settings
        db.fill(0)
        db.stroke(None)
        db.translate(0, sw/4)
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
        top_path.text(letter_, (sw / 2, 0), align="center")
        top_clip = db.BezierPath()
        top_clip.rect(0, xh / 2, w, h)
        bottom_path = db.BezierPath()
        letter_ = db.FormattedString(
            letter,
            font=holifonts[bottom],
            fontSize=fsize,
            fill=0,
        )
        bottom_path.text(letter_, (sw / 2, 0), align="center")
        bottom_clip = db.BezierPath()
        bottom_clip.rect(0, -sw/4, sw, sw/4 + xh / 2)
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
db.newDrawing()
for letter in letters:
    for _ in range(15):
        db.newPage(w, h)
        db.fill(1)
        db.rect(0, 0, w, h)
        db.translate(0, sh * (len(variants) - 1))
        for top in variants:
            for bottom in variants:
                draw_sample(letter, top, bottom, False)
                db.translate(sw, 0)
            db.translate(-sw * (len(variants)), -sh)
db.endDrawing()
db.saveImage("all-letters.mp4")

