from collections import namedtuple
from dataclasses import dataclass, field
from enum import IntEnum
from queue import PriorityQueue
from typing import Any, Iterator

class Direction(IntEnum):
  NORTH = 1
  SOUTH = 2
  EAST = 3
  WEST = 4

Point = namedtuple('Point', ['row', 'col'])

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

def distance(point1: Point, point2: Point):
  return abs(point1.row - point2.row) + abs(point1.col - point2.col)

left: dict[Direction, Direction] = {
  Direction.NORTH: Direction.WEST,
  Direction.WEST: Direction.SOUTH,
  Direction.SOUTH: Direction.EAST,
  Direction.EAST: Direction.NORTH
}

right: dict[Direction, Direction] = {
  Direction.NORTH: Direction.EAST,
  Direction.EAST: Direction.SOUTH,
  Direction.SOUTH: Direction.WEST,
  Direction.WEST: Direction.NORTH
}

# path_cost: int
# head: Point
# last_directions: list[Direction]
FrontierEntry = namedtuple('FrontierEntry', ['path_cost', 'head', 'directions'])

@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: FrontierEntry=field(compare=False)

def heuristic(point1: Point, point2: Point):
  return distance(point1, point2)

def all_equal(values: list[Any]):
  return len(values) == 0 or all(value == values[0] for value in values)

def find_least_heat_loss(grid: list[list[int]], start: Point, end: Point, min_consecutive: int, max_consecutive: int) -> int:
  frontier = PriorityQueue()
  visited: set[(Point, tuple(Direction))] = set()
  for direction in Direction:
    next = in_direction(start, direction)
    if in_range(next, len(grid), len(grid[0])):
      edge_cost = grid[next.row][next.col]
      frontier.put((edge_cost + heuristic(next, end), FrontierEntry(edge_cost, next, [direction])))
  while not frontier.empty():
    (_, current) = frontier.get()
    if current.head == end and (min_consecutive == 0 or all_equal(current.directions[-min_consecutive:])):
      return current.path_cost
    if (current.head, tuple(current.directions)) in visited:
      continue
    visited.add((current.head, tuple(current.directions)))
    last_direction = current.directions[-1]
    directions = []
    if min_consecutive == 0 or (len(current.directions) >= min_consecutive and all_equal(current.directions[-min_consecutive:])):
      directions += [left[last_direction], right[last_direction]]
    if not (len(current.directions) >= max_consecutive and all_equal(current.directions[-max_consecutive:])):
      directions.append(last_direction)
    for direction in directions:
      next = in_direction(current.head, direction)
      if in_range(next, len(grid), len(grid[0])):
        edge_cost = grid[next.row][next.col]
        frontier.put((current.path_cost + edge_cost + heuristic(next, end), FrontierEntry(current.path_cost + edge_cost, next, current.directions[-max_consecutive + 1:] + [direction])))
  return 0

def part1(input: Iterator[str]) -> int:
  grid = tuple(tuple(int(char) for char in line.rstrip()) for line in input)
  return find_least_heat_loss(grid, Point(0, 0), Point(len(grid) - 1, len(grid[-1]) - 1), 0, 3)

def part2(input: Iterator[str]) -> int:
  grid = tuple(tuple(int(char) for char in line.rstrip()) for line in input)
  return find_least_heat_loss(grid, Point(0, 0), Point(len(grid) - 1, len(grid[-1]) - 1), 4, 10)

test_input = '''2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533'''.split('\n')

test_input2 = '''111111111111
999999999991
999999999991
999999999991
999999999991'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day17input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  print(part2(test_input2))
  with open('./day17input.txt', 'r') as f:
    print(part2(f))
