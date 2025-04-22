// Hilbert curve map generator for Gallery3D
// Adapted from https://github.com/ClementCariou/virtual-art-gallery

// Configuration parameters
const mapSize = 6           // Log2 of the grid size (keep the value between [1, 6])
const cellSize = 8          // Size of the rooms
const mapHeight = 7         // Height of the walls
const wallThickness = 0.25  // Wall thickness
const wallRemoval = 0.5     // Random wall removal proportion

// Helper function to transform coordinates in the Hilbert curve
const transform = (a: number[][], r: number, tx: number, ty: number, o = 1): number[][] => 
  a.map((v) => [(o * v[r] + tx) / 2, (o * v[1 - r] + ty) / 2])

// Generate a Hilbert curve recursively
function hilbert(n: number): number[][] {
  if (n === 1) return transform([[0, 0], [0, 1], [1, 1], [1, 0]], 0, 0.5, 0.5)
  const h = hilbert(n - 1)
  return [
    ...transform(h, 1, 0, 0),
    ...transform(h, 0, 0, 1),
    ...transform(h, 0, 1, 1),
    ...transform(h, 1, 2, 1, -1)
  ]
}

// Generate border points along the Hilbert curve
function genBorder(n: number, w: number, m: number): number[][] {
  w = 0.5 - w / 4
  m *= Math.pow(4, n)
  console.time('hilbert')
  const points = hilbert(n)
  console.timeEnd('hilbert')
  
  // Add points to fix end
  points.unshift(points[3])
  points.push(points[points.length - 4])
  
  // Calculate direction
  console.time('dir')
  let nodes: {
    p0: number[], 
    p1: number[], 
    p2: number[], 
    s: number
  }[] = []
  
  for (let i = 0; i < points.length - 2; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const p2 = points[i + 2]
    const d1 = [p1[0] - p0[0], p1[1] - p0[1]]
    const d2 = [p2[0] - p1[0], p2[1] - p1[1]]
    nodes[i] = { p0, p1, p2, s: Math.sign(d1[0] * d2[1] - d1[1] * d2[0]) }
  }
  console.timeEnd('dir')
  
  // Fix end
  let inverse = nodes.slice(0).reverse()
  inverse = inverse.map(({ p0, p1, p2, s }) => ({ p0: p2, p1, p2: p0, s: -s }))
  
  if (n % 2) nodes.splice(-3)
  else inverse.splice(0, 3)
  
  nodes = nodes.concat(inverse)
  
  // Remove walls helper function
  const removeWall = (r: number) => {
    if (nodes[r + 1].s === -1 && nodes[r + 2].s === -1) {
      nodes[r].s--
      nodes[r + 3].s--
      nodes[r].p2 = nodes[r + 3].p1
      nodes[r + 3].p0 = nodes[r].p1
      nodes.splice(r + 1, 2)
    }
  }
  
  // Remove random walls
  console.time('rnd wall')
  for (let i = 0; i < m; i++) {
    let r = Math.floor(Math.random() * (nodes.length - 3))
    while (nodes[r + 1].s !== -1 || nodes[r + 2].s !== -1) 
      r = (r + 1) % (nodes.length - 3)
    removeWall(r)
  }
  console.timeEnd('rnd wall')
  
  // Remove bad looking walls
  console.time('pretty wall')
  for (let i = 0; i < nodes.length - 3; i++) {
    if (nodes[i].s === 1 || nodes[i + 3].s === 1) {
      removeWall(i)
    }
  }
  console.timeEnd('pretty wall')
  
  // Generate borders
  const path: number[][] = []
  console.time('border')
  nodes.map(({ p0, p1, p2, s }) => {
    const d1 = [(p1[0] - p0[0]) * w, (p1[1] - p0[1]) * w]
    const d2 = [(p2[0] - p1[0]) * w, (p2[1] - p1[1]) * w]
    if (s === 0) return
    path.push([p1[0] + s * (d1[0] - d2[0]), p1[1] + s * (d1[1] - d2[1])])
  })
  console.timeEnd('border')
  
  // Fix start
  if (n % 2) path.splice(0, 1, path[path.length - 1])
  else path.splice(-1, 1, path[0])
  
  return path
}

// Split segments into smaller parts to form a grid
function splitSegments(segments: number[][][]): {
  parts: number[][][],
  seg: number[][]
}[] {
  console.time('split segments')
  const result = segments.map(s => {
    // Calculate subsegment length
    let l = Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1])
    l = Math.ceil(l / 8 - 0.3)
    if (l <= 0) return {parts: [s], seg: s}
    
    // Lerp coordinates
    let res: number[][] = []
    for (let t = 0; t <= 1; t += 1 / l)
      res.push([s[0][0] * (1 - t) + s[1][0] * t, s[0][1] * (1 - t) + s[1][1] * t])
    
    // Form pairs of coordinates
    return {
      seg: s,
      parts: res.slice(0, -1).map((r, i) => [r, res[i + 1]])
    }
  })
  console.timeEnd('split segments')
  return result
}

// Apply riffle shuffle to sub-arrays
function merge<T>(dest: T[], org: T[], aStart: number, aEnd: number, bStart: number, bEnd: number): T[] {
  let a = org.slice(aStart, aEnd).reverse()
  let b = org.slice(bStart, bEnd)
  let prop = a.length / b.length
  
  while (a.length > 0 && b.length > 0)
    dest.push(a.length / b.length > prop ? a.pop()! : b.pop()!)
  
  while (a.length > 0) dest.push(a.pop()!)
  while (b.length > 0) dest.push(b.pop()!)
  
  return dest
}

// Reorder placement positions for optimal distribution
function reorderPlacements(placements: number[][][], r: number): number[][][] {
  console.time('reorder placements')
  let places = placements
  placements = []
  let i = 0, j = places.length - 1
  let it: [number, number][] = [], jt: [number, number][] = [], len = 0
  
  while (i < j) {
    let xi = Math.floor((places[i][0][0] + places[i][1][0]) / 4 / r)
    let yi = Math.floor((places[i][0][1] + places[i][1][1]) / 4 / r)
    let xj = Math.floor((places[j][0][0] + places[j][1][0]) / 4 / r)
    let yj = Math.floor((places[j][0][1] + places[j][1][1]) / 4 / r)
    
    if (xi === xj && yi === yj) {
      // Areas converge
      merge(placements, places, i - len, i + 1, j, j + len + 1)
      it = []; jt = []; len = 0
    } else {
      // Areas diverge
      let findi = jt.findIndex(([x, y]) => x === xi && y === yi)
      let findj = it.findIndex(([x, y]) => x === xj && y === yj)
      
      if (findi !== -1) {
        merge(placements, places, i - len, i + 1, j + len - findi, j + len + 1)
        j += len - findi // rollback
        it = []; jt = []; len = 0
      } else if (findj !== -1) {
        merge(placements, places, i - len, i - len + findj + 1, j, j + len + 1)
        i -= len - findj // rollback
        it = []; jt = []; len = 0
      } else {
        it.push([xi, yi])
        jt.push([xj, yj])
        len++
      }
    }
    i++; j--
  }
  
  placements.push(...places.slice(i - len, j + len + 1))
  console.timeEnd('reorder placements')
  return placements
}

// Generate grid data structure for efficient collision detection and placement
function genGrid(segments: number[][][], n: number, r: number) {
  console.time('gen grid')
  let splittedSegments = splitSegments(segments)
  const cellCount = Math.pow(2, n)
  
  // Initialize grid arrays
  let gridSegs: number[][][][] = Array(cellCount * cellCount).fill(null).map(() => [])
  let gridParts: number[][][][] = Array(cellCount * cellCount).fill(null).map(() => [])
  
  // Populate grid with segments and parts
  splittedSegments.forEach(({seg, parts}) => {
    parts.forEach(part => {
      const indexes = [
        Math.round(part[0][0] / r - 0.5) +
        Math.round(part[0][1] / r - 0.5) * cellCount,
        Math.round(part[1][0] / r - 0.5) +
        Math.round(part[1][1] / r - 0.5) * cellCount,
        Math.round((part[0][0] + part[1][0]) / 2 / r - 0.5) +
        Math.round((part[0][1] + part[1][1]) / 2 / r - 0.5) * cellCount
      ]
      
      for(let i of indexes) {
        if(i >= 0 && i < gridSegs.length) {
          if(!gridSegs[i].some(s => s[0][0] === seg[0][0] && s[0][1] === seg[0][1] && 
                              s[1][0] === seg[1][0] && s[1][1] === seg[1][1])) {
            gridSegs[i].push(seg)
          }
          
          if(!gridParts[i].some(p => p[0][0] === part[0][0] && p[0][1] === part[0][1] && 
                               p[1][0] === part[1][0] && p[1][1] === part[1][1])) {
            gridParts[i].push(part)
          }
        }
      }
    })
  })
  
  // Helper functions to access grid data
  const getGridSegments = (x: number, y: number): number[][][] => {
    const index = Math.round(x/r - 0.5) + Math.round(y/r - 0.5) * cellCount
    return (index >= 0 && index < gridSegs.length) ? gridSegs[index] : []
  }
  
  const getGridParts = (x: number, y: number): number[][][] => {
    const index = Math.round(x/r - 0.5) + Math.round(y/r - 0.5) * cellCount
    return (index >= 0 && index < gridParts.length) ? gridParts[index] : []
  }
  
  // Prepare placements for artwork
  let placements = splittedSegments.flatMap(({parts}) => parts)
  
  // Ignore short segments for painting placement (too small for artworks)
  placements = placements.filter(([[ax, ay], [bx, by]]) => Math.hypot(ax - bx, ay - by) > 1)
  
  // Reorder placements for better distribution
  placements = reorderPlacements(placements, r)
  
  // Calculate area centers for each placement
  const areas = placements.map(place => [
    (Math.round((place[0][0] + place[1][0]) / 2 / r + 0.5) - 0.5) * r,
    (Math.round((place[0][1] + place[1][1]) / 2 / r + 0.5) - 0.5) * r
  ])
  
  // Find area index for a given coordinate
  const getAreaIndex = (x: number, y: number): number => {
    let index = areas.findIndex(a => Math.abs(a[0] - x) < r / 2 && Math.abs(a[1] - y) < r / 2)
    if (index === -1) // Middle of room => search neighbor cells
      index = areas.findIndex(a => Math.abs(a[0] - x) + Math.abs(a[1] - y) < r)
    return index
  }
  
  console.timeEnd('gen grid')
  return {getGridSegments, getGridParts, getAreaIndex, placements}
}

// Main map generation function
export interface MapData {
  placements: number[][][]
  getAreaIndex: (x: number, y: number) => number
  getGridSegments: (x: number, y: number) => number[][][]
  getGridParts: (x: number, y: number) => number[][][]
  position: number[][]
  normal: number[][]
  elements: number[]
}

export default function generateMap(
  n = mapSize, 
  r = cellSize, 
  w = wallThickness, 
  m = wallRemoval, 
  h = mapHeight
): MapData {
  let s = r * Math.pow(2, n)
  let border = genBorder(n + 1, w, m).map((v) => [v[0] * s, v[1] * s])
  
  console.time('gen mesh')
  // Create segments from border points
  let segments = border.slice(0, -1).map((p, i) => [p, border[i + 1]])
  
  // Generate normals for each segment (for both bottom and top vertices)
  let normal = segments
    .map(([[x1, y1], [x2, y2]]) => [Math.sign(y1 - y2), 0, Math.sign(x2 - x1)])
    .flatMap((v) => Array(4).fill(v))
  
  // Generate positions for vertices
  let position = segments.flatMap(([p1, p2]) => [
    [p1[0], 0, p1[1]], // Bottom vertex 1
    [p1[0], h, p1[1]], // Top vertex 1
    [p2[0], 0, p2[1]], // Bottom vertex 2
    [p2[0], h, p2[1]]  // Top vertex 2
  ])
  
  // Get grid and placement data
  const {getAreaIndex, getGridSegments, getGridParts, placements} = genGrid(segments, n, r)
  
  // Add floor and ceiling normals and positions
  normal.push(
    [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], // Ceiling (pointing down)
    [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]      // Floor (pointing up)
  )
  
  position.push(
    [0, h, 0], [0, h, s], [s, h, 0], [s, h, s],     // Ceiling vertices
    [0, 0, 0], [s, 0, 0], [0, 0, s], [s, 0, s]      // Floor vertices
  )
  
  // Generate triangle elements (indices)
  let elements = Array(position.length / 4)
    .fill(null)
    .flatMap((_, i) => [
      i * 4, i * 4 + 2, i * 4 + 1,     // First triangle
      i * 4 + 1, i * 4 + 2, i * 4 + 3  // Second triangle
    ])
  
  console.timeEnd('gen mesh')
  console.log(placements.length + " available painting placements")
  
  return {
    placements,
    getAreaIndex,
    getGridSegments,
    getGridParts,
    position,
    normal,
    elements
  }
} 