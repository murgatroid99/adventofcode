from typing import Iterable

def grid_to_string(grid: list[list[str]]) -> str:
  return '\n'.join(''.join(row) for row in grid)

def tilt_north(grid: list[list[str]]) -> list[list[str]]:
  grid = [row[:] for row in grid]
  for row_num, row in enumerate(grid):
    if row_num == 0:
      continue
    for col_num, item in enumerate(row):
      if item == 'O':
        target_row = row_num
        for i in range(1, row_num + 1):
          if grid[row_num - i][col_num] == '.':
            target_row = row_num - i
          else:
            break
        if target_row != row_num:
          grid[target_row][col_num] = 'O'
          grid[row_num][col_num] = '.'
  return grid

def count_north_load(grid:list[list[str]]) -> int:
  return sum(len(list(filter(lambda x: x == 'O', row))) * (len(grid) - row_num) for row_num, row in enumerate(grid))

# Rotates clockwise
def rotated(grid: list[list[str]]) -> list[list[str]]:
  return list(map(list, zip(*grid[::-1])))

def spin(grid: list[list[str]]) -> list[list[str]]:
  for i in range(4):
    #print(grid_to_string(grid))
    #print('')
    grid = tilt_north(grid)
    #print(grid_to_string(grid))
    #print('')
    grid = rotated(grid)
  return grid

def part1(input: Iterable[str]) -> int:
  grid = [list(line.rstrip()) for line in input]
  #print(grid_to_string(grid))
  #print('')
  tilted = tilt_north(grid)
  #print(grid_to_string(tilted))
  return count_north_load(tilted)



def part2(input: Iterable[str]) -> int:
  grid = [list(line.rstrip()) for line in input]
  previous = {}
  i = 0
  total_iterations = 1000000000
  while i < total_iterations:
    previous[i] = grid
    grid = spin(grid)
    i += 1
    print(i)
    print(grid_to_string(grid))
    for last_time, prev in previous.items():
      if prev == grid:
        loop_size = i - last_time
        i += ((total_iterations - i) // loop_size) * loop_size
        break
  return count_north_load(grid)

test_input = '''O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day14input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  with open('./day14input.txt', 'r') as f:
    print(part2(f))
