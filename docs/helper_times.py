# helper to ste up the javascript
# calculating times for the practice part of the study

import math

no_trials = 18 // 2
max_time = 800
min_time = 200
step = (min_time - max_time) // (no_trials - 1)

times = list(range(max_time, min_time + step, step))
mean = sum(times) / len(times)
print(times, len(times), mean, mean*0.75)

for total_correct in range(1, 22):
  formula1 = 0.7 * (mean - min_time) * len(times) / total_correct + min_time
  # formula2 = 0.75 * mean * len(times) / total_correct
  formula2 = 0.7 * mean * len(times) / total_correct
  formula3 = 0.7 * mean * math.sqrt((len(times) / total_correct))
  print(total_correct, int(formula1), int(formula2), int(formula3), "//", int(formula1 - formula2), int(formula1 - formula3))
