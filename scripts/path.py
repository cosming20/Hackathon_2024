from collections import deque   

def find_shortest_path(lab, start, stop):
    queue = deque([(start[0], start[1], 0)])

    visited = set()
    visited.add((start[0], start[1]))

    dir = [(-1, 0), (0, -1), (1, 0), (0, 1)]
    
    previous_cell = {(start[0], start[1]): None}

    while queue:
        
        x, y, dist = queue.popleft()
        if (x, y) == stop:  
            path = []
            while previous_cell[(x, y)] is not None:
                path.append((x, y))
                if (x, y) != stop:
                    lab[x][y] = 4
                # if (x, y) in previous_cell.keys() and previous_cell[(x, y)] is not None:
                x, y = previous_cell[(x, y)]

            path.append((start[0], start[1]))
            # lab[stop[0]][start[1]] = 3
            path.reverse()  
            # return dist, path
            return lab
        
        for dx, dy in dir:
            nx = dx + x
            ny = dy + y
            if 0 <= nx < len(lab) and 0 <= ny < len(lab[0]) and (nx, ny) not in visited:
                if lab[nx][ny] == 0 or lab[nx][ny] == 3:
                    queue.append((nx, ny, dist + 1))
                    visited.add((nx, ny))
                    previous_cell[(nx,ny)] = (x, y)

    return lab