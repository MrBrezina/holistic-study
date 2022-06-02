# helper to ste up the javascript
# calculating times for the practice part of the study

import math

no_trials = 18 // 2
max_time = 800
min_time = 200
correction = 50
min_time2 = (min_time - correction)
max_time2 = (max_time + correction)
step = (min_time - max_time) // (no_trials - 1)

times = list(range(max_time, min_time + step, step))
total = 2 * len(times)
mean = sum(times) / len(times)
print(times, len(times), mean, mean*0.75)

for total_correct in range(0, 19):
  formula = min_time + (max_time - min_time) * (total - total_correct) / total
  formula2 = min_time2 + (max_time2 - min_time2) * (total - total_correct) / total
  print(total_correct, "correct -> %.2fms / %.2fms / %.2fms" % (formula, 0.75 * formula, formula2))
