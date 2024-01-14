txt = "Letter perception study"

newPage(800, 400)
fill(0)
stroke(None)
rect(0, 0, 800, 600)
fill(1)
font("AdapterMonoPEVF-All")
fontSize(50)
fontVariations(wght=400)
textBox(txt, (200, 85, 400, 200), align="center")

saveImage("sharing-image.png")