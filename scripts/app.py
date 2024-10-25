from generate import generate_lab
from path import find_shortest_path

from collections import Counter

x = 10
y = 10

start = (1,1)
stop = (4,2)
bricks = 25

lab = generate_lab(start[0] - 1,start[1] - 1,stop[0] - 1,stop[1] - 1, x, y, bricks)

res = dict(sum(map(Counter, lab), Counter()))

print(res)
print(lab)
print(find_shortest_path(lab, (start[0] - 1, start[1] - 1), (stop[0] - 1, stop[1] -1)))
