from generate import generate_lab

from collections import Counter

x = 8
y = 7

lab = generate_lab(1,7,6,6,x,y,25)

res = dict(sum(map(Counter, lab), Counter()))

print(res)
print(lab)