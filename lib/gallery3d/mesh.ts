// Mesh generation for Gallery3D
// Adapted from https://github.com/ClementCariou/virtual-art-gallery

import * as THREE from 'three'
import { MapData } from './map'

// Load textures with proper settings and fallback handling
async function loadTexture(path: string): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      path, 
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(8, 8)
        resolve(texture)
      },
      undefined, // onProgress not used
      (error) => {
        console.warn(`Failed to load texture from ${path}:`, error)
        // Create fallback texture (plain color)
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Use different colors for wall vs floor textures
          let color = path.includes('floor') ? '#a39076' : '#e0d9cf'
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 256, 256)
          
          // Add some texture pattern
          if (path.includes('wall')) {
            ctx.strokeStyle = '#d3c7b8'
            for (let i = 0; i < 10; i++) {
              ctx.beginPath()
              ctx.moveTo(0, i * 25)
              ctx.lineTo(256, i * 25)
              ctx.stroke()
            }
          } else {
            // Floor pattern
            ctx.strokeStyle = '#8d7b64'
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                ctx.strokeRect(i * 32, j * 32, 32, 32)
              }
            }
          }
        }
        
        const texture = new THREE.CanvasTexture(canvas)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(8, 8)
        resolve(texture)
      }
    )
  })
}

export interface MeshGenerationOptions {
  wallTexturePath?: string
  floorTexturePath?: string
  useReflection?: boolean
}

// Shader for the walls and floor
const fragmentShader = `
  precision lowp float;
  varying vec3 v_pos, v_normal;
  uniform sampler2D wallTexture;
  uniform sampler2D floorTexture;
  uniform float useReflection;

  vec3 hue2rgb(float h) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
    return mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), 0.08);
  }

  void main() {
    vec3 totalLight = texture2D(wallTexture, vec2(v_pos.x + v_pos.z, 7.0-v_pos.y)/8.0).rgb;
    
    // Apply ceiling color
    totalLight = mix(totalLight, vec3(90.0,92.0,95.0)/255.0, step(6.99, v_pos.y));
    
    // Apply ambient occlusion effect
    totalLight *= mix(0.7, 1.0, smoothstep(0.1, 0.12, v_pos.y));
    
    // Apply lighting variation based on wall orientation
    totalLight *= abs(v_normal.x)/64.0 + 1.0;
    
    // Apply floor texture
    if(v_normal.y > 0.0) {
      totalLight = 0.47+0.1*texture2D(floorTexture, v_pos.xz / 8.0).rgb;
    }
    
    // Apply color variation based on position
    totalLight *= (0.5 + 0.5*hue2rgb(0.5 + (v_pos.x + v_pos.z) / 160.0));
    
    // Calculate alpha for reflection
    float alpha = useReflection > 0.5 ? (.98+smoothstep(150.,0.,length(v_pos))-v_normal.y) : 1.0;
    
    gl_FragColor = vec4(totalLight, alpha);
  }
`

const vertexShader = `
  precision highp float;
  varying vec3 v_pos, v_normal;
  uniform float yScale;
  
  void main() {
    v_pos = position;
    v_normal = normal;
    vec3 pos = position;
    pos.y *= yScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export async function createGalleryMeshes(
  mapData: MapData, 
  options: MeshGenerationOptions = {}
): Promise<{
  mainMesh: THREE.Mesh,
  reflectionMesh: THREE.Mesh | null
}> {
  const {
    wallTexturePath = '/textures/wall.jpg',
    floorTexturePath = '/textures/floor.jpg',
    useReflection = true
  } = options

  // Load textures
  const [wallTexture, floorTexture] = await Promise.all([
    loadTexture(wallTexturePath),
    loadTexture(floorTexturePath)
  ])

  // Create geometry from map data
  const geometry = new THREE.BufferGeometry()
  
  // Add positions
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(mapData.position.flat(), 3)
  )
  
  // Add normals
  geometry.setAttribute(
    'normal',
    new THREE.Float32BufferAttribute(mapData.normal.flat(), 3)
  )
  
  // Add triangle indices
  geometry.setIndex(mapData.elements)

  // Create material with custom shaders
  const createMaterial = (yScale: number) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        wallTexture: { value: wallTexture },
        floorTexture: { value: floorTexture },
        yScale: { value: yScale },
        useReflection: { value: useReflection ? 1.0 : 0.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: useReflection,
      side: yScale === 1 ? THREE.BackSide : THREE.FrontSide
    })
  }

  // Create main mesh
  const material = createMaterial(1)
  const mainMesh = new THREE.Mesh(geometry, material)

  // Create reflection mesh if enabled
  let reflectionMesh = null
  if (useReflection) {
    const reflectionMaterial = createMaterial(-1)
    reflectionMesh = new THREE.Mesh(geometry, reflectionMaterial)
  }

  return {
    mainMesh,
    reflectionMesh
  }
}

// Create the meshes for artwork frames and handle placement
export interface ArtworkPlacement {
  x: number
  y: number
  z: number
  width: number
  height: number
  angle: number
  metadata: any
}

export function createFrameMesh(
  width: number, 
  height: number, 
  depth: number = 0.05,
  frameBorderSize: number = 0.1,
  frameColor: number = 0x5c4033
): THREE.Group {
  const group = new THREE.Group()
  
  // Create frame
  const frameGeometry = new THREE.BoxGeometry(
    width + frameBorderSize * 2, 
    height + frameBorderSize * 2, 
    depth
  )
  
  const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: frameColor,
    roughness: 0.5,
    metalness: 0.2 
  })
  
  const frame = new THREE.Mesh(frameGeometry, frameMaterial)
  frame.castShadow = true
  group.add(frame)
  
  // Create inner area for artwork
  const innerGeometry = new THREE.PlaneGeometry(width, height)
  const innerMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    side: THREE.FrontSide
  })
  
  const inner = new THREE.Mesh(innerGeometry, innerMaterial)
  inner.position.z = depth / 2 + 0.001 // Slightly in front of frame
  group.add(inner)
  
  return group
} 