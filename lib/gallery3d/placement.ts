// Artwork placement manager for Gallery3D
// Adapted from https://github.com/ClementCariou/virtual-art-gallery

import * as THREE from 'three'
import { MapData } from './map'

// Configuration
const RENDER_DIST = 20       // Distance to render artworks
const LOAD_DIST = 20         // Distance to preload textures
const UNLOAD_DIST = 40       // Distance to unload textures
const FOVX_MARGIN = Math.PI/32 // Margin for FOV culling

// Interface for gallery items
export interface GalleryItem {
  id: string
  title: string
  description?: string
  imagePath: string
  texture?: THREE.Texture
  loading?: boolean
  aspect?: number
  width?: number
  height?: number
}

// Interface for placed artworks
export interface PlacedArtwork {
  item: GalleryItem
  mesh: THREE.Group
  angle: number
  model: THREE.Matrix4
  vseg: number[][]
  width: number
  height: number
}

// Culling function to determine if an artwork is visible
function isInView(
  playerPos: THREE.Vector3, 
  playerAngle: number, 
  fovx: number,
  artwork: PlacedArtwork
): boolean {
  const { vseg, angle } = artwork
  
  // Calculate vectors from player to artwork segment endpoints
  const sx1 = vseg[0][0] - playerPos.x
  const sy1 = vseg[0][1] - playerPos.z
  const sx2 = vseg[1][0] - playerPos.x
  const sy2 = vseg[1][1] - playerPos.z
  
  // Angles to check: artwork normal and player view frustum edges
  const angles = [
    angle, 
    playerAngle - fovx/2 - FOVX_MARGIN + Math.PI/2, 
    playerAngle + fovx/2 + FOVX_MARGIN - Math.PI/2
  ]
  
  // Check if artwork is behind all of these planes
  for (let a of angles) {
    const nx = Math.sin(a)
    const ny = -Math.cos(a)
    
    // If both endpoints are behind this plane, it's not visible
    if (nx * sx1 + ny * sy1 < 0 && nx * sx2 + ny * sy2 < 0)
      return false
  }
  
  return true
}

// Texture loading handler
export class TextureLoader {
  private cache: Map<string, THREE.Texture> = new Map()
  private loader = new THREE.TextureLoader()
  
  async load(imagePath: string): Promise<THREE.Texture> {
    // Return from cache if available
    if (this.cache.has(imagePath)) {
      return this.cache.get(imagePath)!
    }
    
    // Load new texture
    return new Promise((resolve) => {
      this.loader.load(
        imagePath,
        (texture) => {
          texture.anisotropy = 16 // Improve texture quality at angles
          this.cache.set(imagePath, texture)
          resolve(texture)
        },
        undefined, // onProgress not used
        (error) => {
          console.warn(`Failed to load artwork texture from ${imagePath}:`, error)
          
          // Create fallback texture with title
          const title = imagePath.split('/').pop()?.split('.')[0] || 'Artwork'
          const canvas = document.createElement('canvas')
          canvas.width = 512
          canvas.height = 512
          
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // Background
            ctx.fillStyle = '#f8f4e3'
            ctx.fillRect(0, 0, 512, 512)
            
            // Border
            ctx.strokeStyle = '#8d7b64'
            ctx.lineWidth = 20
            ctx.strokeRect(10, 10, 492, 492)
            
            // Diagonal lines to indicate missing image
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(512, 512)
            ctx.moveTo(512, 0)
            ctx.lineTo(0, 512)
            ctx.strokeStyle = '#cc9966'
            ctx.lineWidth = 5
            ctx.stroke()
            
            // Text label for the image
            ctx.fillStyle = '#5c4033'
            ctx.font = 'bold 32px Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            
            // Format the title
            let formattedTitle = title.charAt(0).toUpperCase() + title.slice(1)
            formattedTitle = formattedTitle.replace(/-/g, ' ')
            
            // Add text
            ctx.fillText('Image Not Found', 256, 220)
            ctx.fillText(formattedTitle, 256, 280)
          }
          
          const texture = new THREE.CanvasTexture(canvas)
          texture.anisotropy = 16
          this.cache.set(imagePath, texture)
          resolve(texture)
        }
      )
    })
  }
  
  unload(imagePath: string): void {
    if (this.cache.has(imagePath)) {
      const texture = this.cache.get(imagePath)
      texture?.dispose()
      this.cache.delete(imagePath)
    }
  }
}

export default class PlacementManager {
  private mapData: MapData
  private textureLoader: TextureLoader
  private placements: Array<PlacedArtwork> = []
  private artworks: GalleryItem[] = []
  private scene: THREE.Scene
  private camera: THREE.Camera | null = null
  private artworkClickHandler: ((item: GalleryItem) => void) | null = null
  
  constructor(
    scene: THREE.Scene,
    mapData: MapData, 
    artworks: GalleryItem[]
  ) {
    this.scene = scene
    this.mapData = mapData
    this.artworks = artworks
    this.textureLoader = new TextureLoader()
  }
  
  // Set the camera for raycasting
  setCamera(camera: THREE.Camera): void {
    this.camera = camera
  }
  
  // Set artwork click handler
  setArtworkClickHandler(handler: (item: GalleryItem) => void): void {
    this.artworkClickHandler = handler
  }
  
  // Handle artwork click
  private handleArtworkClick(item: GalleryItem): void {
    if (this.artworkClickHandler) {
      this.artworkClickHandler(item)
    }
  }
  
  async initialize(): Promise<void> {
    // Find available wall segments from map data
    const availablePlacements = this.mapData.placements
    
    // Process each artwork and match to a placement
    for (let i = 0; i < Math.min(this.artworks.length, availablePlacements.length); i++) {
      await this.placeArtwork(this.artworks[i], availablePlacements[i])
    }
  }
  
  private async placeArtwork(item: GalleryItem, segment: number[][]): Promise<PlacedArtwork | null> {
    try {
      // Load texture to get aspect ratio
      const texture = await this.textureLoader.load(item.imagePath)
      
      // Save texture reference
      item.texture = texture
      
      // Get aspect ratio
      item.aspect = texture.image.width / texture.image.height
      
      // Calculate placement position and orientation
      const dir = [
        segment[1][0] - segment[0][0], 
        segment[1][1] - segment[0][1]
      ]
      
      const norm = [
        segment[1][1] - segment[0][1], 
        segment[0][0] - segment[1][0]
      ]
      
      const segLen = Math.hypot(dir[0], dir[1])
      
      // Calculate optimal artwork size to fit the wall segment
      const globalScale = Math.min(
        4.5 / (3 + item.aspect), // Base scale (tweaked to look good)
        segLen / item.aspect / 2.2, // Clamp horizontal
        2 / 1.2 // Clamp vertical
      )
      
      // Calculate dimensions
      const width = globalScale * item.aspect
      const height = globalScale
      item.width = width
      item.height = height
      
      // Calculate position
      const pos = new THREE.Vector3(
        (segment[0][0] + segment[1][0]) / 2, 
        2.1 - globalScale, 
        (segment[0][1] + segment[1][1]) / 2
      )
      
      // Calculate angle
      const angle = Math.atan2(dir[1], dir[0])
      
      // Determine frame orientation (horizontal or vertical)
      const horiz = Math.abs(angle % 3) < 1 ? 1 : 0
      const vert = 1 - horiz
      
      // Calculate frame scale
      const scale = new THREE.Vector3(
        2 * width * horiz + 0.1 * vert,
        2 * globalScale,
        2 * width * vert + 0.1 * horiz
      )
      
      // Calculate offsets
      const d1 = width / segLen
      const d2 = 0.005 / Math.hypot(norm[0], norm[1])
      
      // Visible segment for culling
      const vseg = [
        [pos.x - dir[0] * d1 * 2, pos.z - dir[1] * d1],
        [pos.x + dir[0] * d1 * 2, pos.z + dir[1] * d1]
      ]
      
      // Offset position to account for painting width and depth
      pos.x -= dir[0] * d1 + norm[0] * d2
      pos.z -= dir[1] * d1 + norm[1] * d2
      
      // Create transformation matrix
      const model = new THREE.Matrix4()
      model.makeTranslation(pos.x, pos.y, pos.z)
      model.scale(scale)
      model.multiply(new THREE.Matrix4().makeRotationY(-angle))
      
      // Create frame mesh (a simple placeholder until we create a proper mesh)
      const frameGeometry = new THREE.BoxGeometry(1, 1, 0.1)
      const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5c4033, 
        roughness: 0.5, 
        metalness: 0.2 
      })
      const frame = new THREE.Mesh(frameGeometry, frameMaterial)
      
      // Create artwork mesh
      const artGeometry = new THREE.PlaneGeometry(0.9, 0.9)
      const artMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        side: THREE.FrontSide 
      })
      const art = new THREE.Mesh(artGeometry, artMaterial)
      art.position.z = 0.051
      
      // Set user data for raycasting
      art.userData = { itemId: item.id, isArtwork: true }
      
      // Group frame and art
      const group = new THREE.Group()
      group.add(frame)
      group.add(art)
      
      // Set up interaction by making the art selectable
      const artworkGroup = new THREE.Group()
      artworkGroup.add(group)
      artworkGroup.userData = { itemId: item.id, isArtwork: true }
      
      // Apply transformation
      artworkGroup.applyMatrix4(model)
      
      // Add to scene
      this.scene.add(artworkGroup)
      
      // Add click handler
      this.setupClickHandler(artworkGroup, item)
      
      // Create placement information
      const placement: PlacedArtwork = {
        item,
        mesh: artworkGroup,
        model,
        angle,
        vseg,
        width,
        height
      }
      
      // Store placement information
      this.placements.push(placement)
      
      return placement
    } catch (error) {
      console.error(`Failed to place artwork ${item.id || item.title}:`, error)
      return null
    }
  }
  
  // Set up click handler for artwork
  private setupClickHandler(mesh: THREE.Group, item: GalleryItem): void {
    // We will set up the raycasting in the update method
    // to access the current camera
    mesh.userData.isArtwork = true
    mesh.userData.item = item
  }
  
  // Update visible artworks based on player position
  update(playerPos: THREE.Vector3, playerAngle: number, fovx: number): void {
    if (!this.placements.length || !this.camera) return
    
    // Estimate player position in relation to artworks
    const areaIndex = this.mapData.getAreaIndex(playerPos.x, playerPos.z)
    if (areaIndex === -1) return // Out of bounds
    
    // Unload distant textures to save memory
    this.placements.slice(0, Math.max(0, areaIndex - UNLOAD_DIST))
      .concat(this.placements.slice(areaIndex + UNLOAD_DIST))
      .forEach(p => {
        p.mesh.visible = false
        // Potential texture unloading could be implemented here
      })
    
    // Get nearby placements
    const nearbyPlacements = this.placements.slice(
      Math.max(0, areaIndex - RENDER_DIST), 
      areaIndex + RENDER_DIST
    )
    
    // Show artworks in view
    nearbyPlacements.forEach(placement => {
      // Check if in view using culling function
      const visible = isInView(playerPos, playerAngle, fovx, placement)
      placement.mesh.visible = visible
    })
    
    // Setup raycasting for artwork clicks
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    
    // Update the click handler
    document.onclick = (event) => {
      // Get normalized mouse position
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      
      // Update raycaster
      raycaster.setFromCamera(mouse, this.camera!)
      
      // Check all artwork meshes
      const intersects = raycaster.intersectObjects(
        this.placements.map(p => p.mesh),
        true
      )
      
      // Process click if we hit something
      if (intersects.length > 0) {
        // Find the mesh or its ancestor with item data
        let target: THREE.Object3D | null = intersects[0].object
        while (target && !target.userData.isArtwork) {
          target = target.parent
        }
        
        // If we found the artwork, call the handler
        if (target && target.userData.isArtwork) {
          const placement = this.placements.find(p => p.mesh === target || p.mesh.children.includes(target))
          if (placement && this.artworkClickHandler) {
            this.artworkClickHandler(placement.item)
          }
        }
      }
    }
  }
  
  // Get count of artworks
  getCount(): number {
    return this.placements.length
  }
  
  // Clean up resources
  dispose(): void {
    this.placements.forEach(p => {
      // Remove from scene
      this.scene.remove(p.mesh)
      
      // Dispose geometries and materials
      p.mesh.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
    })
    
    // Clear placements
    this.placements = []
  }
} 