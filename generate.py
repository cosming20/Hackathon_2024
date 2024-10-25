import numpy as np

def generate_lab(x_start, y_start, x_finish, y_finish, x, y, brick):
    
    if brick > 40:
        raise ValueError(f"Percentage of bricks can't be bigger than 40! Current Percentage: {brick}")

    lab = np.zeros((x, y), dtype = int)
    lab[x_start-1][y_start-1] = 2
    lab[x_finish-1][y_finish-1] = 3


    bricks_num = (x * y * brick) // 100
    
    while bricks_num > 0:
        rand_x = np.random.randint(low=0, high=x-1)
        rand_y = np.random.randint(low=0, high=y-1)

        if lab[rand_x][rand_y] == 0:
            lab[rand_x][rand_y] = 1
            bricks_num -= 1

    return lab
    
