from collections import defaultdict, namedtuple
from enum import Enum
from re import L
from typing import Iterator

class Direction(Enum):
  NORTH = 1
  SOUTH = 2
  EAST = 3
  WEST = 4

Point = namedtuple('Point', ['row', 'col'])

DirectedPoint = namedtuple('Point', ['point', 'direction'])

def in_direction(point: Point, direction: Direction) -> Point:
  match direction:
    case Direction.NORTH:
      return Point(point.row - 1, point.col)
    case Direction.SOUTH:
      return Point(point.row + 1, point.col)
    case Direction.EAST:
      return Point(point.row, point.col + 1)
    case Direction.WEST:
      return Point(point.row, point.col - 1)

def in_range(point: Point, row_max: int, col_max: int):
  return point.row >= 0 and point.col >=0 and point.row < row_max and point.col < col_max

def next_directions(direction: Direction, symbol: str) -> list[Direction]:
  match symbol:
    case '.':
      return [direction]
    case '/':
      match direction:
        case Direction.NORTH:
          return [Direction.EAST]
        case Direction.SOUTH:
          return [Direction.WEST]
        case Direction.EAST:
          return [Direction.NORTH]
        case Direction.WEST:
          return [Direction.SOUTH]
    case '\\':
      match direction:
        case Direction.NORTH:
          return [Direction.WEST]
        case Direction.SOUTH:
          return [Direction.EAST]
        case Direction.EAST:
          return [Direction.SOUTH]
        case Direction.WEST:
          return [Direction.NORTH]
    case '-':
      match direction:
        case Direction.NORTH | Direction.SOUTH:
          return [Direction.EAST, Direction.WEST]
        case _:
          return [direction]
    case '|':
      match direction:
        case Direction.EAST | Direction.WEST:
          return [Direction.NORTH, Direction.SOUTH]
        case _:
          return [direction]

def count_energized(grid: list[list[str]], start_point: Point, start_direction: Direction):
  visited: dict[Point, set[Direction]] = defaultdict(set)
  points_to_visit: list[DirectedPoint] = [DirectedPoint(start_point, start_direction)]
  while points_to_visit:
    point, direction = points_to_visit.pop()
    if not in_range(point, len(grid), len(grid[0])):
      continue
    if direction in visited[point]:
      continue
    visited[point].add(direction)
    points_to_visit.extend(DirectedPoint(in_direction(point, direction), direction) for direction in next_directions(direction, grid[point.row][point.col]))
  return len(visited)

def part1(input: Iterator[str]) -> int:
  grid: list[list[str]] = [list(line.rstrip()) for line in input]
  return count_energized(grid, Point(0, 0), Direction.EAST)

def get_all_start_points(grid: list[list[str]]) -> list[Point]:
  return list(set([Point(row, 0) for row in range(len(grid))] +
    [Point(row, len(grid[row]) - 1) for row in range(len(grid))] +
    [Point(0, col) for col in range(len(grid[0]))] +
    [Point(len(grid) - 1, col) for col in range(len(grid[0]))]))

def part2(input: Iterator[str]) -> int:
  grid: list[list[str]] = [list(line.rstrip()) for line in input]
  return max(count_energized(grid, start_point, direction) for direction in Direction for start_point in get_all_start_points(grid))

test_input = r'''.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day16input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  with open('./day16input.txt', 'r') as f:
    print(part2(f))
