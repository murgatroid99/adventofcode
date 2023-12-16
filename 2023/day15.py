from collections import namedtuple
from typing import Iterator

Lens = namedtuple('Lens', ['name', 'length'])

def hash_code(value: str) -> int:
  current = 0
  for char in value:
    current += ord(char)
    current *= 17
    current %= 256
  return current

def part1(input: Iterator[str]) -> int:
  total = 0
  for line in input:
    for value in line.rstrip().split(','):
      total += hash_code(value)
  return total

def calculate_focusing_power(boxes: list[list[Lens]]) -> int:
  total = 0
  for box_num, box in enumerate(boxes):
    for lens_num, lens in enumerate(box):
      total += (box_num + 1) * (lens_num + 1) * lens.length
  return total

def lens_to_string(lens: Lens) -> str:
  return f'[{lens.name} {lens.length}]'

def boxes_to_string(boxes: list[list[Lens]]) -> str:
  return '\n'.join(f'Box {box_num}: {" ".join(lens_to_string(lens) for lens in box)}' for box_num, box in enumerate(boxes) if len(box) > 0)

def get_focusing_power(commands: list[str]) -> int:
  boxes: list[list[Lens]] = [[] for _ in range(256)]
  for command in commands:
    if command[-1].isdigit():
      name = command[:-2]
      box = boxes[hash_code(name)]
      lens = Lens(name, int(command[-1]))
      for i in range(len(box)):
        if box[i].name == name:
          box[i] = lens
          break
      else:
        box.append(lens)
    else:
      name = command[:-1]
      box_num = hash_code(name)
      box = boxes[box_num]
      boxes[box_num] = [lens for lens in box if lens.name != name]
    #print(f'After "{command}":')
    #print(boxes_to_string(boxes))
    #print('')
  return calculate_focusing_power(boxes)

def part2(input: Iterator[str]) -> int:
  for line in input:
    return get_focusing_power(line.rstrip().split(','))

test_input = ['rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7']

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day15input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  with open('./day15input.txt', 'r') as f:
    print(part2(f))
