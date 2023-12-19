from collections import ChainMap
from functools import reduce
from operator import mul
from typing import Iterator, NamedTuple

class Part(NamedTuple):
  x: int
  m: int
  a: int
  s: int

class Command(NamedTuple):
  category: str
  comparison: str
  value: int
  result: str

class Workflow(NamedTuple):
  name: str
  commands: list[Command]
  default: str

def parse_workflow(line: str) -> Workflow:
  brace_index = line.index('{')
  name = line[:brace_index]
  groups = line[brace_index + 1: -1].split(',')
  commands = [Command(group[0], group[1], int(group[2:group.index(':')]), group[group.index(':') +1:]) for group in groups[:-1]]
  return Workflow(name, commands, groups[-1])

def parse_part(line: str) -> Part:
  return Part(*(int(group[2:]) for group in line[1: -1].split(',')))

def execute_workflow(workflow: Workflow, part: Part) -> str:
  for command in workflow.commands:
    if command.comparison == '>':
      if getattr(part, command.category) > command.value:
        return command.result
    else:
      # command.comparison == '<'
      if getattr(part, command.category) < command.value:
        return command.result
  return workflow.default

def is_accepted(workflows: dict[str, Workflow], part: Part) -> bool:
  current = 'in'
  while True:
    current_workflow = workflows[current]
    result = execute_workflow(current_workflow, part)
    if result == 'A':
      return True
    elif result == 'R':
      return False
    else:
      current = result

def part1(input: Iterator[str]) -> int:
  workflows: dict[str, Workflow] = {}
  parts: list[Part] = []
  for line in input:
    line = line.rstrip()
    if line.startswith('{'):
      parts.append(parse_part(line))
    elif len(line) > 0:
      workflow = parse_workflow(line)
      workflows[workflow.name] = workflow
  return sum(sum(part) for part in parts if is_accepted(workflows, part))

class Range(NamedTuple):
  min: int
  max: int

class PartRange(NamedTuple):
  x: Range
  m: Range
  a: Range
  s: Range

def part_range_size(range: PartRange):
  return reduce(mul, ((r.max + 1) - r.min for r in range), 1)

# Splits into matched, unmatched
def split_part_range(range: PartRange, command: Command) -> tuple[PartRange | None, PartRange | None]:
  category_range: Range = getattr(range, command.category)
  if command.comparison == '>':
    return (PartRange(**ChainMap({command.category: Range(max(category_range.min, command.value + 1), category_range.max)}, range._asdict())) if category_range.max > command.value else None,
            PartRange(**ChainMap({command.category: Range(category_range.min, min(category_range.max, command.value))}, range._asdict())) if category_range.min <= command.value else None)
  else:
    # command.comparison == '<'
    return (PartRange(**ChainMap({command.category: Range(category_range.min, min(category_range.max, command.value - 1))}, range._asdict())) if category_range.min < command.value else None,
            PartRange(**ChainMap({command.category: Range(max(category_range.min, command.value), category_range.max)}, range._asdict())) if category_range.max >= command.value else None)

def count_accepted(workflows: dict[str, Workflow], name: str, range: PartRange) -> int:
  workflow = workflows[name]
  unmatched = range
  total = 0
  for command in workflow.commands:
    if unmatched is None:
      break
    matched, unmatched = split_part_range(unmatched, command)
    if matched is not None:
      if command.result == 'A':
        total += part_range_size(matched)
      elif command.result != 'R':
        total += count_accepted(workflows, command.result, matched)
  if unmatched is not None:
    if workflow.default == 'A':
      total += part_range_size(unmatched)
    elif workflow.default != 'R':
      total += count_accepted(workflows, workflow.default, unmatched)
  return total

def part2(input: Iterator[str]) -> int:
  workflows: dict[str, Workflow] = {}
  for line in input:
    line = line.rstrip()
    if line and not line.startswith('{'):
      workflow = parse_workflow(line)
      workflows[workflow.name] = workflow
  total_range = PartRange(*([Range(1, 4000)] * 4))
  return count_accepted(workflows, 'in', total_range)

test_input = '''px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input))
  with open('./day19input.txt', 'r') as f:
    print(part1(f))
  print(part2(test_input))
  with open('./day19input.txt', 'r') as f:
    print(part2(f))
