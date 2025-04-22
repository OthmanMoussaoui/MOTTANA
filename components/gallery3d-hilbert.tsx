"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import generateMap from '@/lib/gallery3d/map'
import FPSController from '@/lib/gallery3d/fps'
import { createGalleryMeshes } from '@/lib/gallery3d/mesh'
import PlacementManager, { GalleryItem } from '@/lib/gallery3d/placement'

interface Gallery3DHilbertProps {
  dict: any
  lang: string
}

export default function Gallery3DHilbert({ dict, lang }: Gallery3DHilbertProps) {
  // Define a single ref for the container div
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Define a ref for the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Flag to track initialization
  const isInitializedRef = useRef(false)
  const isRunningRef = useRef(false)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const [viewMode, setViewMode] = useState<'orbit' | 'firstPerson'>('firstPerson')
  const [showControls, setShowControls] = useState(true)
  const [showInstructions, setShowInstructions] = useState(true)
  const [errorState, setErrorState] = useState(false)
  
  // Create references
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const fpsControllerRef = useRef<FPSController | null>(null)
  const orbitControlsRef = useRef<OrbitControls | null>(null)
  const placementManagerRef = useRef<PlacementManager | null>(null)
  const mapDataRef = useRef<ReturnType<typeof generateMap> | null>(null)
  
  // Animation loop reference
  const frameRef = useRef<number>(0)
  
  // Player state for minimap
  const playerPositionRef = useRef<{ x: number, z: number, angle: number }>({
    x: 0,
    z: 0,
    angle: 0
  })
  
  // Define canvasRef separately from containerRef
  const minimapContainerRef = useRef<HTMLDivElement | null>(null)
  const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const notificationRef = useRef<HTMLDivElement | null>(null)
  
  // Handle window resize
  const handleResize = () => {
    if (!rendererRef.current || !cameraRef.current || !canvasRef.current) return
    
    const width = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight
    
    // Update camera
    if (cameraRef.current) {
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
    }
    
    // Update renderer
    if (rendererRef.current) {
      rendererRef.current.setSize(width, height)
    }
  }
  
  // Handle keyboard events from React
  const handleKeyPress = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.code === 'KeyV') {
      toggleViewMode()
    }
    
    // Hide/show control instructions
    if (event.code === 'KeyH') {
      setShowControls(prev => !prev)
    }
  }
  
  // Handle keyboard events for window
  const handleNativeKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'KeyV') {
      toggleViewMode()
    }
    
    // Hide/show control instructions
    if (event.code === 'KeyH') {
      setShowControls(prev => !prev)
    }
  }
  
  useEffect(() => {
    // Log initialization
    console.log("Gallery3DHilbert component mounted")
    
    // Only run this once
    if (isInitializedRef.current) return
    
    // We'll initialize when the user clicks "Start Exploring" button
    // This allows the canvas to be properly mounted first
    
    // Cleanup function
    return () => {
      console.log("Gallery3DHilbert component unmounting")
      cleanupGallery()
    }
  }, [dict, lang])
  
  // Initialize Three.js scene, camera, and renderer
  const initializeThreeJS = (scene: THREE.Scene) => {
    if (!canvasRef.current) return
    
    // Set background color with slight Moroccan ambiance
    scene.background = new THREE.Color(0xfaf0e6)
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    )
    camera.position.set(2, 1.7, 2)
    cameraRef.current = camera
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true
    })
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xd9c7a0, 0.5)
    scene.add(ambientLight)
    
    // Add directional light for shadows
    const dirLight = new THREE.DirectionalLight(0xfff1e0, 0.8)
    dirLight.position.set(5, 10, 2)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    scene.add(dirLight)
    
    // Add point lights for ambiance
    const light1 = new THREE.PointLight(0xe8c17a, 1, 30)
    light1.position.set(10, 5, 10)
    scene.add(light1)
    
    const light2 = new THREE.PointLight(0xd35400, 1, 30)
    light2.position.set(-10, 5, -10)
    scene.add(light2)
  }
  
  // Initialize gallery
  const initializeGallery = async (gallery: GalleryItem[]) => {
    try {
      // Check if canvas is available
      if (!canvasRef.current) {
        console.error("Canvas element is not available");
        return;
      }
      
      // Create the scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Initialize Three.js components
      initializeThreeJS(scene);
      
      // Generate maze map
      const mapData = generateMap();
      mapDataRef.current = mapData;
      
      // Create gallery meshes from map data
      const { mainMesh, reflectionMesh } = await createGalleryMeshes(mapData, {
        wallTexturePath: '/textures/wall.jpg',
        floorTexturePath: '/textures/floor.jpg',
        useReflection: true
      });
      
      // Add meshes to scene
      scene.add(mainMesh);
      if (reflectionMesh) scene.add(reflectionMesh);
      
      // Create FPS controller
      const fpsController = new FPSController(cameraRef.current!, mapData, {
        domElement: canvasRef.current,
        enablePointerLock: true,
        enableTouchControls: true,
        onMove: (position) => {
          playerPositionRef.current.x = position.x
          playerPositionRef.current.z = position.z
          updateMinimap()
        },
        onLook: (rotation) => {
          playerPositionRef.current.angle = rotation.y
          updateMinimap()
        },
        onFootstep: (position, isRunning) => {
          playFootstep(isRunning)
        },
        onTeleport: (from, to) => {
          // Show teleport notification
          showNotification("Teleported to new location")
        }
      });
      fpsControllerRef.current = fpsController;
      
      // Initialize placement manager
      const placementManager = new PlacementManager(scene, mapData, gallery);
      placementManagerRef.current = placementManager;
      
      // Set camera for raycasting
      placementManager.setCamera(cameraRef.current!);
      
      // Initialize gallery items
      await placementManager.initialize();
      
      // Setup event listeners
      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleNativeKeyPress);
      
      // Initialize orbit controls for the camera
      const orbitControls = new OrbitControls(cameraRef.current!, canvasRef.current);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.05;
      orbitControls.minDistance = 3;
      orbitControls.maxDistance = 20;
      orbitControls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
      orbitControls.enabled = false; // Start with FPS controls
      orbitControlsRef.current = orbitControls;
      
      // Initialize animation loop
      startAnimationLoop();
      
      // Initialize minimap
      initializeMinimap();
      
      // Create info panel for artwork details
      createInfoPanel();
      
      // Mark as initialized
      isInitializedRef.current = true;
      
      // Show a welcome notification
      setTimeout(() => {
        showNotification(dict.gallery3d?.instructions || "Use WASD to move, mouse to look");
      }, 2000);
    } catch (error) {
      console.error("Error initializing gallery:", error);
      throw error;
    }
  };
  
  // Animation loop
  const startAnimationLoop = () => {
    const animate = (time: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return
      
      // Update controls based on view mode
      if (viewMode === 'firstPerson' && fpsControllerRef.current) {
        fpsControllerRef.current.update(time / 1000)
      } else if (viewMode === 'orbit' && orbitControlsRef.current) {
        orbitControlsRef.current.update()
      }
      
      // Update placement visibility based on camera position
      if (placementManagerRef.current && cameraRef.current) {
        // Calculate FOV in the horizontal direction
        const fovY = THREE.MathUtils.degToRad(cameraRef.current.fov)
        const fovX = 2 * Math.atan(Math.tan(fovY / 2) * cameraRef.current.aspect)
        
        placementManagerRef.current.update(
          cameraRef.current.position,
          playerPositionRef.current.angle,
          fovX
        )
      }
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      
      // Continue animation loop
      frameRef.current = requestAnimationFrame(animate)
    }
    
    frameRef.current = requestAnimationFrame(animate)
  }
  
  // Initialize minimap
  const initializeMinimap = () => {
    if (!minimapCanvasRef.current || !mapDataRef.current) return
    
    const ctx = minimapCanvasRef.current.getContext('2d')
    if (!ctx) return
    
    // Draw initial minimap
    drawMinimap()
  }
  
  // Draw/update minimap
  const updateMinimap = () => {
    if (!minimapCanvasRef.current || !mapDataRef.current) return
    drawMinimap()
  }
  
  // Draw minimap with player position and Hilbert curve walls
  const drawMinimap = () => {
    if (!minimapCanvasRef.current || !mapDataRef.current) return
    
    const ctx = minimapCanvasRef.current.getContext('2d')
    if (!ctx) return
    
    const { width, height } = minimapCanvasRef.current
    
    // Clear minimap
    ctx.fillStyle = '#f9e5c4'
    ctx.fillRect(0, 0, width, height)
    
    // Calculate scale and center point
    const mapSize = Math.pow(2, 6) * 8 // Based on our map settings
    const scale = width / (mapSize * 1.1) // Scale to fit with margin
    const centerX = width / 2
    const centerY = height / 2
    const offset = mapSize / 2 * scale
    
    // Draw walls
    ctx.strokeStyle = '#87431d'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    // Draw all wall segments from map data
    for (const segment of mapDataRef.current.placements) {
      const [p1, p2] = segment
      
      // Transform coordinates to minimap space
      const x1 = centerX - offset + p1[0] * scale
      const y1 = centerY - offset + p1[1] * scale
      const x2 = centerX - offset + p2[0] * scale
      const y2 = centerY - offset + p2[1] * scale
      
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
    }
    
    ctx.stroke()
    
    // Draw player position and direction
    const playerX = centerX - offset + playerPositionRef.current.x * scale
    const playerY = centerY - offset + playerPositionRef.current.z * scale
    
    // Draw player shadow
    ctx.beginPath()
    ctx.arc(playerX, playerY, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fill()
    
    // Draw player icon
    ctx.beginPath()
    ctx.arc(playerX, playerY, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#ff3333'
    ctx.fill()
    
    // Draw player direction with arrowhead
    const directionX = Math.sin(playerPositionRef.current.angle)
    const directionY = Math.cos(playerPositionRef.current.angle)
    
    ctx.beginPath()
    ctx.moveTo(playerX, playerY)
    ctx.lineTo(
      playerX + directionX * 12,
      playerY + directionY * 12
    )
    ctx.strokeStyle = '#ff3333'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw arrowhead
    const headlen = 6
    const angle = Math.atan2(directionY, directionX)
    
    ctx.beginPath()
    ctx.moveTo(
      playerX + directionX * 12,
      playerY + directionY * 12
    )
    ctx.lineTo(
      playerX + directionX * 12 - headlen * Math.cos(angle - Math.PI / 6),
      playerY + directionY * 12 - headlen * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      playerX + directionX * 12 - headlen * Math.cos(angle + Math.PI / 6),
      playerY + directionY * 12 - headlen * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fillStyle = '#ff3333'
    ctx.fill()
  }
  
  // Create info panel for artwork details
  const infoPanelRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const descriptionRef = useRef<HTMLParagraphElement | null>(null)
  
  const createInfoPanel = () => {
    // We're already using the reference div in the JSX
    // So no need to create an element, just initialize any listeners if needed
    
    // For artwork click handling, add to the PlacementManager
    if (placementManagerRef.current) {
      placementManagerRef.current.setArtworkClickHandler((item: GalleryItem) => {
        // Update info panel with artwork details
        if (infoPanelRef.current && titleRef.current && descriptionRef.current) {
          titleRef.current.textContent = item.title || '';
          descriptionRef.current.textContent = item.description || '';
          
          // Show the panel
          infoPanelRef.current.style.opacity = '1';
          infoPanelRef.current.style.pointerEvents = 'auto';
          
          // Hide after delay or add a close button
          setTimeout(() => {
            if (infoPanelRef.current) {
              infoPanelRef.current.style.opacity = '0';
              infoPanelRef.current.style.pointerEvents = 'none';
            }
          }, 5000);
        }
      });
    }
  }
  
  // Sound effects
  const footstepSoundRef = useRef<HTMLAudioElement | null>(null)
  const footstepRunSoundRef = useRef<HTMLAudioElement | null>(null)
  let lastFootstepTime = 0
  
  // Play footstep sound
  const playFootstep = (running = false) => {
    if (!footstepSoundRef.current) {
      // Create audio elements if they don't exist
      footstepSoundRef.current = new Audio('/sounds/footstep.mp3')
      footstepRunSoundRef.current = new Audio('/sounds/footstep_run.mp3')
    }
    
    const now = Date.now()
    const interval = running ? 250 : 400 // Faster footsteps when running
    
    // Only play footstep sound at appropriate intervals
    if (now - lastFootstepTime > interval) {
      if (running && footstepRunSoundRef.current) {
        footstepRunSoundRef.current.currentTime = 0
        footstepRunSoundRef.current.play().catch(e => console.log('Audio play error:', e))
      } else if (footstepSoundRef.current) {
        footstepSoundRef.current.currentTime = 0
        footstepSoundRef.current.play().catch(e => console.log('Audio play error:', e))
      }
      lastFootstepTime = now
    }
  }
  
  // Toggle between first-person and orbit view
  const toggleViewMode = () => {
    if (viewMode === 'firstPerson') {
      // Switch to orbit view
      if (fpsControllerRef.current) fpsControllerRef.current.enabled = false
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true
      setViewMode('orbit')
      
      // Show notification
      showNotification(dict.gallery3d.orbitMode || 'Orbit Mode')
    } else {
      // Switch to first-person view
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = false
      if (fpsControllerRef.current) fpsControllerRef.current.enabled = true
      setViewMode('firstPerson')
      
      // Show notification
      showNotification(dict.gallery3d.firstPersonMode || 'First Person Mode')
    }
  }
  
  // Show temporary notification to user
  const showNotification = (message: string) => {
    if (!notificationRef.current) return;
    
    // Update notification message
    notificationRef.current.textContent = message;
    
    // Show notification
    notificationRef.current.style.opacity = '1';
    notificationRef.current.style.pointerEvents = 'auto';
    
    // Hide after delay
    setTimeout(() => {
      if (notificationRef.current) {
        notificationRef.current.style.opacity = '0';
        notificationRef.current.style.pointerEvents = 'none';
      }
    }, 2000);
  }
  
  // Clean up all resources
  const cleanupGallery = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
    
    if (fpsControllerRef.current) {
      fpsControllerRef.current.dispose()
    }
    
    if (orbitControlsRef.current) {
      orbitControlsRef.current.dispose()
    }
    
    if (placementManagerRef.current) {
      placementManagerRef.current.dispose()
    }
    
    if (rendererRef.current && containerRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement)
      rendererRef.current.dispose()
    }
    
    if (infoPanelRef.current) {
      document.body.removeChild(infoPanelRef.current)
      infoPanelRef.current = null
    }
    
    // Remove event listeners
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('keydown', handleNativeKeyPress)
  }
  
  const handleStartExploring = () => {
    console.log("Start exploring clicked")
    
    // Hide instructions and show the 3D scene
    setShowInstructions(false)
    
    // If gallery is not already initialized, start the initialization process
    if (!isInitializedRef.current && !isRunningRef.current) {
      // Create gallery items with simplified image paths
      const galleryItems = [
        {
          id: "1",
          title: dict.gallery.titles?.tborida || "Moroccan Tborida Show",
          description: dict.gallery.artDescriptions?.tborida || "A festival celebrating the traditional Moroccan equestrian art of Tborida.",
          imagePath: "/images/art1.jpg",
        },
        {
          id: "2",
          title: dict.gallery.titles?.dress || "Moroccan Dress",
          description: dict.gallery.artDescriptions?.dress || "Traditional Moroccan dress.",
          imagePath: "/images/art2.jpg",
        },
        {
          id: "3", 
          title: dict.gallery.titles?.tiles || "Moroccan Tiles",
          description: dict.gallery.artDescriptions?.tiles || "Beautiful Moroccan geometric tiles.",
          imagePath: "/images/art3.jpg",
        }
      ]
      
      // Start initialization
      isRunningRef.current = true
      initializeGallery(galleryItems).catch(error => {
        console.error("Failed to initialize gallery:", error)
        setErrorState(true)
      })
    }
    
    // Focus the canvas for keyboard controls
    if (canvasRef.current) {
      canvasRef.current.focus()
    }
    
    // Show notification to help users
    showNotification(dict.gallery3d?.vKey || "Press V to toggle view mode")
  }
  
  return (
    <div ref={containerRef} className="relative w-full rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
      {errorState ? (
        <div className="flex flex-col items-center justify-center h-[600px] text-center p-4">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            {dict.gallery3d?.error || "Error loading gallery"}
          </h3>
          <p className="mb-4">
            {dict.gallery3d?.errorMessage || "There was a problem initializing the 3D gallery. Please try again later."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            {dict.gallery3d?.reload || "Reload"}
          </button>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className={`w-full h-[600px] ${showInstructions ? 'hidden' : 'block'}`}
            tabIndex={0}
            onKeyDown={handleKeyPress}
          />
          
          {showInstructions && (
            <div className="flex flex-col items-center justify-center h-[600px] text-center p-4">
              <h2 className="text-2xl font-bold mb-6">{dict.gallery3d?.instructions || "Interactive Moroccan Gallery"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white">
                    <span className="text-xl">W</span>
                  </div>
                  <p>{dict.gallery3d?.keyboardControls || "Use arrow keys or WASD to move around"}</p>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white">
                    <span className="text-xl">V</span>
                  </div>
                  <p>{dict.gallery3d?.vKey || "V to toggle between Orbit/First Person"}</p>
                </div>
              </div>
              
              <button
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
                onClick={handleStartExploring}
              >
                <span>{dict.gallery3d?.startExploring || "Start Exploring"}</span>
              </button>
            </div>
          )}
          
          {/* Minimap container */}
          <div 
            ref={minimapContainerRef}
            className={`absolute top-4 right-4 w-32 h-32 bg-background/70 backdrop-blur-sm rounded-md shadow-md overflow-hidden ${showInstructions ? 'hidden' : 'block'}`}
          >
            <canvas ref={minimapCanvasRef} className="w-full h-full" />
          </div>
          
          {/* Info panel for artwork details */}
          <div
            ref={infoPanelRef}
            className={`absolute left-4 bottom-4 w-72 p-3 bg-background/70 backdrop-blur-md rounded-md shadow-md transition-opacity duration-300 opacity-0 pointer-events-none`}
          >
            <h3 className="font-bold text-lg mb-1 text-primary" ref={titleRef}></h3>
            <p className="text-sm" ref={descriptionRef}></p>
          </div>
          
          {/* Notification panel */}
          <div
            ref={notificationRef}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-background/70 backdrop-blur-md rounded-md shadow-md transition-opacity duration-300 opacity-0 pointer-events-none"
          ></div>
        </>
      )}
    </div>
  )
} 