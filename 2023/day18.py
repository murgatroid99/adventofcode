from collections import namedtuple
from enum import IntEnum
from typing import Iterator, NamedTuple


class Direction(IntEnum):
  NORTH = 1
  SOUTH = 2
  EAST = 3
  WEST = 4

class Point(NamedTuple):
  row: int
  col: int

def in_direction(point: Point, direction: Direction, distance = 1) -> Point:
  match direction:
    case Direction.NORTH:
      return Point(point.row - distance, point.col)
    case Direction.SOUTH:
      return Point(point.row + distance, point.col)
    case Direction.EAST:
      return Point(point.row, point.col + distance)
    case Direction.WEST:
      return Point(point.row, point.col - distance)

def in_range(point: Point, row_max: int, col_max: int):
  return point.row >= 0 and point.col >=0 and point.row < row_max and point.col < col_max

def distance(point1: Point, point2: Point):
  return abs(point1.row - point2.row) + abs(point1.col - point2.col)

letter_directions: dict[str, Direction] = {
  'U': Direction.NORTH,
  'D': Direction.SOUTH,
  'L': Direction.WEST,
  'R': Direction.EAST
}

def part1(input: Iterator[str]):
  points: dict[Point, int] = {}
  current: Point = Point(0, 0)
  path_index: int = 0
  points[current] = path_index
  max_row: int = 0
  max_col: int = 0
  min_row: int = 0
  min_col: int = 0
  for line in input:
    d, n, _ = line.split(' ')
    direction = letter_directions[d]
    count = int(n)
    for i in range(count):
      current = in_direction(current, direction)
      path_index += 1
      points[current] = path_index
      if current.row > max_row:
        max_row = current.row
      if current.col > max_col:
        max_col = current.col
      if current.row < min_row:
        min_row = current.row
      if current.col < min_col:
        min_col = current.col
  grid: list[list[str]] = [['#' if Point(row, col) in points else '.' for col in range(min_col, max_col + 1)] for row in range(min_row, max_row + 1)]
  #print('\n'.join(''.join(row_list) for row_list in grid))
  area: int = len(points)
  for row in range(min_row + 1, max_row):
    inside: bool = False
    last_diff: int = 0
    for col in range(min_col, max_col + 1):
      current = Point(row, col)
      if current in points:
        diff = points.get(in_direction(current, Direction.SOUTH), 0) - points.get(current, 0)
        if abs(diff) == 1 and diff != last_diff:
          last_diff = diff
          inside = not inside
      elif inside:
        area += 1
  return area

digit_directions = {
  '0': Direction.EAST,
  '1': Direction.SOUTH,
  '2': Direction.WEST,
  '3': Direction.NORTH
}

def part2(input: Iterator[str]):
  current = Point(0, 0)
  points: list[Point] = [current]
  for line in input:
    _, _, h = line.rstrip().split(' ')
    hex_string = h[2:-1]
    distance = int(hex_string[:-1], 16)
    direction = digit_directions[hex_string[-1]]
    current = in_direction(current, direction, distance)
    points.append(current)
  # Shoelace theorem
  area = sum((points[i+1].col + points[i].col) * (points[i+1].row - points[i].row) for i in range(len(points) - 1)) // 2
  perimeter = sum(abs(points[i+1].col - points[i].col) + abs(points[i+1].row - points[i].row) for i in range(len(points) - 1))
  return area + perimeter // 2 + 1

test_input='''R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day18input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  with open('./day18input.txt', 'r') as f:
    print(part2(f))
