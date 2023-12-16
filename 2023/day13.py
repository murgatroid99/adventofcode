from typing import Iterator, Optional

def grid_to_string(grid: list[list[str]]) -> str:
  return '\n'.join(''.join(row) for row in grid)

def find_reflecting_row(grid: list[list[str]], smudges: int) -> Optional[int]:
  for i in range(1, len(grid)):
    if sum(sum(0 if x == y else 1 for x,y in zip(a,b)) for a,b in zip(grid[i-1::-1], grid[i:])) == smudges:
      return i
  return None

def find_reflecting_col(grid: list[list[str]], smudges: int) -> Optional[int]:
  #print(grid_to_string(list(zip(*grid))))
  return find_reflecting_row(list(zip(*grid)), smudges)

def get_grid_value(grid: list[list[str]], smudges: int) -> int:
  reflecting_row = find_reflecting_row(grid, smudges)
  if reflecting_row is not None:
    return 100 * reflecting_row
  reflecting_col = find_reflecting_col(grid, smudges)
  if reflecting_col is not None:
    return reflecting_col
  return 0

def both_parts(input: Iterator[str], smudges: int) -> int:
  grid: list[list[str]] = []
  total: int = 0
  for line in input:
    line = line.rstrip()
    if line == '':
      value = get_grid_value(grid, smudges)
      #print(grid_to_string(grid))
      #print(value)
      total += value
      grid = []
    else:
      grid.append(list(line))
  value = get_grid_value(grid, smudges)
  #print(grid_to_string(grid))
  #print(value)
  total += value
  return total

def part1(input: Iterator[str]):
  return both_parts(input, 0)

def part2(input: Iterator[str]):
  return both_parts(input, 1)

test_input = '''#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day13input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  with open('./day13input.txt', 'r') as f:
    print(part2(f))
