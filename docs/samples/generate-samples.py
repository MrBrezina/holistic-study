import drawBot as db
from random import randint

holifonts = {}
for f in db.installedFonts():
    if "Holisticissimo" in f:
        _, suf = f.split("-")
        holifonts[suf] = f

w, h = 200, 200

letters = "abcdefhijlnopqrtuyz"
variants = "ABCD"

def draw_sample(letter, top, bottom, drawline=True):

    fsize = 175
    with db.savedState():
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
for letter in letters:
    for top in variants:
        for bottom in variants:
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

# draw empty image
db.newDrawing()
db.newPage(w, h)
db.fill(1)
db.rect(0, 0, w, h)
db.saveImage("SVGs/empty.svg")
# db.saveImage("PDFs/empty.pdf")
db.endDrawing()

# compile HTML to preview the samples

html = """
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <title>Study: overview of all samples</title>
	<link rel="stylesheet" type="text/css" href="../style.css">
</head>
<body>
%s
</body>
</html>
"""

# Combo pattern needed
# [[0, 0], [0, 0]],
# [[0, 1], [0, 1]],
# [[0, 1], [0, 2]],
# [[0, 1], [2, 3]], // not [0, 1] [1, 2] to avoid confounding variable
# [[0, 0], [1, 1]],
# [[0, 1], [2, 1]],

x = ""
# 4x4
for letter in letters:
    x += "<p>"
    for top in variants:
        for bottom in variants:
            x += "<img src='SVGs/%s_%s%s.svg'> " % (letter, top, bottom)
        x += "<br>\n"
    for first, second in [["AA", "AA"],
                          ["AB", "AB"],
                          ["AB", "AC"]
                          ]:
            x += "<img src='SVGs/%s_%s.svg'>" % (letter, first)
            x += "<img src='SVGs/%s_%s.svg'> " % (letter, second)
    x += "<br>\n"
    for first, second in [["AB", "CD"],
                          ["AA", "BB"],
                          ["AB", "CB"]
                          ]:
            x += "<img src='SVGs/%s_%s.svg'>" % (letter, first)
            x += "<img src='SVGs/%s_%s.svg'> " % (letter, second)
    x += "</p>\n\n"

html = html % x

with open("index.html", "w") as f:
    f.write(html)