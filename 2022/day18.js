function part1(input) {
  const points = new Set();
  let surfaceArea = 0;
  for (const line of input.trim().split('\n')) {
    points.add(line);
  }
  for (const point of points) {
    const [x,y,z] = point.split(',').map(n => +n);
    surfaceArea += [
      `${x+1},${y},${z}`,
      `${x-1},${y},${z}`,
      `${x},${y+1},${z}`,
      `${x},${y-1},${z}`,
      `${x},${y},${z+1}`,
      `${x},${y},${z-1}`
    ].map(p => points.has(p) ? 0 : 1).reduce((a,b) => a+b);
  }
  return surfaceArea;
}

function part2(input) {
  const points = new Set();
  let surfaceArea = 0;
  for (const line of input.trim().split('\n')) {
    points.add(line);
  }
  const xList = [...points].map(p => +p.split(',')[0]);
  const yList = [...points].map(p => +p.split(',')[1]);
  const zList = [...points].map(p => +p.split(',')[2]);
  const xMin = Math.min(...xList);
  const xMax = Math.max(...xList);
  const yMin = Math.min(...yList);
  const yMax = Math.max(...yList);
  const zMin = Math.min(...zList);
  const zMax = Math.max(...zList);
  const inside = new Set();
  const outside = new Set();
  function isOutside(point) {
    if (points.has(point)) {
      return false;
    } else if (inside.has(point)) {
      return false;
    } else if (outside.has(point)) {
      return true;
    } else {
      const visited = new Set();
      const stack = [point];
      let isOutside = false;
      while (stack.length > 0) {
        p = stack.pop();
        if (points.has(p)) {
          continue;
        } else if (inside.has(p)) {
          break;
        } else if (outside.has(p)) {
          isOutside = true;
          break;
        } else if (visited.has(p)) {
          continue;
        } else {
          visited.add(p);
          const [x,y,z] = p.split(',').map(n => +n);
          if (x < xMin || x > xMax || y < yMin || y > yMax || z < zMin || z > zMax) {
            isOutside = true;
            break;
          }
          stack.push(
            `${x+1},${y},${z}`,
            `${x-1},${y},${z}`,
            `${x},${y+1},${z}`,
            `${x},${y-1},${z}`,
            `${x},${y},${z+1}`,
            `${x},${y},${z-1}`
          );
        }
      }
      for (const v of visited) {
        if (isOutside) {
          outside.add(v);
        } else {
          inside.add(v);
        }
      }
      return isOutside;
    }
  }
  for (const point of points) {
    const [x,y,z] = point.split(',').map(n => +n);
    surfaceArea += [
      `${x+1},${y},${z}`,
      `${x-1},${y},${z}`,
      `${x},${y+1},${z}`,
      `${x},${y-1},${z}`,
      `${x},${y},${z+1}`,
      `${x},${y},${z-1}`
    ].map(p => isOutside(p) ? 1 : 0).reduce((a,b) => a+b);
  }
  return surfaceArea;

}