from generate import generate_lab
from path import find_shortest_path
import json

from collections import Counter
import sys

if __name__ == "__main__":
    # Unpack all arguments passed from Node.js
    x_start, y_start, x_finish, y_finish, x, y, bricks = map(int, sys.argv[1:])
    
    # Generate the labyrinth with provided parameters
    lab = generate_lab(x_start, y_start, x_finish, y_finish, x, y, bricks)
    sht = find_shortest_path(lab, (x_start,y_start), (x_finish,y_finish))
    # print(sht)
    # print(json.dumps(lab))
    print(json.dumps(sht))

