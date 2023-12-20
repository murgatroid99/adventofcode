from abc import ABC, abstractmethod
from collections import defaultdict
import math
from typing import DefaultDict, Iterator, NamedTuple, Self

class Pulse(NamedTuple):
  source: str
  dest: str
  high: bool

class Module(ABC):
  @abstractmethod
  def receive_pulse(self: Self, pulse: Pulse) -> list[Pulse]:
    pass

class FlipFlop(Module):
  def __init__(self: Self, name: str, outputs: list[str]):
    self.name = name
    self.outputs = outputs
    self.on = False

  def receive_pulse(self: Self, pulse: Pulse) -> list[Pulse]:
    if pulse.high:
      return []
    else:
      self.on = not self.on
      return [Pulse(self.name, dest, self.on) for dest in self.outputs]

class Conjunction(Module):
  def __init__(self: Self, name: str, outputs: list[str], inputs: list[str]):
    self.name = name
    self.outputs = outputs
    self.memory = {input: False for input in inputs}

  def receive_pulse(self: Self, pulse: Pulse) -> list[Pulse]:
    self.memory[pulse.source] = pulse.high
    high_out = not all(self.memory.values())
    return [Pulse(self.name, dest, high_out) for dest in self.outputs]

class Broadcaster(Module):
  def __init__(self: Self, name: str, outputs: list[str]):
    self.name = name
    self.outputs = outputs

  def receive_pulse(self: Self, pulse: Pulse) -> list[Pulse]:
    return [Pulse(self.name, dest, pulse.high) for dest in self.outputs]

def process_pulse(modules: dict[str, Module], pulse: Pulse) -> tuple[int, int, bool]:
  pending_pulses: list[Pulse] = [pulse]
  low_pulses_sent: int = 0
  high_pulses_sent: int = 0
  low_pulse_sent_to_rx = False
  while pending_pulses:
    next_pulse = pending_pulses.pop(0)
    if next_pulse.high:
      high_pulses_sent += 1
    else:
      low_pulses_sent += 1
    if next_pulse.dest == 'rx' and not next_pulse.high:
      low_pulse_sent_to_rx = True
    if next_pulse.dest not in modules:
      continue
    pending_pulses += modules[next_pulse.dest].receive_pulse(next_pulse)
  return (low_pulses_sent, high_pulses_sent, low_pulse_sent_to_rx)

def parse_input(input: Iterator[str]) -> dict[str, Module]:
  modules: dict[str, Module] = {}
  conjunctions: list[tuple[str, list[str]]] = []
  inputs: DefaultDict[str, list[str]] = defaultdict(list)
  for line in input:
    line = line.rstrip()
    if line.startswith('%'):
      name, outputs_str = line[1:].split(' -> ')
      outputs = outputs_str.split(', ')
      modules[name] = FlipFlop(name, outputs)
    elif line.startswith('&'):
      name, outputs_str = line[1:].split(' -> ')
      outputs = outputs_str.split(', ')
      conjunctions.append((name, outputs))
    else:
      name, outputs_str = line.split(' -> ')
      outputs = outputs_str.split(', ')
      modules[name] = Broadcaster(name, outputs)
    for output in outputs:
      inputs[output].append(name)
  for name, outputs in conjunctions:
    modules[name] = Conjunction(name, outputs, inputs[name])
  return modules


def part1(input: Iterator[str]) -> int:
  modules = parse_input(input)
  low_pulses_sent: int = 0
  high_pulses_sent: int = 0
  for _ in range(1000):
    high, low, _ = process_pulse(modules, Pulse('button', 'broadcaster', False))
    high_pulses_sent += high
    low_pulses_sent += low
  return high_pulses_sent * low_pulses_sent

def part2(input: Iterator[str]) -> int:
  modules = parse_input(input)
  press_count: int = 0
  sent = False
  while not sent:
    _, _, sent = process_pulse(modules, Pulse('button', 'broadcaster', False))
    press_count += 1
  return press_count

def generate_dot(input: Iterator[str]) -> str:
  output_lines = ['digraph {', 'button [shape=plain]', 'button -> broadcaster']
  modules = parse_input(input)
  for module in modules.values():
    if isinstance(module, FlipFlop):
      output_lines.append(f'{module.name} [shape=box]')
    elif isinstance(module, Conjunction):
      output_lines.append(f'{module.name} [shape=ellipse]')
    else:
      output_lines.append(f'{module.name} [shape=diamond]')
    output_lines.append(f'{module.name} -> {{{" ".join(module.outputs)}}}')
  output_lines.append('}')
  return '\n'.join(output_lines)

test_input1 = '''broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a'''.split('\n')

test_input2 = '''broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output'''.split('\n')

if __name__ == '__main__':
  print(part1(test_input1))
  print(part1(test_input2))
  with open('./day20input.txt', 'r') as f:
    print(part1(f))
  #with open('./day20input.txt', 'r') as f:
    #print(generate_dot(f))
    #print(part2(f))
  # The input describes a set of four 12-digit counters that each count to a
  # different number. Output goes to rx when all numbers are reached at the
  # same time. The input file contains the four numbers, represented in binary,
  # derived by manual examination of the module diagram
  with open('./day20input2.txt', 'r') as f:
    print(math.lcm(*(int(s.rstrip(), 2) for s in f if s)))
