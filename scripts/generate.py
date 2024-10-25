import numpy as np
import json
import sys

def generate_lab(x_start, y_start, x_finish, y_finish, x, y, brick):
    
    if brick > 40:
        raise ValueError(f"Percentage of bricks can't be bigger than 40! Current Percentage: {brick}")

    lab = np.zeros((x, y), dtype = int)
    lab[x_start][y_start] = 2
    lab[x_finish][y_finish] = 3


    bricks_num = (x * y * brick) // 100
    
    while bricks_num > 0:
        rand_x = np.random.randint(low=0, high=x)
        rand_y = np.random.randint(low=0, high=y)

        if lab[rand_x][rand_y] == 0:
            lab[rand_x][rand_y] = 1
            bricks_num -= 1

    return lab.tolist()

if __name__ == "__main__":
    # Unpack all arguments passed from Node.js
    x_start, y_start, x_finish, y_finish, x, y, bricks = map(int, sys.argv[1:])
    # Generate the labyrinth with provided parameters
    lab = generate_lab(x_start, y_start, x_finish, y_finish, x, y, bricks)
    # print(sht)
    # print(json.dumps(lab))
    print(json.dumps(lab))
    
