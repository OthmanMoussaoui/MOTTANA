// First-person camera controller with collision detection
// Adapted from https://github.com/ClementCariou/virtual-art-gallery

import * as THREE from 'three'
import { MapData } from './map'

// Configuration
const MOUSE_SENSITIVITY = 0.002
const TOUCH_SENSITIVITY = 0.008
const ROTATION_FILTER = 0.95
const LIMIT_ANGLE = Math.PI / 4
const SLOW_ANGLE = Math.PI / 6
const DURATION_TO_CLICK = 300
const DIST_TO_CLICK = 20
const WALK_SPEED = 7
const RUN_SPEED = 12
const WALK_STEP_LEN = 3.6
const RUN_STEP_LEN = 5
const PLAYER_HEIGHT = 1.7
const STEP_HEIGHT = 0.03
const DIST_TO_WALLS = 0.5
const VIEWING_DIST = 3
const PAINTING_SNAP_DIST = 1.3
const Y_LIMIT_TOUCH = 5
const TOUCH_DIST_LIMIT = 40
const RAY_STEP = 4
const TP_DURATION = 1

// Math helpers
const sdLine = (
  p: THREE.Vector3, 
  a: number[], 
  b: number[], 
  tmp1: THREE.Vector3 = new THREE.Vector3(), 
  tmp2: THREE.Vector3 = new THREE.Vector3()
): number => {
  const pa = tmp1.set(p.x - a[0], p.y - a[1], p.z - a[2])
  const ba = tmp2.set(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  
  const h = Math.max(Math.min(pa.dot(ba) / ba.dot(ba), 1), 0)
  
  pa.sub(ba.multiplyScalar(h))
  return pa.length()
}

const planeProject = (
  origin: THREE.Vector3, 
  dir: THREE.Vector3, 
  plane: number[]
): { dist: number, intersection: THREE.Vector3 } => {
  // plane is [nx, ny, nz, d] where d is the distance from origin
  const dot = origin.x * plane[0] + origin.y * plane[1] + origin.z * plane[2]
  const dist = -(dot - plane[3]) / (dir.x * plane[0] + dir.y * plane[1] + dir.z * plane[2])
  
  const intersection = new THREE.Vector3()
  intersection.copy(dir).multiplyScalar(dist).add(origin)
  
  return { dist, intersection }
}

const wallProject = (
  origin: THREE.Vector3, 
  dir: THREE.Vector3, 
  a: number[], 
  b: number[]
): { a: number[], b: number[], dist: number, intersection: THREE.Vector3 } => {
  // Calculate the vertical plane passing through A and B
  const vx = a[0] - b[0], vz = a[1] - b[1]
  const nx = -vz, nz = vx
  const wAB = a[0] * nx + a[1] * nz
  
  // Project to the plane
  const result = planeProject(origin, dir, [nx, 0, nz, wAB])
  let { dist, intersection: i } = result
  
  // Verify it's between A and B
  const wA = a[0] * vx + a[1] * vz
  const wB = b[0] * vx + b[1] * vz
  const wI = i.x * vx + i.z * vz
  
  // Check if the intersection point is between the segment endpoints
  // Fix for linter error: converting boolean sum to numeric comparison
  if (!((wI > wA && wI <= wB) || (wI <= wA && wI > wB))) {
    dist = Infinity
  }
  
  return { a, b, dist, intersection: i }
}

const lerp = (x: number, a: number, b: number): number => (1 - x) * a + x * b

const easeInOutQuad = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2

interface FPSControllerOptions {
  enablePointerLock?: boolean
  enableTouchControls?: boolean
  domElement: HTMLElement
  onMove?: (position: THREE.Vector3) => void
  onLook?: (rotation: { x: number, y: number }) => void
  onTeleport?: (from: THREE.Vector3, to: THREE.Vector3) => void
  onFootstep?: (position: THREE.Vector3, isRunning: boolean) => void
}

export default class FPSController {
  camera: THREE.PerspectiveCamera
  velocity = new THREE.Vector3()
  direction = new THREE.Vector3()
  position = new THREE.Vector3(2, PLAYER_HEIGHT, 2)
  rotation = { x: 0, y: Math.PI * 3 / 4 }
  filteredRotation = { x: 0, y: Math.PI * 3 / 4 }
  forward = new THREE.Vector3(0.707, 0, 0.707)
  up = new THREE.Vector3(0, 1, 0)
  force = new THREE.Vector3()
  walkTime = 0.5
  run = false
  startPos = new THREE.Vector3()
  endPos = new THREE.Vector3()
  tpProgress = 1
  keys: Record<string, boolean> = {}
  lastTime = 0
  mapData: MapData
  enabled = true
  tmp1 = new THREE.Vector3()
  tmp2 = new THREE.Vector3()
  
  // Touch controls
  firstTouch: Touch | null = null
  lastTouch: Touch | null = null
  touchTimestamp = 0
  
  // Options
  onMove?: (position: THREE.Vector3) => void
  onLook?: (rotation: { x: number, y: number }) => void
  onTeleport?: (from: THREE.Vector3, to: THREE.Vector3) => void
  onFootstep?: (position: THREE.Vector3, isRunning: boolean) => void
  
  constructor(camera: THREE.PerspectiveCamera, mapData: MapData, options: FPSControllerOptions) {
    this.camera = camera
    this.mapData = mapData
    this.position.copy(camera.position)
    
    // Set options
    this.onMove = options.onMove
    this.onLook = options.onLook
    this.onTeleport = options.onTeleport
    this.onFootstep = options.onFootstep
    
    // Initialize camera position
    this.updateCamera()
    
    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleTouch = this.handleTouch.bind(this)
    
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    
    // Set up pointer lock if enabled
    if (options.enablePointerLock) {
      options.domElement.addEventListener('click', () => {
        options.domElement.requestPointerLock()
      })
      
      document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === options.domElement) {
          document.addEventListener('mousemove', this.handleMouseMove)
        } else {
          document.removeEventListener('mousemove', this.handleMouseMove)
        }
      })
    }
    
    // Set up touch controls if enabled
    if (options.enableTouchControls) {
      options.domElement.addEventListener('touchstart', this.handleTouch, { passive: false })
      options.domElement.addEventListener('touchmove', this.handleTouch, { passive: false })
      options.domElement.addEventListener('touchend', this.handleTouch, { passive: false })
    }
  }
  
  orientCamera(dx: number, dy: number, sensitivity: number) {
    // Clamp delta values to prevent jumps
    dx = Math.max(Math.min(dx, 100), -100)
    dy = Math.max(Math.min(dy, 100), -100)
    
    // Apply sensitivity smoothing near the limit angles
    let smooth = 1
    if (Math.abs(this.rotation.x) > SLOW_ANGLE && Math.sign(this.rotation.x) === Math.sign(dy)) {
      smooth = (LIMIT_ANGLE - Math.abs(this.rotation.x)) / (LIMIT_ANGLE - SLOW_ANGLE)
    }
    
    // Update rotation with smoothing
    this.rotation.x += smooth * dy * sensitivity
    this.rotation.y += dx * sensitivity
    
    // Clamp vertical rotation to prevent flipping
    this.rotation.x = Math.max(Math.min(this.rotation.x, LIMIT_ANGLE), -LIMIT_ANGLE)
    
    if (this.onLook) {
      this.onLook(this.rotation)
    }
  }
  
  handleMouseMove(event: MouseEvent) {
    if (!this.enabled) return
    
    this.orientCamera(event.movementX, event.movementY, MOUSE_SENSITIVITY)
  }
  
  handleTouch(event: TouchEvent) {
    if (!this.enabled) return
    
    event.preventDefault()
    
    if (event.type === "touchstart") {
      this.firstTouch = this.lastTouch = event.touches[0]
      this.touchTimestamp = event.timeStamp
    } else if (event.type === "touchend") {
      if (!this.firstTouch || !this.lastTouch) return
      
      const d = Math.hypot(
        this.firstTouch.pageX - this.lastTouch.pageX,
        this.firstTouch.pageY - this.lastTouch.pageY
      )
      
      if (event.timeStamp - this.touchTimestamp < DURATION_TO_CLICK && d < DIST_TO_CLICK) {
        this.handleTouchTeleport(this.lastTouch)
      }
      
      this.firstTouch = this.lastTouch = null
    } else if (event.type === "touchmove" && this.lastTouch) {
      this.orientCamera(
        event.touches[0].pageX - this.lastTouch.pageX, 
        event.touches[0].pageY - this.lastTouch.pageY,
        TOUCH_SENSITIVITY
      )
      
      this.lastTouch = event.touches[0]
    }
  }
  
  handleTouchTeleport(touch: Touch) {
    // Convert touch to normalized device coordinates
    const elementRect = (touch.target as HTMLElement).getBoundingClientRect()
    const touchX = ((touch.pageX - elementRect.left) / elementRect.width) * 2 - 1
    const touchY = -((touch.pageY - elementRect.top) / elementRect.height) * 2 + 1
    
    // Create ray from camera through touch point
    const touchDir = new THREE.Vector3(touchX, touchY, 0)
    touchDir.unproject(this.camera)
    touchDir.sub(this.position).normalize()
    
    // Project to the floor and ceiling
    const floorResult = planeProject(this.position, touchDir, [0, 1, 0, 0])
    const ceilingResult = planeProject(this.position, touchDir, [0, 1, 0, Y_LIMIT_TOUCH])
    
    // Get walls that might intersect with the raycast
    let [x, , z] = [this.position.x, this.position.y, this.position.z]
    let [dx, , dz] = [touchDir.x, touchDir.y, touchDir.z]
    const dirLen = Math.hypot(dx, dz)
    if (dirLen > 0) {
      dx /= dirLen
      dz /= dirLen
    }
    
    // Cast ray and collect potential wall segments
    let walls: number[][][] = this.mapData.getGridSegments(x, z)
    for (let i = 0; i < TOUCH_DIST_LIMIT / RAY_STEP; i++) {
      x += dx * RAY_STEP
      z += dz * RAY_STEP
      walls = [...walls, ...this.mapData.getGridSegments(x, z)]
    }
    
    // Get unique wall segments
    const uniqueWalls = [...new Set(walls.map(w => JSON.stringify(w)))]
      .map(w => JSON.parse(w) as number[][])
    
    // Project ray to walls
    let intersections = uniqueWalls
      .map(([a, b]) => wallProject(this.position, touchDir, a, b))
      .filter(({dist}) => 
        dist > 0 && 
        dist < Math.max(floorResult.dist, ceilingResult.dist) && 
        dist < TOUCH_DIST_LIMIT
      )
    
    // Sort by distance
    intersections.sort((a, b) => a.dist - b.dist)
    
    if (intersections.length !== 0) {
      // Teleport to wall
      const { intersection } = intersections[0]
      const xpos = intersection.x
      const zpos = intersection.z
      
      // Check if we should snap to a painting
      const nearParts = this.mapData.getGridParts(xpos, zpos)
      for (const [a, b] of nearParts) {
        const midX = (a[0] + b[0]) / 2
        const midZ = (a[1] + b[1]) / 2
        
        // Snap to the front of the painting
        if (Math.hypot(xpos - midX, zpos - midZ) < PAINTING_SNAP_DIST) {
          intersection.x = midX
          intersection.z = midZ
          break
        }
      }
      
      this.startPos.copy(this.position)
      this.endPos.set(intersection.x, this.position.y, intersection.z)
    } else if (floorResult.dist > 0) {
      // Teleport to floor
      this.startPos.copy(this.position)
      this.endPos.set(
        floorResult.intersection.x, 
        this.position.y, 
        floorResult.intersection.z
      )
    } else {
      return
    }
    
    // Snap position to allowed area (avoid walls)
    let collisions = this.mapData.getGridSegments(this.endPos.x, this.endPos.z)
      .map(([[ax, ay], [bx, by]]) => [[ax, PLAYER_HEIGHT, ay], [bx, PLAYER_HEIGHT, by]])
      .map(([a, b]) => ({
        a, b, dist: sdLine(this.endPos, a, b, this.tmp1, this.tmp2)
      }))
      .filter(({dist}) => dist < VIEWING_DIST)
    
    // Sort by distance
    collisions.sort((a, b) => a.dist - b.dist)
    
    if (collisions.length !== 0) {
      for (let {a, b} of collisions) {
        const distance = VIEWING_DIST - sdLine(this.endPos, a, b, this.tmp1, this.tmp2)
        if (distance < 0) continue
        
        // Segment normal
        const delta = this.tmp1.set(b[0] - a[0], b[1] - a[1], b[2] - a[2])
        const nx = -delta.z, nz = delta.x // Perpendicular in 2D
        
        // Normalize
        const len = Math.hypot(nx, nz)
        if (len > 0) {
          const adjustedDist = distance / len
          this.endPos.x += nx * adjustedDist
          this.endPos.z += nz * adjustedDist
        }
      }
    }
    
    // Start teleport animation
    this.tpProgress = 0
    
    if (this.onTeleport) {
      this.onTeleport(this.startPos, this.endPos)
    }
  }
  
  handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return
    
    this.keys[event.code] = true
    this.run = event.shiftKey
  }
  
  handleKeyUp(event: KeyboardEvent) {
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return
    
    this.keys[event.code] = false
    this.run = event.shiftKey
  }
  
  updateDirection() {
    const left = this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0
    const right = this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0
    const up = this.keys['KeyW'] || this.keys['ArrowUp'] ? 1 : 0
    const down = this.keys['KeyS'] || this.keys['ArrowDown'] ? 1 : 0
    
    this.direction.set(right - left, 0, down - up)
  }
  
  updateCamera() {
    // Apply rotations to camera
    this.camera.position.copy(this.position)
    
    // Apply head bobbing effect when walking
    if (this.walkTime !== 0.25) {
      this.camera.position.y += STEP_HEIGHT * Math.cos(2 * Math.PI * this.walkTime)
    }
    
    // Update camera rotation - convert from Euler to Quaternion
    this.camera.quaternion.setFromEuler(
      new THREE.Euler(
        this.filteredRotation.x,
        this.filteredRotation.y,
        0,
        'YXZ'
      )
    )
  }
  
  update(time: number) {
    if (!this.enabled) return
    
    // Calculate delta time
    const dt = time - this.lastTime
    this.lastTime = time
    
    // Update movement direction from keys
    this.updateDirection()
    
    // Apply direction based on camera rotation
    this.force.set(0, 0, 0)
    this.forward.set(0, 0, 1).applyQuaternion(this.camera.quaternion)
    this.forward.y = 0
    this.forward.normalize()
    
    const right = new THREE.Vector3()
      .crossVectors(this.up, this.forward)
      .normalize()
    
    // Calculate movement force based on input and orientation
    if (this.direction.z !== 0) {
      this.force.add(
        this.forward.clone().multiplyScalar(-this.direction.z)
      )
    }
    
    if (this.direction.x !== 0) {
      this.force.add(
        right.clone().multiplyScalar(this.direction.x)
      )
    }
    
    // Normalize and scale by speed
    if (this.force.lengthSq() > 0) {
      this.force.normalize()
      const speed = (this.run ? RUN_SPEED : WALK_SPEED)
      this.force.multiplyScalar(speed * dt)
    }
    
    // Save old position for collision detection
    const newPos = this.position.clone().add(this.force)
    
    // Collide with walls
    const collisions = this.mapData.getGridSegments(newPos.x, newPos.z)
      .map(([[ax, ay], [bx, by]]) => [[ax, PLAYER_HEIGHT, ay], [bx, PLAYER_HEIGHT, by]])
      .filter(([a, b]) => sdLine(newPos, a, b, this.tmp1, this.tmp2) < DIST_TO_WALLS)
    
    if (collisions.length !== 0) {
      for (let [a, b] of collisions) {
        const distance = DIST_TO_WALLS - sdLine(newPos, a, b, this.tmp1, this.tmp2)
        
        // Calculate normal to the wall
        const dx = b[0] - a[0]
        const dz = b[2] - a[2]
        const len = Math.hypot(dx, dz)
        
        if (len > 0) {
          const nx = -dz / len
          const nz = dx / len
          
          // Apply collision response
          this.force.x += nx * distance
          this.force.z += nz * distance
        }
      }
    }
    
    // Apply walk animation
    const moveDistance = this.force.length()
    if (moveDistance === 0 && this.walkTime !== 0.25) {
      this.walkTime = (Math.abs((this.walkTime + 0.5) % 1 - 0.5) - 0.25) * 0.8 + 0.25
      if ((this.walkTime + 0.01) % 0.25 < 0.02) {
        this.walkTime = 0.25
      }
    }
    
    const lastWalkTime = this.walkTime
    if (moveDistance > 0) {
      this.walkTime += moveDistance / (this.run ? RUN_STEP_LEN : WALK_STEP_LEN)
      
      // Trigger footstep sound
      if (Math.floor(lastWalkTime) !== Math.floor(this.walkTime) && this.onFootstep) {
        this.onFootstep(this.position, this.run)
      }
    }
    
    // Apply position change
    this.position.add(this.force)
    
    // Apply teleportation
    if (this.tpProgress < 1) {
      this.tpProgress += dt / TP_DURATION
      this.tpProgress = Math.min(this.tpProgress, 1)
      
      const t = easeInOutQuad(this.tpProgress)
      this.position.x = lerp(t, this.startPos.x, this.endPos.x)
      this.position.z = lerp(t, this.startPos.z, this.endPos.z)
    }
    
    // Apply rotation filtering for smooth camera movement
    this.filteredRotation.x = ROTATION_FILTER * this.rotation.x + 
                             (1 - ROTATION_FILTER) * this.filteredRotation.x
    this.filteredRotation.y = ROTATION_FILTER * this.rotation.y + 
                             (1 - ROTATION_FILTER) * this.filteredRotation.y
    
    // Update camera
    this.updateCamera()
    
    if (this.onMove) {
      this.onMove(this.position)
    }
  }
  
  dispose() {
    // Remove event listeners
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
    
    const domElement = this.camera.userData.domElement as HTMLElement
    if (domElement) {
      domElement.removeEventListener('touchstart', this.handleTouch)
      domElement.removeEventListener('touchmove', this.handleTouch)
      domElement.removeEventListener('touchend', this.handleTouch)
    }
  }
} 