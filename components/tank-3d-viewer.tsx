"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface Tank3DViewerProps {
  showGrid: boolean
  showCompass: boolean
  tankData?: {
    diameter?: number
    height?: number
    defects?: Array<{ x: number; y: number; z: number; thickness: number }>
  }
}

export function Tank3DViewer({ showGrid, showCompass, tankData }: Tank3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!containerRef.current || isInitialized) return

    const width = containerRef.current.clientWidth
    const heightValue = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, width / heightValue, 0.1, 1000)
    camera.position.set(0, 15, 30)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, heightValue)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)

    const diameter = tankData?.diameter || 25.6
    const height = tankData?.height || 18.2
    const geometry = new THREE.CylinderGeometry(diameter / 2, diameter / 2, height, 32)
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      metalness: 0.3,
      roughness: 0.7,
    })
    const tank = new THREE.Mesh(geometry, material)
    scene.add(tank)

    if (showGrid) {
      const gridHelper = new THREE.GridHelper(50, 10, 0xcccccc, 0xeeeeee)
      scene.add(gridHelper)
    }

    if (showCompass) {
      const axesHelper = new THREE.AxesHelper(15)
      scene.add(axesHelper)
    }

    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !tank) return

      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y

      if (e.button === 0) {
        // Left-click: rotate
        tank.rotation.y += deltaX * 0.01
        tank.rotation.x += deltaY * 0.01
      } else if (e.button === 2) {
        // Right-click: pan camera
        const distance = camera.position.length()
        camera.position.x -= (deltaX * distance) / heightValue
        camera.position.y += (deltaY * distance) / heightValue
      }

      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const direction = camera.position.clone().normalize()
      const distance = camera.position.length()
      const newDistance = Math.max(5, Math.min(100, distance + e.deltaY * 0.1))
      camera.position.copy(direction.multiplyScalar(newDistance))
    }

    renderer.domElement.addEventListener("mousedown", onMouseDown)
    renderer.domElement.addEventListener("mousemove", onMouseMove)
    renderer.domElement.addEventListener("mouseup", onMouseUp)
    renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault())
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false })

    if (tankData?.defects && tankData.defects.length > 0) {
      tankData.defects.forEach((defect) => {
        const pointGeometry = new THREE.SphereGeometry(0.3, 8, 8)
        const thickness = defect.thickness || 5
        const normalizedThickness = Math.min(1, Math.max(0, (thickness - 2) / 8))
        const hue = (1 - normalizedThickness) * 240
        const color = new THREE.Color()
        color.setHSL(hue / 360, 1, 0.5)
        const pointMaterial = new THREE.MeshStandardMaterial({ color })
        const point = new THREE.Mesh(pointGeometry, pointMaterial)
        point.position.set(defect.x, defect.z, defect.y)
        scene.add(point)
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    setIsInitialized(true)

    return () => {
      renderer.domElement.removeEventListener("mousedown", onMouseDown)
      renderer.domElement.removeEventListener("mousemove", onMouseMove)
      renderer.domElement.removeEventListener("mouseup", onMouseUp)
      renderer.domElement.removeEventListener("wheel", onWheel)
      renderer.dispose()
    }
  }, [isInitialized, tankData, showGrid, showCompass])

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <div ref={containerRef} className="w-full h-full" style={{ touchAction: "none" }} />
}
