"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

interface GalleryItem {
  key: string
  title: string
  description: string
  context: string
  imagePath: string
}

interface Gallery3DProps {
  dict: any
  lang: string
}

export default function Gallery3D({ dict, lang }: Gallery3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const playerPositionRef = useRef<{x: number, z: number}>({ x: 0, z: 0 })
  const [showControls, setShowControls] = useState(true)
  const [viewMode, setViewMode] = useState<'orbit' | 'firstPerson'>('firstPerson') // Default to first-person
  const [playerHeight, setPlayerHeight] = useState(1.7) // Standard human eye level
  const [isRunning, setIsRunning] = useState(false) // For sprint functionality
  const [bobPosition, setBobPosition] = useState(0) // For head bobbing effect
  
  // Create camera reference to allow updates between view modes
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | PointerLockControls | null>(null)
  const modelsRef = useRef<THREE.Group[]>([]) // Store loaded models
  
  // Create refs for raycaster and mouse
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const infoPanelRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return
    isInitializedRef.current = true
    
    // Create gallery items from the dictionary data
    const gallery: GalleryItem[] = [
      // Front Wall
      {
        key: "tborida",
        title: dict.gallery.titles.tborida,
        description: dict.gallery.artDescriptions.tborida,
        context: dict.gallery.culturalContexts.tborida,
        imagePath: "/images/othmanotana_moroccan_tborida_show_a_festival_of_moroccans_rid_2e6b6e26-9a49-4959-a52e-81be4d1012ea_3.png"
      },
      {
        key: "dress",
        title: dict.gallery.titles.dress,
        description: dict.gallery.artDescriptions.dress,
        context: dict.gallery.culturalContexts.dress,
        imagePath: "/images/othmanotana_mother_in_traditional_Moroccan_red_dress_dusted__du_f2e2555c-8669-4c47-a650-b8f98478ccd0.png"
      },
      {
        key: "tiles",
        title: dict.gallery.titles.tiles,
        description: dict.gallery.artDescriptions.tiles,
        context: dict.gallery.culturalContexts.tiles,
        imagePath: "/images/othmanotana_Traditional_geometric_Moroccan_tile_patterns_in_v_3c96ff30-f618-4b48-a09e-3f9fdd57672d_0.png"
      },
      {
        key: "astrology",
        title: dict.gallery.titles.astrology,
        description: dict.gallery.artDescriptions.astrology,
        context: dict.gallery.culturalContexts.astrology,
        imagePath: "/images/othmanotana_astrology_pattern_beautiful_midevil_arabian_tile__4828e34d-87a2-407d-991b-87a35a7e8e62_2.png"
      },
      // Right Wall
      {
        key: "bicycle",
        title: dict.gallery.titles.bicycle,
        description: dict.gallery.artDescriptions.bicycle,
        context: dict.gallery.culturalContexts.bicycle,
        imagePath: "/images/othmanotana_Photo_of_two_Moroccan_boys_playing_with_one_bicycle_17741675-8699-4286-b810-1b6145f6d6c5.png"
      },
      {
        key: "fakhar",
        title: dict.gallery.titles.fakhar,
        description: dict.gallery.artDescriptions.fakhar,
        context: dict.gallery.culturalContexts.fakhar,
        imagePath: "/images/othmanotana_A_traditional_Moroccan_fakhar_craftsman_working_on__73564925-59a7-458a-91e3-8a72619ea8dc.png"
      },
      {
        key: "loom",
        title: dict.gallery.titles.loom,
        description: dict.gallery.artDescriptions.loom,
        context: dict.gallery.culturalContexts.loom,
        imagePath: "/images/othmanotana_A_traditional_Moroccan_loom_stands_in_the_center_of_2b10046b-3040-4556-bbb4-3d3e98eb2a95.png"
      },
      {
        key: "child",
        title: dict.gallery.titles.child,
        description: dict.gallery.artDescriptions.child,
        context: dict.gallery.culturalContexts.child,
        imagePath: "/images/othmanotana_A_middle-aged_child_holding_a_ball_in_his_hand_next_1f2d3b85-7f41-4334-9e3d-9295339acb47.png"
      },
      // Back Wall
      {
        key: "cat",
        title: dict.gallery.titles.cat,
        description: dict.gallery.artDescriptions.cat,
        context: dict.gallery.culturalContexts.cat,
        imagePath: "/images/othmanotana_A_cat_sitting_on_the_steps_of_an_ancient_blue_city.png"
      },
      {
        key: "woodworker",
        title: dict.gallery.titles.woodworker,
        description: dict.gallery.artDescriptions.woodworker,
        context: dict.gallery.culturalContexts.woodworker,
        imagePath: "/images/Wood Worker.jpg"
      },
      {
        key: "jemaa",
        title: dict.gallery.titles.jemaa,
        description: dict.gallery.artDescriptions.jemaa,
        context: dict.gallery.culturalContexts.jemaa,
        imagePath: "/images/A man I jamaa lafnaa.jpg"
      },
      {
        key: "tannery",
        title: dict.gallery.titles.tannery,
        description: dict.gallery.artDescriptions.tannery,
        context: dict.gallery.culturalContexts.tannery,
        imagePath: "/images/Fes dar dbagha a man work there.png"
      },
      // Left Wall
      {
        key: "regions",
        title: dict.gallery.titles.regions,
        description: dict.gallery.artDescriptions.regions,
        context: dict.gallery.culturalContexts.regions,
        imagePath: "/images/South_Morocco_meets_the_North_Morocco.png"
      },
      {
        key: "architecture",
        title: dict.gallery.titles.architecture,
        description: dict.gallery.artDescriptions.architecture,
        context: dict.gallery.culturalContexts.architecture,
        imagePath: "/images/Moroccan_Architecture.jpeg"
      },
      {
        key: "fighter",
        title: dict.gallery.titles.fighter,
        description: dict.gallery.artDescriptions.fighter,
        context: dict.gallery.culturalContexts.fighter,
        imagePath: "/images/Moroccan Woman Fighter.jpeg"
      },
      {
        key: "amazigh",
        title: dict.gallery.titles.amazigh,
        description: dict.gallery.artDescriptions.amazigh,
        context: dict.gallery.culturalContexts.amazigh,
        imagePath: "/images/AnAMAZIGHWOMEN.jpeg"
      }
    ]

    // Initialize Three.js Scene
    const scene = new THREE.Scene()
    
    // Create a warmer, more atmospheric background with gradient
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    
    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `
    
    const uniforms = {
      topColor: { value: new THREE.Color(0xd9b776) },    // Warm sand/gold color
      bottomColor: { value: new THREE.Color(0x873e23) }, // Earthy terracotta
      offset: { value: 10 },
      exponent: { value: 0.6 }
    }
    
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    })
    
    const sky = new THREE.Mesh(new THREE.SphereGeometry(50), skyMaterial)
    scene.add(sky)
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )
    camera.position.set(0, 1.6, 0) // Position at human eye level
    cameraRef.current = camera
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xd9c7a0, 0.5) // Warm ambient light
    scene.add(ambientLight)
    
    // Add spot lights for each wall with Moroccan colors
    const createSpotlight = (x: number, y: number, z: number, color = 0xffffff, intensity = 1) => {
      const spotlight = new THREE.SpotLight(color, intensity)
      spotlight.position.set(x, y, z)
      spotlight.castShadow = true
      spotlight.angle = Math.PI / 4
      spotlight.penumbra = 0.2
      spotlight.decay = 1.5
      spotlight.distance = 20
      spotlight.shadow.mapSize.width = 1024
      spotlight.shadow.mapSize.height = 1024
      spotlight.shadow.bias = -0.0001
      scene.add(spotlight)
      
      // Add subtle light flicker effect for ambiance
      const originalIntensity = intensity
      setInterval(() => {
        spotlight.intensity = originalIntensity * (0.95 + Math.random() * 0.1)
      }, 500)
      
      return spotlight
    }
    
    // Warm copper/orange tones typical in Moroccan lighting
    createSpotlight(0, 6, -8, 0xe8c17a, 1.5) // Front wall - warm gold
    createSpotlight(8, 6, 0, 0xd35400, 1.2)  // Right wall - terracotta
    createSpotlight(0, 6, 8, 0xa65c35, 1.3)  // Back wall - amber
    createSpotlight(-8, 6, 0, 0xbf643a, 1.2) // Left wall - clay
    
    // Add ceiling lights with Moroccan-style lantern effects
    const createLantern = (x: number, y: number, z: number, size = 0.4) => {
      // Create lantern housing
      const lanternGeometry = new THREE.CylinderGeometry(size, size * 0.7, size * 2, 8, 1, true)
      const lanternMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0974e,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x553311,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
      })
      
      const lanternMesh = new THREE.Mesh(lanternGeometry, lanternMaterial)
      lanternMesh.position.set(x, y, z)
      lanternMesh.castShadow = true
      scene.add(lanternMesh)
      
      // Add lantern light
      const lanternLight = new THREE.PointLight(0xffca80, 1.5, 8)
      lanternLight.position.set(x, y - 0.2, z)
      scene.add(lanternLight)
      
      // Add flickering effect to lantern light
      setInterval(() => {
        lanternLight.intensity = 1.5 * (0.85 + Math.random() * 0.3)
      }, 150)
      
      return { mesh: lanternMesh, light: lanternLight }
    }
    
    // Place lanterns around the gallery
    createLantern(0, 5, 0) // Center
    createLantern(-5, 5, -5) // Corner
    createLantern(5, 5, -5) // Corner
    createLantern(5, 5, 5) // Corner
    createLantern(-5, 5, 5) // Corner
    
    // Add directional light for shadow modeling
    const dirLight = new THREE.DirectionalLight(0xfff1e0, 0.5)
    dirLight.position.set(5, 10, 2)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.camera.near = 0.5
    dirLight.shadow.camera.far = 50
    dirLight.shadow.camera.left = -15
    dirLight.shadow.camera.right = 15
    dirLight.shadow.camera.top = 15
    dirLight.shadow.camera.bottom = -15
    scene.add(dirLight)
    
    // Create gallery walls with Moroccan elements
    const createWalls = () => {
      const textureLoader = new THREE.TextureLoader()
      
      // Load Moroccan textures
      const loadTexture = (path: string) => {
        return textureLoader.load(path, (texture) => {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.repeat.set(4, 4)
        })
      }
      
      // Try loading textures with fallbacks to colors if images don't exist
      let zelligeTexture, tadelaktTexture, carpetTexture
      
      try {
        zelligeTexture = loadTexture('/textures/moroccan-zellige.jpg')
        tadelaktTexture = loadTexture('/textures/moroccan-tadelakt.jpg')
        carpetTexture = loadTexture('/textures/moroccan-carpet.jpg')
      } catch (e) {
        console.log('Texture loading failed, using color fallbacks')
      }
      
      // Create materials with either textures or colors
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfaf0e6, // Warm off-white typical of Moroccan walls
        roughness: 0.9,
        metalness: 0.1,
        map: tadelaktTexture || null
      })
      
      // Material for decorative elements
      const decorMaterial = new THREE.MeshStandardMaterial({
        color: 0x1560aa, // Moroccan blue
        roughness: 0.5,
        metalness: 0.3,
        map: zelligeTexture || null
      })
      
      // Dimensions
      const roomSize = 20
      const wallHeight = 6
      const wallThickness = 0.2
      
      // Floor with Moroccan carpet pattern
      const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize)
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd9a566, // Warm sandstone color
        roughness: 0.8,
        metalness: 0.1,
        map: carpetTexture || null
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = -0.5
      floor.receiveShadow = true
      scene.add(floor)
      
      // Ceiling with Moroccan pattern
      const ceilingGeometry = new THREE.PlaneGeometry(roomSize, roomSize)
      const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe0d1b1, // Warm off-white
        roughness: 0.8,
        metalness: 0.2
      })
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
      ceiling.rotation.x = Math.PI / 2
      ceiling.position.y = wallHeight
      ceiling.receiveShadow = true
      scene.add(ceiling)
      
      // Add decorative ceiling details
      const addCeilingPattern = () => {
        const patternGeometry = new THREE.PlaneGeometry(roomSize - 2, roomSize - 2)
        const patternMaterial = new THREE.MeshStandardMaterial({
          color: 0xd4af37, // Gold color
          roughness: 0.4,
          metalness: 0.6,
          emissive: 0x554411,
          emissiveIntensity: 0.1
        })
        
        const pattern = new THREE.Mesh(patternGeometry, patternMaterial)
        pattern.rotation.x = Math.PI / 2
        pattern.position.set(0, wallHeight - 0.01, 0)
        scene.add(pattern)
      }
      
      addCeilingPattern()
      
      // Walls with horseshoe arches (typical Moroccan architecture)
      const createArchedWall = (width: number, height: number, depth: number, position: THREE.Vector3, rotation: THREE.Euler) => {
        // Main wall
        const mainWallGeometry = new THREE.BoxGeometry(width, height, depth)
        const mainWall = new THREE.Mesh(mainWallGeometry, wallMaterial)
        mainWall.position.copy(position)
        mainWall.rotation.copy(rotation)
        mainWall.receiveShadow = true
        mainWall.castShadow = true
        scene.add(mainWall)
        
        // Add decorative border along the top
        const borderGeometry = new THREE.BoxGeometry(width, 0.4, depth * 1.5)
        const border = new THREE.Mesh(borderGeometry, decorMaterial)
        border.position.set(position.x, position.y + height / 2 - 0.2, position.z)
        
        if (rotation.y !== 0) {
          border.rotation.copy(rotation)
          border.position.z = position.z
        }
        
        border.receiveShadow = true
        border.castShadow = true
        scene.add(border)
        
        // Create arches in the wall
        const numberOfArches = Math.floor(width / 3)
        const archWidth = 1.8
        const archHeight = 3
        const startX = -(width / 2) + (width - (numberOfArches * archWidth)) / 2 + archWidth / 2
        
        for (let i = 0; i < numberOfArches; i++) {
          // Create horseshoe arch shape
          const createArchShape = () => {
            const archPoints: THREE.Vector2[] = []
            
            // Arch base
            archPoints.push(new THREE.Vector2(-archWidth / 2, 0))
            archPoints.push(new THREE.Vector2(archWidth / 2, 0))
            
            // Arch curve (horseshoe shape)
            const segments = 10
            for (let j = 0; j <= segments; j++) {
              const angle = (Math.PI - (Math.PI * 0.2)) * (j / segments) + Math.PI * 0.1
              const x = Math.cos(angle) * (archWidth / 2) * 1.1 // Slight horseshoe outward curve
              const y = Math.sin(angle) * archHeight * 0.8 + archHeight * 0.2
              archPoints.push(new THREE.Vector2(x, y))
            }
            
            return new THREE.Shape(archPoints)
          }
          
          const archShape = createArchShape()
          const archGeometry = new THREE.ShapeGeometry(archShape)
          const arch = new THREE.Mesh(archGeometry, decorMaterial)
          
          // Position the arch within the wall
          const xPos = startX + i * archWidth
          
          if (rotation.y === 0) {
            // Front/back wall arches
            arch.position.set(position.x + xPos, position.y - height / 2 + archHeight / 2, position.z + (depth / 2) * 1.01)
            if (position.z > 0) {
              arch.rotation.y = Math.PI // Flip for back wall
            }
          } else {
            // Side wall arches
            arch.rotation.y = Math.PI / 2
            arch.position.set(
              position.x + (depth / 2) * 1.01 * (position.x < 0 ? -1 : 1), 
              position.y - height / 2 + archHeight / 2, 
              position.z + xPos
            )
            if (position.x < 0) {
              arch.rotation.y = -Math.PI / 2
            }
          }
          
          arch.castShadow = true
          scene.add(arch)
        }
        
        return mainWall
      }
      
      // Front wall with Moroccan arches
      createArchedWall(
        roomSize, wallHeight, wallThickness, 
        new THREE.Vector3(0, wallHeight / 2, -roomSize / 2),
        new THREE.Euler(0, 0, 0)
      )
      
      // Back wall with Moroccan arches
      createArchedWall(
        roomSize, wallHeight, wallThickness, 
        new THREE.Vector3(0, wallHeight / 2, roomSize / 2),
        new THREE.Euler(0, 0, 0)
      )
      
      // Left wall with Moroccan arches
      createArchedWall(
        roomSize, wallHeight, wallThickness, 
        new THREE.Vector3(-roomSize / 2, wallHeight / 2, 0),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
      
      // Right wall with Moroccan arches
      createArchedWall(
        roomSize, wallHeight, wallThickness, 
        new THREE.Vector3(roomSize / 2, wallHeight / 2, 0),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
      
      // Add decorative pillars at corners
      const addPillar = (x: number, z: number) => {
        const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.4, wallHeight, 8)
        const pillar = new THREE.Mesh(pillarGeometry, decorMaterial)
        pillar.position.set(x, wallHeight / 2, z)
        pillar.castShadow = true
        scene.add(pillar)
        
        // Add decorative capital
        const capitalGeometry = new THREE.CylinderGeometry(0.6, 0.4, 0.3, 8)
        const capital = new THREE.Mesh(capitalGeometry, new THREE.MeshStandardMaterial({
          color: 0xd4af37, // Gold
          metalness: 0.7,
          roughness: 0.3
        }))
        capital.position.set(x, wallHeight - 0.15, z)
        capital.castShadow = true
        scene.add(capital)
        
        // Add decorative base
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 8)
        const base = new THREE.Mesh(baseGeometry, new THREE.MeshStandardMaterial({
          color: 0xd4af37, // Gold
          metalness: 0.7,
          roughness: 0.3
        }))
        base.position.set(x, 0.15, z)
        base.castShadow = true
        scene.add(base)
      }
      
      // Add pillars at corners
      const cornerDistance = roomSize / 2 - 0.5
      addPillar(cornerDistance, cornerDistance)
      addPillar(-cornerDistance, cornerDistance)
      addPillar(cornerDistance, -cornerDistance)
      addPillar(-cornerDistance, -cornerDistance)
    }
    
    createWalls()
    
    // Create teleportation points for easy navigation
    const createTeleportPoints = () => {
      const geometry = new THREE.CircleGeometry(0.5, 32)
      
      // Create materials with different colors for each point
      const frontMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4285F4,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      })
      
      const rightMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xEA4335, 
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      })
      
      const backMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFBBC05, 
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      })
      
      const leftMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x34A853, 
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      })
      
      // Create teleport meshes and position them on floor
      const frontPoint = new THREE.Mesh(geometry, frontMaterial)
      frontPoint.position.set(0, -0.49, -8)
      frontPoint.rotation.x = -Math.PI / 2
      frontPoint.userData = { teleportPosition: new THREE.Vector3(0, 1.6, -6) }
      scene.add(frontPoint)
      
      const rightPoint = new THREE.Mesh(geometry, rightMaterial)
      rightPoint.position.set(8, -0.49, 0)
      rightPoint.rotation.x = -Math.PI / 2
      rightPoint.userData = { teleportPosition: new THREE.Vector3(6, 1.6, 0) }
      scene.add(rightPoint)
      
      const backPoint = new THREE.Mesh(geometry, backMaterial)
      backPoint.position.set(0, -0.49, 8)
      backPoint.rotation.x = -Math.PI / 2
      backPoint.userData = { teleportPosition: new THREE.Vector3(0, 1.6, 6) }
      scene.add(backPoint)
      
      const leftPoint = new THREE.Mesh(geometry, leftMaterial)
      leftPoint.position.set(-8, -0.49, 0)
      leftPoint.rotation.x = -Math.PI / 2
      leftPoint.userData = { teleportPosition: new THREE.Vector3(-6, 1.6, 0) }
      scene.add(leftPoint)
      
      // Center point
      const centerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF, 
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      })
      const centerPoint = new THREE.Mesh(geometry, centerMaterial)
      centerPoint.position.set(0, -0.49, 0)
      centerPoint.rotation.x = -Math.PI / 2
      centerPoint.userData = { teleportPosition: new THREE.Vector3(0, 1.6, 0) }
      scene.add(centerPoint)
      
      // Add labels above teleport points
      const addLabel = (text: string, position: THREE.Vector3) => {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#000000'
        ctx.font = '36px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
        })
        
        const labelGeometry = new THREE.PlaneGeometry(2, 1)
        const label = new THREE.Mesh(labelGeometry, material)
        label.position.copy(position)
        label.position.y += 0.5
        label.rotation.x = -Math.PI / 4
        scene.add(label)
      }
      
      // Add labels for each teleport point
      addLabel(dict.gallery3d.frontWall || 'Front Wall', new THREE.Vector3(0, 0, -8))
      addLabel(dict.gallery3d.rightWall || 'Right Wall', new THREE.Vector3(8, 0, 0))
      addLabel(dict.gallery3d.backWall || 'Back Wall', new THREE.Vector3(0, 0, 8))
      addLabel(dict.gallery3d.leftWall || 'Left Wall', new THREE.Vector3(-8, 0, 0))
      addLabel(dict.gallery3d.center || 'Center', new THREE.Vector3(0, 0, 0))
      
      return [frontPoint, rightPoint, backPoint, leftPoint, centerPoint]
    }
    
    const teleportPoints = createTeleportPoints()
    
    // Add decorative Moroccan objects throughout the gallery
    const addDecorativeObjects = () => {
      // Try to load 3D models if available
      const gltfLoader = new GLTFLoader()
      const fbxLoader = new FBXLoader()
      
      // Create a Moroccan carpet
      const createCarpet = (x: number, z: number, width: number, length: number, rotation = 0) => {
        const textureLoader = new THREE.TextureLoader()
        let carpetTexture
        
        try {
          carpetTexture = textureLoader.load('/textures/moroccan-carpet-pattern.jpg')
          carpetTexture.wrapS = THREE.RepeatWrapping
          carpetTexture.wrapT = THREE.RepeatWrapping
          carpetTexture.repeat.set(1, 1)
        } catch (e) {
          console.log('Carpet texture loading failed')
        }
        
        const carpetGeometry = new THREE.PlaneGeometry(width, length)
        const carpetMaterial = new THREE.MeshStandardMaterial({
          map: carpetTexture || null,
          color: carpetTexture ? 0xffffff : 0xc19a6b,
          roughness: 0.8,
          metalness: 0.1,
          side: THREE.DoubleSide
        })
        
        const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial)
        carpet.rotation.x = -Math.PI / 2
        carpet.rotation.z = rotation
        carpet.position.set(x, -0.48, z)
        carpet.receiveShadow = true
        scene.add(carpet)
        
        return carpet
      }
      
      // Add carpets throughout the gallery
      createCarpet(0, -5, 3, 8, Math.PI / 4)
      createCarpet(0, 5, 3, 8, Math.PI / 4)
      createCarpet(-5, 0, 3, 8, -Math.PI / 4)
      createCarpet(5, 0, 3, 8, -Math.PI / 4)
      
      // Create a Moroccan pouf (floor cushion)
      const createPouf = (x: number, z: number, color = 0xc07853) => {
        const poufGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.5, 16)
        const poufMaterial = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.9,
          metalness: 0.1
        })
        
        const pouf = new THREE.Mesh(poufGeometry, poufMaterial)
        pouf.position.set(x, 0.25, z)
        pouf.castShadow = true
        pouf.receiveShadow = true
        scene.add(pouf)
        
        // Add decorative pattern on top
        const topGeometry = new THREE.CircleGeometry(0.55, 32)
        const topMaterial = new THREE.MeshStandardMaterial({
          color: 0xece0b8,
          roughness: 0.8,
          metalness: 0.1
        })
        
        const top = new THREE.Mesh(topGeometry, topMaterial)
        top.rotation.x = -Math.PI / 2
        top.position.set(x, 0.51, z)
        top.receiveShadow = true
        scene.add(top)
        
        // Create decorative pattern
        const patternGeometry = new THREE.RingGeometry(0.3, 0.5, 16)
        const patternMaterial = new THREE.MeshStandardMaterial({
          color: 0x87431d,
          roughness: 0.8,
          metalness: 0.1
        })
        
        const pattern = new THREE.Mesh(patternGeometry, patternMaterial)
        pattern.rotation.x = -Math.PI / 2
        pattern.position.set(x, 0.52, z)
        pattern.receiveShadow = true
        scene.add(pattern)
        
        return { pouf, top, pattern }
      }
      
      // Create poufs around the gallery for seating
      createPouf(-7, -7, 0xc07853)  // Terracotta
      createPouf(-6, -7, 0x1560aa)  // Blue
      createPouf(-7, -6, 0x1560aa)  // Blue
      
      createPouf(7, 7, 0xc07853)    // Terracotta
      createPouf(6, 7, 0x1560aa)    // Blue
      createPouf(7, 6, 0x1560aa)    // Blue
      
      createPouf(-7, 7, 0xd9a566)   // Tan
      createPouf(-6, 7, 0xd9a566)   // Tan
      
      createPouf(7, -7, 0xd9a566)   // Tan
      createPouf(6, -7, 0xd9a566)   // Tan
      
      // Create a decorative lamp (Moroccan lantern)
      const createLantern = (x: number, y: number, z: number, scale = 1) => {
        try {
          // Try to load 3D model if available
          gltfLoader.load('/models/moroccan_lantern.glb', (gltf) => {
            const model = gltf.scene
            model.scale.set(scale, scale, scale)
            model.position.set(x, y, z)
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })
            scene.add(model)
            modelsRef.current.push(model)
            
            // Add light inside lantern
            const light = new THREE.PointLight(0xff9c4a, 1, 4)
            light.position.set(x, y + 0.5 * scale, z)
            scene.add(light)
            
            // Add flickering effect
            setInterval(() => {
              light.intensity = 1 * (0.85 + Math.random() * 0.3)
            }, 150)
          })
        } catch (e) {
          console.log('Lantern model loading failed, creating simple version')
          
          // Create simple lantern if model loading fails
          const baseGeometry = new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 0.2 * scale, 8)
          const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold
            roughness: 0.3,
            metalness: 0.8
          })
          const base = new THREE.Mesh(baseGeometry, baseMaterial)
          base.position.set(x, y - 0.3 * scale, z)
          base.castShadow = true
          scene.add(base)
          
          const bodyGeometry = new THREE.CylinderGeometry(0.25 * scale, 0.25 * scale, 0.6 * scale, 8, 1, true)
          const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0974e, // Bronze
            roughness: 0.3,
            metalness: 0.7,
            transparent: true,
            opacity: 0.8
          })
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
          body.position.set(x, y, z)
          body.castShadow = true
          scene.add(body)
          
          const topGeometry = new THREE.ConeGeometry(0.25 * scale, 0.3 * scale, 8)
          const top = new THREE.Mesh(topGeometry, baseMaterial)
          top.position.set(x, y + 0.35 * scale, z)
          top.castShadow = true
          scene.add(top)
          
          // Add light
          const light = new THREE.PointLight(0xff9c4a, 1, 4)
          light.position.set(x, y, z)
          scene.add(light)
          
          // Add flickering effect
          setInterval(() => {
            light.intensity = 1 * (0.85 + Math.random() * 0.3)
          }, 150)
        }
      }
      
      // Add floor lanterns
      createLantern(-6, 0.5, -4, 1.2)
      createLantern(6, 0.5, -4, 1.2)
      createLantern(-6, 0.5, 4, 1.2)
      createLantern(6, 0.5, 4, 1.2)
      
      // Create small wall niches with decorative objects
      const createWallNiche = (x: number, z: number, rotation: number) => {
        // Create niche recess
        const nicheGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.6)
        const nicheMaterial = new THREE.MeshStandardMaterial({
          color: 0xfaf0e6, // Warm white
          roughness: 0.9,
          metalness: 0.1
        })
        
        const niche = new THREE.Mesh(nicheGeometry, nicheMaterial)
        niche.position.set(
          x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.3 : 0.3) : 0),
          1.5,
          z + (rotation === 0 ? -0.3 : (rotation === Math.PI ? 0.3 : 0))
        )
        niche.rotation.y = rotation
        niche.receiveShadow = true
        scene.add(niche)
        
        // Add decorative arch
        const archShape = new THREE.Shape()
        archShape.moveTo(-0.75, -0.75)
        archShape.lineTo(0.75, -0.75)
        archShape.lineTo(0.75, 0.3)
        
        // Arch curve
        archShape.absarc(0, 0.3, 0.75, 0, Math.PI, false)
        
        archShape.lineTo(-0.75, 0.3)
        archShape.lineTo(-0.75, -0.75)
        
        const holeShape = new THREE.Shape()
        holeShape.moveTo(-0.65, -0.65)
        holeShape.lineTo(0.65, -0.65)
        holeShape.lineTo(0.65, 0.3)
        
        // Inner arch curve
        holeShape.absarc(0, 0.3, 0.65, 0, Math.PI, false)
        
        holeShape.lineTo(-0.65, 0.3)
        holeShape.lineTo(-0.65, -0.65)
        
        archShape.holes.push(holeShape)
        
        const archGeometry = new THREE.ShapeGeometry(archShape)
        const archMaterial = new THREE.MeshStandardMaterial({
          color: 0x1560aa, // Moroccan blue
          roughness: 0.7,
          metalness: 0.3
        })
        
        const arch = new THREE.Mesh(archGeometry, archMaterial)
        arch.position.set(
          x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.01 : 0.01) : 0),
          1.5,
          z + (rotation === 0 ? -0.01 : (rotation === Math.PI ? 0.01 : 0))
        )
        arch.rotation.y = rotation
        arch.rotation.z = Math.PI
        arch.castShadow = true
        scene.add(arch)
        
        // Add decorative object in the niche
        const objectType = Math.floor(Math.random() * 3)
        
        if (objectType === 0) {
          // Vase
          const vaseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.5, 12)
          const vaseMaterial = new THREE.MeshStandardMaterial({
            color: 0x1560aa, // Blue
            roughness: 0.7,
            metalness: 0.3
          })
          
          const vase = new THREE.Mesh(vaseGeometry, vaseMaterial)
          vase.position.set(
            x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.3 : 0.3) : 0),
            1.25,
            z + (rotation === 0 ? -0.3 : (rotation === Math.PI ? 0.3 : 0))
          )
          vase.castShadow = true
          scene.add(vase)
        } else if (objectType === 1) {
          // Decorative plate
          const plateGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24)
          const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold
            roughness: 0.3,
            metalness: 0.8
          })
          
          const plate = new THREE.Mesh(plateGeometry, plateMaterial)
          plate.rotation.x = Math.PI / 2
          plate.position.set(
            x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.3 : 0.3) : 0),
            1.5,
            z + (rotation === 0 ? -0.3 : (rotation === Math.PI ? 0.3 : 0))
          )
          plate.rotation.y = rotation
          plate.castShadow = true
          scene.add(plate)
          
          // Add decorative pattern
          const patternGeometry = new THREE.RingGeometry(0.1, 0.25, 16)
          const patternMaterial = new THREE.MeshStandardMaterial({
            color: 0xc07853, // Terracotta
            roughness: 0.7,
            metalness: 0.2
          })
          
          const pattern = new THREE.Mesh(patternGeometry, patternMaterial)
          pattern.rotation.x = Math.PI / 2
          pattern.position.set(
            x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.299 : 0.299) : 0),
            1.5,
            z + (rotation === 0 ? -0.299 : (rotation === Math.PI ? 0.299 : 0))
          )
          pattern.rotation.y = rotation
          scene.add(pattern)
        } else {
          // Small lamp
          const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold
            roughness: 0.3,
            metalness: 0.7
          })
          
          const baseGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 8)
          const base = new THREE.Mesh(baseGeometry, baseMaterial)
          base.position.set(
            x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.3 : 0.3) : 0),
            1.25,
            z + (rotation === 0 ? -0.3 : (rotation === Math.PI ? 0.3 : 0))
          )
          base.castShadow = true
          scene.add(base)
          
          const bodyGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.3, 8, 1, true)
          const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4dbb9, // Cream
            roughness: 0.8,
            metalness: 0.2
          })
          
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
          body.position.set(
            x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.3 : 0.3) : 0),
            1.45,
            z + (rotation === 0 ? -0.3 : (rotation === Math.PI ? 0.3 : 0))
          )
          body.castShadow = true
          scene.add(body)
          
          // Add light
          const light = new THREE.PointLight(0xff9c4a, 0.7, 2)
          light.position.set(
            x + (Math.abs(rotation) === Math.PI / 2 ? (rotation > 0 ? -0.3 : 0.3) : 0),
            1.45,
            z + (rotation === 0 ? -0.3 : (rotation === Math.PI ? 0.3 : 0))
          )
          scene.add(light)
        }
      }
      
      // Create wall niches
      createWallNiche(-4, -9.7, 0) // Front wall
      createWallNiche(4, -9.7, 0)  // Front wall
      createWallNiche(-4, 9.7, Math.PI) // Back wall
      createWallNiche(4, 9.7, Math.PI)  // Back wall
      createWallNiche(-9.7, -4, Math.PI / 2) // Left wall
      createWallNiche(-9.7, 4, Math.PI / 2)  // Left wall
      createWallNiche(9.7, -4, -Math.PI / 2) // Right wall
      createWallNiche(9.7, 4, -Math.PI / 2)  // Right wall
    }
    
    addDecorativeObjects()
    
    // Create and place artwork frames
    const createArtworks = () => {
      const textureLoader = new THREE.TextureLoader()
      const frameDepth = 0.05
      const frameBorderSize = 0.1
      
      const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5c4033,
        roughness: 0.5,
        metalness: 0.2 
      })
      
      // Highlighted frame material for hover effect
      const highlightFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0xA57C52,
        roughness: 0.3,
        metalness: 0.4,
        emissive: 0x553311,
        emissiveIntensity: 0.2
      })
      
      const artworks: THREE.Group[] = []
      
      // Helper function to create a single artwork frame
      const createArtworkFrame = (item: GalleryItem, width: number, height: number) => {
        const group = new THREE.Group()
        
        // Create frame
        const frameGeometry = new THREE.BoxGeometry(
          width + frameBorderSize * 2, 
          height + frameBorderSize * 2, 
          frameDepth
        )
        const frame = new THREE.Mesh(frameGeometry, frameMaterial)
        frame.castShadow = true
        group.add(frame)
        
        // Create artwork
        const artTexture = textureLoader.load(item.imagePath)
        const artMaterial = new THREE.MeshBasicMaterial({ map: artTexture })
        const artGeometry = new THREE.PlaneGeometry(width, height)
        const art = new THREE.Mesh(artGeometry, artMaterial)
        art.position.z = frameDepth / 2 + 0.01 // Slightly in front of frame
        
        // Store metadata with the artwork
        art.userData = {
          title: item.title,
          description: item.description,
          context: item.context,
          originalFrame: frame,
          isHighlighted: false
        }
        
        group.add(art)
        artworks.push(group)
        return group
      }
      
      // Distribute artworks along the walls
      const wallDistance = 9.9  // Distance from center to wall
      const spacing = 4       // Spacing between artworks
      
      // Front wall (4 artworks)
      for (let i = 0; i < 4; i++) {
        const item = gallery[i]
        const frame = createArtworkFrame(item, 3, 2)
        frame.position.set(-6 + i * spacing, 1.8, -wallDistance)
        scene.add(frame)
      }
      
      // Right wall (4 artworks)
      for (let i = 0; i < 4; i++) {
        const item = gallery[i + 4]
        const frame = createArtworkFrame(item, 3, 2)
        frame.position.set(wallDistance, 1.8, -6 + i * spacing)
        frame.rotation.y = -Math.PI / 2  // Rotate to face inside
        scene.add(frame)
      }
      
      // Back wall (4 artworks)
      for (let i = 0; i < 4; i++) {
        const item = gallery[i + 8]
        const frame = createArtworkFrame(item, 3, 2)
        frame.position.set(6 - i * spacing, 1.8, wallDistance)
        frame.rotation.y = Math.PI  // Rotate to face inside
        scene.add(frame)
      }
      
      // Left wall (4 artworks)
      for (let i = 0; i < 4; i++) {
        const item = gallery[i + 12]
        const frame = createArtworkFrame(item, 3, 2)
        frame.position.set(-wallDistance, 1.8, 6 - i * spacing)
        frame.rotation.y = Math.PI / 2  // Rotate to face inside
        scene.add(frame)
      }
      
      return artworks
    }
    
    const artworks = createArtworks()
    
    // Set up central podium with MOTTANA logo and Moroccan fountain
    const createCentralDisplay = () => {
      const textureLoader = new THREE.TextureLoader()
      
      // Create a Moroccan-style fountain base
      const fountainBaseGeometry = new THREE.CylinderGeometry(2.5, 3, 0.5, 8)
      const fountainBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x1560aa, // Moroccan blue
        roughness: 0.7,
        metalness: 0.3
      })
      const fountainBase = new THREE.Mesh(fountainBaseGeometry, fountainBaseMaterial)
      fountainBase.position.set(0, -0.25, 0)
      fountainBase.castShadow = true
      fountainBase.receiveShadow = true
      scene.add(fountainBase)
      
      // Create decorative tile work on the base
      const addTileDecoration = (radius: number, height: number, segments: number) => {
        const ringGeometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true)
        
        // Try to load Moroccan pattern texture, fallback to material if not available
        let patternMaterial
        try {
          const patternTexture = textureLoader.load('/textures/moroccan-pattern.jpg')
          patternTexture.wrapS = THREE.RepeatWrapping
          patternTexture.wrapT = THREE.RepeatWrapping
          patternTexture.repeat.set(segments / 2, 1)
          
          patternMaterial = new THREE.MeshStandardMaterial({
            map: patternTexture,
            roughness: 0.8,
            metalness: 0.2
          })
        } catch (e) {
          // Fallback to colored material
          patternMaterial = new THREE.MeshStandardMaterial({
            color: 0xd9a566, // Sandstone color
            roughness: 0.8,
            metalness: 0.2
          })
        }
        
        const ring = new THREE.Mesh(ringGeometry, patternMaterial)
        ring.position.set(0, height/2, 0)
        ring.castShadow = true
        ring.receiveShadow = true
        scene.add(ring)
        return ring
      }
      
      // Add decoration to the fountain
      addTileDecoration(2.6, 0.6, 16)
      
      // Create the central fountain column
      const columnGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 8)
      const columnMaterial = new THREE.MeshStandardMaterial({
        color: 0xc19a6b, // Sandstone
        roughness: 0.9,
        metalness: 0.1
      })
      const column = new THREE.Mesh(columnGeometry, columnMaterial)
      column.position.set(0, 1, 0)
      column.castShadow = true
      scene.add(column)
      
      // Create water bowl
      const bowlGeometry = new THREE.CylinderGeometry(1.5, 1.2, 0.4, 16)
      const bowlMaterial = new THREE.MeshStandardMaterial({
        color: 0x1560aa, // Moroccan blue
        roughness: 0.4,
        metalness: 0.6
      })
      const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial)
      bowl.position.set(0, 2.2, 0)
      bowl.castShadow = true
      scene.add(bowl)
      
      // Create water surface with animated shader
      const waterGeometry = new THREE.CircleGeometry(1.2, 32)
      
      const waterVertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `
      
      const waterFragmentShader = `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Create ripples
          float ripple = sin(dist * 50.0 - time * 2.0) * 0.5 + 0.5;
          ripple *= smoothstep(0.5, 0.0, dist);
          
          vec3 waterColor = mix(
            vec3(0.1, 0.5, 0.8),    // Deep blue
            vec3(0.5, 0.8, 1.0),    // Light blue
            ripple
          );
          
          // Add highlights
          float highlight = pow(1.0 - dist, 4.0) * 0.5;
          waterColor += vec3(highlight);
          
          gl_FragColor = vec4(waterColor, 0.8);
        }
      `
      
      const waterUniforms = {
        time: { value: 0 }
      }
      
      const waterMaterial = new THREE.ShaderMaterial({
        uniforms: waterUniforms,
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      })
      
      const waterSurface = new THREE.Mesh(waterGeometry, waterMaterial)
      waterSurface.rotation.x = -Math.PI / 2
      waterSurface.position.set(0, 2.41, 0)
      scene.add(waterSurface)
      
      // Animate water
      const animateWater = () => {
        waterUniforms.time.value += 0.03
        requestAnimationFrame(animateWater)
      }
      animateWater()
      
      // Create a MOTTANA sign with Arabic-inspired styling
      try {
        const fontLoader = new FontLoader()
        fontLoader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
          // Create MOTTANA text
          const textGeometry = new TextGeometry('MOTTANA', {
            font: font,
            size: 0.6,
            depth: 0.1, // Changed from 'height' to 'depth' which is the correct property
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
          })
          
          textGeometry.center()
          
          const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x553311,
            emissiveIntensity: 0.2
          })
          
          const textMesh = new THREE.Mesh(textGeometry, textMaterial)
          textMesh.position.set(0, 3.2, 0)
          textMesh.castShadow = true
          scene.add(textMesh)
        })
      } catch (e) {
        console.log("Font loading failed, creating fallback text")
        
        // Fallback if font loading fails
        const textMesh = new THREE.Mesh(
          new THREE.BoxGeometry(3, 0.6, 0.1),
          new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold
            metalness: 0.8,
            roughness: 0.2
          })
        )
        textMesh.position.set(0, 3.2, 0)
        textMesh.castShadow = true
        scene.add(textMesh)
      }
      
      // Add decorative elements around the fountain
      const addDecorativePlants = () => {
        const createPlant = (x: number, z: number) => {
          // Create pot
          const potGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 8)
          const potMaterial = new THREE.MeshStandardMaterial({
            color: 0xc07853, // Terracotta
            roughness: 0.9,
            metalness: 0.1
          })
          const pot = new THREE.Mesh(potGeometry, potMaterial)
          pot.position.set(x, 0.3, z)
          pot.castShadow = true
          pot.receiveShadow = true
          scene.add(pot)
          
          // Create simplified plant
          const plantGeometry = new THREE.ConeGeometry(0.3, 0.8, 8)
          const plantMaterial = new THREE.MeshStandardMaterial({
            color: 0x2e8b57, // Plant green
            roughness: 0.9,
            metalness: 0.1
          })
          const plant = new THREE.Mesh(plantGeometry, plantMaterial)
          plant.position.set(x, 1, z)
          plant.castShadow = true
          scene.add(plant)
        }
        
        // Place plants around the fountain
        const radius = 3.5
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          createPlant(x, z)
        }
      }
      
      addDecorativePlants()
    }
    
    try {
      createCentralDisplay()
    } catch (e) {
      console.log("Central display creation failed:", e)
    }
    
    // Add controls
    let controls: OrbitControls | PointerLockControls
    const velocity = new THREE.Vector3()
    const direction = new THREE.Vector3()
    let moveForward = false
    let moveBackward = false
    let moveLeft = false
    let moveRight = false
    let canJump = false
    
    const initializeControls = () => {
      if (viewMode === 'firstPerson') {
        // Set up first-person controls (PointerLockControls)
        controls = new PointerLockControls(camera, renderer.domElement)
        
        // Add listener for pointer lock/unlock
        controls.addEventListener('lock', () => {
          document.getElementById('instructions')?.classList.add('hidden')
        })
        
        controls.addEventListener('unlock', () => {
          document.getElementById('instructions')?.classList.remove('hidden')
        })
        
        // Add click listener to lock controls
        containerRef.current?.addEventListener('click', () => {
          if (controls instanceof PointerLockControls) {
            controls.lock()
          }
        })
      } else {
        // Set up orbit controls for easier gallery viewing
        controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 1, 0)
        
        // Set camera movement limits for orbit controls
        controls.minPolarAngle = Math.PI * 0.1 // Limit looking down
        controls.maxPolarAngle = Math.PI * 0.9 // Limit looking up
        controls.minDistance = 1 // Don't get too close to target
        controls.maxDistance = 15 // Don't go too far from target
        controls.enableDamping = true // Add inertia
        controls.dampingFactor = 0.05
        
        // Prevent camera from going below floor level
        controls.addEventListener('change', () => {
          if (camera.position.y < 0.5) {
            camera.position.y = 0.5
          }
        })
        
        controls.update()
      }
      
      controlsRef.current = controls
    }
    
    initializeControls()
    
    // Keyboard controls setup with improved mechanics
    const keyStates: Record<string, boolean> = {}
    const normalSpeed = 0.15
    const runSpeed = 0.3
    const acceleration = 0.08
    const friction = 0.85
    const jumpVelocity = 0.2
    const headBobSpeed = 12
    const headBobAmount = 0.05
    const currentVelocity = new THREE.Vector3(0, 0, 0)
    let stepCounter = 0
    
    const handleKeyDown = (event: KeyboardEvent) => {
      keyStates[event.code] = true
      
      // Set running state when shift is pressed
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        setIsRunning(true)
      }
      
      // Handle jumping
      if ((event.code === 'Space') && canJump) {
        velocity.y = jumpVelocity
        canJump = false
      }
    }
    
    const handleKeyUp = (event: KeyboardEvent) => {
      keyStates[event.code] = false
      
      // Unset running state when shift is released
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        setIsRunning(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    // Enhanced keyboard movement function with head bobbing
    const handleKeyboardMovement = () => {
      if (!controlsRef.current || !cameraRef.current) return
      
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      // Calculate movement direction
      const cameraDirection = new THREE.Vector3()
      camera.getWorldDirection(cameraDirection)
      cameraDirection.y = 0
      cameraDirection.normalize()
      
      const rightVector = new THREE.Vector3()
      rightVector.crossVectors(camera.up, cameraDirection).normalize()
      
      const targetVelocity = new THREE.Vector3(0, 0, 0)
      let isMoving = false
      
      // Current max speed based on running state
      const maxVelocity = isRunning ? runSpeed : normalSpeed
      
      // Calculate target velocity based on keys pressed
      if (keyStates['ArrowUp'] || keyStates['KeyW']) {
        targetVelocity.add(cameraDirection.clone().multiplyScalar(maxVelocity))
        isMoving = true
      }
      if (keyStates['ArrowDown'] || keyStates['KeyS']) {
        targetVelocity.add(cameraDirection.clone().multiplyScalar(-maxVelocity))
        isMoving = true
      }
      if (keyStates['ArrowLeft'] || keyStates['KeyA']) {
        targetVelocity.add(rightVector.clone().multiplyScalar(-maxVelocity))
        isMoving = true
      }
      if (keyStates['ArrowRight'] || keyStates['KeyD']) {
        targetVelocity.add(rightVector.clone().multiplyScalar(maxVelocity))
        isMoving = true
      }
      
      // Apply acceleration/deceleration
      if (isMoving) {
        currentVelocity.x += (targetVelocity.x - currentVelocity.x) * acceleration
        currentVelocity.z += (targetVelocity.z - currentVelocity.z) * acceleration
        
        // Apply head bobbing in first person mode
        if (viewMode === 'firstPerson') {
          stepCounter += isRunning ? headBobSpeed * 1.5 : headBobSpeed
          
          // Calculate bob offset
          const bobOffset = Math.sin(stepCounter / 10) * headBobAmount * 
            Math.min(1, Math.sqrt(currentVelocity.x * currentVelocity.x + currentVelocity.z * currentVelocity.z) / maxVelocity)
          
          // Apply vertical bob to camera height
          camera.position.y = playerHeight + bobOffset
          
          // Apply slight tilt for more natural movement
          const tiltAmount = Math.sin(stepCounter / 5) * 0.01
          camera.rotation.z = tiltAmount
        }
        
        // Play footstep sound when moving
        playFootstep(isRunning)
      } else {
        // Apply friction to slow down when no keys are pressed
        currentVelocity.x *= friction
        currentVelocity.z *= friction
        
        // Reset head position when not moving
        if (viewMode === 'firstPerson') {
          camera.position.y = playerHeight
          camera.rotation.z = 0
        }
      }
      
      // Calculate new position
      const newPosition = camera.position.clone()
      newPosition.x += currentVelocity.x
      newPosition.z += currentVelocity.z
      
      // Check for wall collisions
      if (!checkWallCollision(newPosition)) {
        camera.position.x = newPosition.x
        camera.position.z = newPosition.z
        
        // Update controls target to move along with the camera
        if (controls instanceof OrbitControls) {
          controls.target.x = newPosition.x
          controls.target.z = newPosition.z
          controls.target.y = playerHeight
          controls.update()
        }
        
        // Update player position for minimap
        playerPositionRef.current = {
          x: camera.position.x,
          z: camera.position.z
        }
      } else {
        // Slide along walls instead of stopping completely
        const slidingPosition = camera.position.clone()
        
        // Try sliding along X axis
        slidingPosition.x = newPosition.x
        if (!checkWallCollision(slidingPosition)) {
          camera.position.x = slidingPosition.x
          currentVelocity.z *= 0.5 // Reduce perpendicular velocity
        } else {
          // Try sliding along Z axis
          slidingPosition.x = camera.position.x
          slidingPosition.z = newPosition.z
          if (!checkWallCollision(slidingPosition)) {
            camera.position.z = slidingPosition.z
            currentVelocity.x *= 0.5 // Reduce perpendicular velocity
          } else {
            // Can't slide, reset velocity
            currentVelocity.set(0, 0, 0)
          }
        }
      }
      
      // Apply gravity and vertical movement
      if (camera.position.y > playerHeight) {
        velocity.y -= 0.01 // Gravity
        camera.position.y += velocity.y
        
        // Check if on ground
        if (camera.position.y <= playerHeight) {
          camera.position.y = playerHeight
          velocity.y = 0
          canJump = true
        }
      } else {
        canJump = true
      }
      
      // Keep camera within gallery boundaries
      const boundaryLimit = 9.5 // Slightly less than room size/2
      
      if (Math.abs(camera.position.x) > boundaryLimit) {
        camera.position.x = Math.sign(camera.position.x) * boundaryLimit
      }
      
      if (Math.abs(camera.position.z) > boundaryLimit) {
        camera.position.z = Math.sign(camera.position.z) * boundaryLimit
      }
    }
    
    // Load footstep sounds
    const audioListener = new THREE.AudioListener()
    camera.add(audioListener)
    
    const footstepSound = new THREE.Audio(audioListener)
    const footstepRunSound = new THREE.Audio(audioListener)
    const audioLoader = new THREE.AudioLoader()
    let isFootstepLoaded = false
    let isFootstepRunLoaded = false
    
    try {
      audioLoader.load('/sounds/footstep.mp3', function(buffer) {
        footstepSound.setBuffer(buffer)
        footstepSound.setVolume(0.2)
        footstepSound.setLoop(false)
        isFootstepLoaded = true
      })
      
      audioLoader.load('/sounds/footstep_run.mp3', function(buffer) {
        footstepRunSound.setBuffer(buffer)
        footstepRunSound.setVolume(0.3)
        footstepRunSound.setLoop(false)
        isFootstepRunLoaded = true
      })
    } catch (error) {
      console.log('Could not load footstep sounds:', error)
    }
    
    // Create footstep sound function with running variation
    let lastFootstepTime = 0
    const playFootstep = (running = false) => {
      if (!isFootstepLoaded && !isFootstepRunLoaded) return
      
      const now = Date.now()
      const interval = running ? 250 : 400 // Faster footsteps when running
      
      // Only play footstep sound at appropriate intervals
      if (now - lastFootstepTime > interval) {
        if (running && isFootstepRunLoaded) {
          footstepRunSound.play()
        } else if (isFootstepLoaded) {
          footstepSound.play()
        }
        lastFootstepTime = now
      }
    }
    
    // Set up wall collision detection
    const wallColliders: THREE.Box3[] = []
    
    // Front wall
    wallColliders.push(new THREE.Box3(
      new THREE.Vector3(-10, -0.5, -10), 
      new THREE.Vector3(10, 6, -9.9)
    ))
    
    // Back wall
    wallColliders.push(new THREE.Box3(
      new THREE.Vector3(-10, -0.5, 9.9), 
      new THREE.Vector3(10, 6, 10)
    ))
    
    // Left wall
    wallColliders.push(new THREE.Box3(
      new THREE.Vector3(-10, -0.5, -10), 
      new THREE.Vector3(-9.9, 6, 10)
    ))
    
    // Right wall
    wallColliders.push(new THREE.Box3(
      new THREE.Vector3(9.9, -0.5, -10), 
      new THREE.Vector3(10, 6, 10)
    ))
    
    // Check if position is colliding with any wall
    const checkWallCollision = (position: THREE.Vector3): boolean => {
      const playerBox = new THREE.Box3()
      playerBox.setFromCenterAndSize(
        position, 
        new THREE.Vector3(0.5, 1.7, 0.5)
      )
      
      for (const wall of wallColliders) {
        if (playerBox.intersectsBox(wall)) {
          return true
        }
      }
      
      return false
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Handle click to view artwork info or teleport
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !infoPanelRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1
      
      // Update the raycaster
      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      
      // Check for teleport point intersections first
      const teleportIntersects = raycasterRef.current.intersectObjects(teleportPoints)
      if (teleportIntersects.length > 0) {
        const teleportPoint = teleportIntersects[0].object
        if (teleportPoint.userData && teleportPoint.userData.teleportPosition) {
          // Create a smooth camera animation to the teleport point
          const startPosition = camera.position.clone()
          const targetPosition = teleportPoint.userData.teleportPosition
          
          // Look at center when teleporting
          if (controls instanceof OrbitControls) {
            controls.target.set(0, 1, 0)
            
            // Animate camera over 1 second
            const duration = 1000
            const startTime = Date.now()
            
            const animateTeleport = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              
              // Use easing function for smooth motion
              const easeProgress = 1 - Math.pow(1 - progress, 3)
              
              camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
              if (controls instanceof OrbitControls) {
                controls.update()
              }
              
              if (progress < 1) {
                requestAnimationFrame(animateTeleport)
              }
            }
            
            animateTeleport()
          }
          
          return
        }
      }
      
      // Find all artwork planes (the inner part of the frame)
      const artworkObjects: THREE.Object3D[] = []
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && 
            obj.geometry instanceof THREE.PlaneGeometry && 
            obj.userData && 
            obj.userData.title) {
          artworkObjects.push(obj)
        }
      })
      
      // Check for artwork intersections
      const intersects = raycasterRef.current.intersectObjects(artworkObjects)
      
      if (intersects.length > 0) {
        const artwork = intersects[0].object
        const title = artwork.userData.title
        const description = artwork.userData.description
        const context = artwork.userData.context
        
        // Update and show info panel
        const titleElement = infoPanelRef.current.querySelector('h3')
        const descElement = infoPanelRef.current.querySelector('p:nth-of-type(1)')
        const contextElement = infoPanelRef.current.querySelector('p:nth-of-type(2)')
        
        if (titleElement) titleElement.textContent = title
        if (descElement) descElement.textContent = description
        if (contextElement) contextElement.textContent = context
        
        infoPanelRef.current.classList.remove('hidden')
      }
    }
    
    containerRef.current.addEventListener('click', handleClick)
    
    // Handle mousemove for hovering artwork
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1
      
      // Update the raycaster
      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      
      // Find all artwork planes
      const artworkObjects: THREE.Object3D[] = []
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && 
            obj.geometry instanceof THREE.PlaneGeometry && 
            obj.userData && 
            obj.userData.title) {
          artworkObjects.push(obj)
        }
      })
      
      // Check for intersections
      const intersects = raycasterRef.current.intersectObjects(artworkObjects)
      
      // Reset all highlighted frames
      artworkObjects.forEach((obj) => {
        if (obj instanceof THREE.Mesh && 
            obj.userData && 
            obj.userData.originalFrame) {
          if (obj.userData.isHighlighted) {
            obj.userData.originalFrame.material = new THREE.MeshStandardMaterial({ 
              color: 0x5c4033,
              roughness: 0.5,
              metalness: 0.2 
            })
            obj.userData.isHighlighted = false
          }
        }
      })
      
      // Highlight hovered frame
      if (intersects.length > 0) {
        const artwork = intersects[0].object
        if (artwork instanceof THREE.Mesh && 
            artwork.userData && 
            artwork.userData.originalFrame) {
          artwork.userData.originalFrame.material = new THREE.MeshStandardMaterial({
            color: 0xA57C52,
            roughness: 0.3,
            metalness: 0.4,
            emissive: 0x553311,
            emissiveIntensity: 0.2
          })
          artwork.userData.isHighlighted = true
          
          // Change cursor to pointer
          containerRef.current.style.cursor = 'pointer'
        }
      } else {
        // Reset cursor
        containerRef.current.style.cursor = 'grab'
      }
    }
    
    containerRef.current.addEventListener('mousemove', handleMouseMove)
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Handle keyboard movement
      handleKeyboardMovement()
      
      // Update controls
      if (controlsRef.current instanceof OrbitControls) {
        controlsRef.current.update()
      }
      
      // Update player position for minimap
      if (cameraRef.current) {
        playerPositionRef.current = {
          x: cameraRef.current.position.x,
          z: cameraRef.current.position.z
        }
      }
      
      // Update minimap
      updateMinimap()
      
      // Pulse animation for teleport points
      const time = Date.now() * 0.001
      teleportPoints.forEach(point => {
        if (point instanceof THREE.Mesh) {
          point.scale.x = 1 + 0.1 * Math.sin(time * 2)
          point.scale.z = 1 + 0.1 * Math.sin(time * 2)
        }
      })
      
      // Animate decorative objects
      const rotateSpeed = 0.005
      modelsRef.current.forEach(model => {
        model.rotation.y += rotateSpeed
      })
      
      // Use the current camera for rendering
      if (cameraRef.current) {
        renderer.render(scene, cameraRef.current)
      }
    }
    
    // Create and update minimap with Moroccan styling
    const updateMinimap = () => {
      if (!minimapRef.current) return
      
      const ctx = minimapRef.current.getContext('2d')
      if (!ctx) return
      
      // Clear canvas
      ctx.clearRect(0, 0, minimapRef.current.width, minimapRef.current.height)
      
      // Draw room
      const roomSize = 20
      const scale = minimapRef.current.width / (roomSize * 1.5)
      const centerX = minimapRef.current.width / 2
      const centerY = minimapRef.current.height / 2
      
      // Draw background pattern
      const pattern = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, minimapRef.current.width / 2
      )
      pattern.addColorStop(0, '#f9e5c4')
      pattern.addColorStop(1, '#e3c8a0')
      
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, minimapRef.current.width, minimapRef.current.height)
      
      // Draw decorative border
      ctx.strokeStyle = '#87431d'
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, minimapRef.current.width - 4, minimapRef.current.height - 4)
      
      // Draw inner decorative border
      ctx.strokeStyle = '#1560aa'
      ctx.lineWidth = 2
      ctx.strokeRect(8, 8, minimapRef.current.width - 16, minimapRef.current.height - 16)
      
      // Draw walls with Moroccan-style pattern
      const drawMoroccanPattern = (x: number, y: number, width: number, height: number) => {
        ctx.fillStyle = '#faf0e6'
        ctx.fillRect(x, y, width, height)
        
        // Draw simple geometric pattern
        ctx.strokeStyle = '#1560aa'
        ctx.lineWidth = 1
        
        const patternSize = 8
        const cols = Math.floor(width / patternSize)
        const rows = Math.floor(height / patternSize)
        
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillStyle = '#1560aa22'
              ctx.fillRect(
                x + i * patternSize,
                y + j * patternSize,
                patternSize,
                patternSize
              )
            }
          }
        }
      }
      
      // Draw walls
      const wallThickness = 6
      const mapSize = roomSize * scale
      
      // Outer frame
      drawMoroccanPattern(
        centerX - mapSize / 2 - wallThickness,
        centerY - mapSize / 2 - wallThickness,
        mapSize + wallThickness * 2,
        wallThickness
      ) // Top
      
      drawMoroccanPattern(
        centerX - mapSize / 2 - wallThickness,
        centerY + mapSize / 2,
        mapSize + wallThickness * 2,
        wallThickness
      ) // Bottom
      
      drawMoroccanPattern(
        centerX - mapSize / 2 - wallThickness,
        centerY - mapSize / 2,
        wallThickness,
        mapSize
      ) // Left
      
      drawMoroccanPattern(
        centerX + mapSize / 2,
        centerY - mapSize / 2,
        wallThickness,
        mapSize
      ) // Right
      
      // Draw room interior
      ctx.fillStyle = '#f5f5f780'
      ctx.fillRect(
        centerX - mapSize / 2,
        centerY - mapSize / 2,
        mapSize,
        mapSize
      )
      
      // Draw central fountain
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fillStyle = '#1560aa'
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#67c7eb'
      ctx.fill()
      
      // Draw decorative carpets
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(Math.PI / 4)
      ctx.fillStyle = '#c19a6b80'
      ctx.fillRect(-15, -40, 30, 80) // Top carpet
      ctx.fillRect(-15, -40, 30, 80) // Bottom carpet
      ctx.restore()
      
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(-Math.PI / 4)
      ctx.fillStyle = '#c19a6b80'
      ctx.fillRect(-15, -40, 30, 80) // Left carpet
      ctx.fillRect(-15, -40, 30, 80) // Right carpet
      ctx.restore()
      
      // Draw poufs (seats)
      const drawPouf = (x: number, z: number, color: string) => {
        ctx.beginPath()
        ctx.arc(
          centerX + x * scale,
          centerY + z * scale,
          3,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = color
        ctx.fill()
      }
      
      // Draw the poufs
      drawPouf(-7, -7, '#c0785380')
      drawPouf(-6, -7, '#1560aa80')
      drawPouf(-7, -6, '#1560aa80')
      
      drawPouf(7, 7, '#c0785380')
      drawPouf(6, 7, '#1560aa80')
      drawPouf(7, 6, '#1560aa80')
      
      drawPouf(-7, 7, '#d9a56680')
      drawPouf(-6, 7, '#d9a56680')
      
      drawPouf(7, -7, '#d9a56680')
      drawPouf(6, -7, '#d9a56680')
      
      // Draw artwork positions
      ctx.fillStyle = '#343a7d'
      
      // Front wall artworks
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(
          centerX - 6 * scale + i * 4 * scale - 3,
          centerY - mapSize / 2 - 1,
          6,
          2
        )
      }
      
      // Right wall artworks
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(
          centerX + mapSize / 2 - 1,
          centerY - 6 * scale + i * 4 * scale - 3,
          2,
          6
        )
      }
      
      // Back wall artworks
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(
          centerX + 6 * scale - i * 4 * scale - 3,
          centerY + mapSize / 2 - 1,
          6,
          2
        )
      }
      
      // Left wall artworks
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(
          centerX - mapSize / 2 - 1,
          centerY + 6 * scale - i * 4 * scale - 3,
          2,
          6
        )
      }
      
      // Draw player position with directional indicator
      const playerX = centerX + playerPositionRef.current.x * scale
      const playerZ = centerY + playerPositionRef.current.z * scale
      
      // Draw player shadow
      ctx.beginPath()
      ctx.arc(playerX, playerZ, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fill()
      
      // Draw player icon
      ctx.beginPath()
      ctx.arc(playerX, playerZ, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ff3333'
      ctx.fill()
      
      // Draw player direction with arrowhead
      if (cameraRef.current) {
        const directionX = Math.sin(cameraRef.current.rotation.y)
        const directionZ = Math.cos(cameraRef.current.rotation.y)
        
        ctx.beginPath()
        ctx.moveTo(playerX, playerZ)
        ctx.lineTo(
          playerX + directionX * 12,
          playerZ + directionZ * 12
        )
        ctx.strokeStyle = '#ff3333'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Draw arrowhead
        const headlen = 6
        const angle = Math.atan2(directionZ, directionX)
        
        ctx.beginPath()
        ctx.moveTo(
          playerX + directionX * 12,
          playerZ + directionZ * 12
        )
        ctx.lineTo(
          playerX + directionX * 12 - headlen * Math.cos(angle - Math.PI / 6),
          playerZ + directionZ * 12 - headlen * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          playerX + directionX * 12 - headlen * Math.cos(angle + Math.PI / 6),
          playerZ + directionZ * 12 - headlen * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fillStyle = '#ff3333'
        ctx.fill()
      }
      
      // Add compass indicator
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      ctx.fillText('N', centerX, centerY - mapSize / 2 - 10)
      ctx.fillText('S', centerX, centerY + mapSize / 2 + 10)
      ctx.fillText('W', centerX - mapSize / 2 - 10, centerY)
      ctx.fillText('E', centerX + mapSize / 2 + 10, centerY)
    }
    
    animate()
    
    // Toggle between first-person and orbit camera modes
    const toggleViewMode = () => {
      if (!containerRef.current || !cameraRef.current) return
      
      if (viewMode === 'orbit') {
        // Switch to first-person mode
        const position = cameraRef.current.position.clone()
        const rotation = cameraRef.current.rotation.clone()
        
        // Dispose of orbit controls
        if (controlsRef.current instanceof OrbitControls) {
          controlsRef.current.dispose()
        }
        
        // Create new camera for first-person view
        const fpCamera = new THREE.PerspectiveCamera(
          80,  // Wider FOV for more immersive first-person view
          containerRef.current.clientWidth / containerRef.current.clientHeight, 
          0.1, 
          1000
        )
        fpCamera.position.copy(position)
        fpCamera.rotation.copy(rotation)
        
        // Replace current camera
        cameraRef.current = fpCamera
        
        // Replace controls with Pointer Lock
        const plControls = new PointerLockControls(fpCamera, renderer.domElement)
        plControls.addEventListener('lock', function () {
          document.getElementById('instructions')?.classList.add('hidden')
        })
        
        plControls.addEventListener('unlock', function () {
          document.getElementById('instructions')?.classList.remove('hidden')
        })
        
        containerRef.current.addEventListener('click', function() {
          plControls.lock()
        })
        
        controlsRef.current = plControls
        
        // Set player height
        camera.position.y = playerHeight
        
        setViewMode('firstPerson')
        
        // Provide feedback for view mode change
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-black/80 text-white py-2 px-4 rounded-md z-50'
        notification.textContent = dict.gallery3d.firstPersonMode || 'First Person Mode'
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 2000)
      } else {
        // Switch back to orbit controls
        const position = cameraRef.current.position.clone()
        const rotation = cameraRef.current.rotation.clone()
        
        // Dispose of pointer lock controls
        if (controlsRef.current instanceof PointerLockControls) {
          controlsRef.current.disconnect()
        }
        
        // Create new camera for orbit view
        const orbitCamera = new THREE.PerspectiveCamera(
          75, 
          containerRef.current.clientWidth / containerRef.current.clientHeight, 
          0.1, 
          1000
        )
        orbitCamera.position.copy(position)
        orbitCamera.rotation.copy(rotation)
        
        // Replace current camera
        cameraRef.current = orbitCamera
        
        // Replace controls
        const newControls = new OrbitControls(orbitCamera, renderer.domElement)
        newControls.target.set(0, 1, 0)
        newControls.minPolarAngle = Math.PI * 0.1
        newControls.maxPolarAngle = Math.PI * 0.9
        newControls.minDistance = 1
        newControls.maxDistance = 15
        newControls.enableDamping = true
        newControls.dampingFactor = 0.05
        newControls.update()
        
        controlsRef.current = newControls
        
        setViewMode('orbit')
        
        // Provide feedback for view mode change
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-black/80 text-white py-2 px-4 rounded-md z-50'
        notification.textContent = dict.gallery3d.orbitMode || 'Orbit Mode'
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 2000)
      }
    }
    
    // Add key handler for view mode toggle and Q/E rotation
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyV') {
        toggleViewMode()
      }
      
      // Hide/show control instructions
      if (event.code === 'KeyH') {
        setShowControls(prev => !prev)
      }
      
      // Q/E for rotation in first person view (looking left/right)
      if (viewMode === 'firstPerson' && cameraRef.current) {
        const rotationAmount = 0.1
        
        if (event.code === 'KeyQ') {
          // Rotate camera left
          cameraRef.current.rotation.y += rotationAmount
        }
        
        if (event.code === 'KeyE') {
          // Rotate camera right
          cameraRef.current.rotation.y -= rotationAmount
        }
      }
    }
    
    window.addEventListener('keypress', handleKeyPress)
    
    // Info panel for artwork details
    const createInfoPanel = () => {
      const panel = document.createElement('div')
      panel.className = 'artwork-info hidden fixed top-4 left-4 bg-background/90 backdrop-blur-md p-4 rounded-lg shadow-lg max-w-md border border-primary/20 z-50'
      panel.innerHTML = `
        <h3 class="text-xl font-bold mb-2"></h3>
        <p class="mb-2 text-sm"></p>
        <p class="text-xs opacity-80"></p>
        <button class="mt-3 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">
          ${dict.gallery.close || "Close"}
        </button>
      `
      document.body.appendChild(panel)
      
      // Add close button event
      const closeButton = panel.querySelector('button')
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          panel.classList.add('hidden')
        })
      }
      
      infoPanelRef.current = panel
      return panel
    }
    
    // Create info panel
    createInfoPanel()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('keypress', handleKeyPress)
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick)
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
        containerRef.current.removeChild(renderer.domElement)
      }
      if (infoPanelRef.current) {
        document.body.removeChild(infoPanelRef.current)
      }
    }
  }, [dict, lang, viewMode, showControls])
  
  return (
    <>
      <div 
        id="instructions" 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-black/70 text-white p-6 rounded-lg text-center max-w-md border border-amber-500/50">
          <h3 className="text-xl font-bold mb-3 text-amber-400">{dict.gallery3d.instructions || "Interactive Moroccan Gallery"}</h3>
          
          <div className="bg-black/40 p-3 rounded-md mb-3">
            <h4 className="text-md font-semibold mb-1 text-blue-300">{dict.gallery3d.movementControls || "Movement Controls"}</h4>
            <p className="text-sm mb-1">{dict.gallery3d.wasdKeys || "WASD or Arrow Keys to move"}</p>
            <p className="text-sm mb-1">{dict.gallery3d.qeKeys || "Q/E to rotate view in First Person"}</p>
            <p className="text-sm">{dict.gallery3d.shiftKey || "Hold SHIFT to run"}</p>
          </div>
          
          <div className="bg-black/40 p-3 rounded-md mb-3">
            <h4 className="text-md font-semibold mb-1 text-green-300">{dict.gallery3d.interactionControls || "Interaction"}</h4>
            <p className="text-sm mb-1">{dict.gallery3d.clickArtworks || "Click artworks to view details"}</p>
            <p className="text-sm">{dict.gallery3d.teleportPoints || "Click colored circles to teleport"}</p>
          </div>
          
          <div className="bg-black/40 p-3 rounded-md">
            <h4 className="text-md font-semibold mb-1 text-amber-300">{dict.gallery3d.viewControls || "View Controls"}</h4>
            <p className="text-sm mb-1">{dict.gallery3d.vKey || "V to toggle between Orbit/First Person"}</p>
            <p className="text-sm">{dict.gallery3d.hKey || "H to hide/show these instructions"}</p>
          </div>
          
          <button 
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-md transition-colors duration-200"
            onClick={() => setShowControls(false)}
          >
            {dict.gallery3d.startExploring || "Start Exploring"}
          </button>
        </div>
      </div>
      
      <div className="relative h-[600px] w-full">
        <div 
          ref={containerRef} 
          className="h-full w-full rounded-lg overflow-hidden"
          style={{ touchAction: 'none' }}
        />
        
        
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-primary/20">
          <p className="text-xs mb-1 font-medium text-center">{dict.gallery3d.map || "Gallery Map"}</p>
          <canvas 
            ref={minimapRef} 
            width={150} 
            height={150} 
            className="border border-muted rounded-md"
          />
        </div>
      </div>
    </>
  )
}
