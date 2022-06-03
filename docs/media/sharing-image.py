txt = "Letter perception study"

newPage(600, 300)
fill(0)
stroke(None)
rect(0, 0, 600, 300)
fill(1)
font("AdapterMonoPEVF-All")
fontSize(50)
fontVariations(wght=400)
textBox(txt, (100, 40, 400, 200), align="center")

saveImage("sharing-image.png")