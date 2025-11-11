"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import * as THREE from "three"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Tank3DAdvancedProps {
  data: Array<Record<string, any>>
  metadata: Record<string, any>
}

function DataPointsCloud({ data, xCol, yCol, zCol }: any) {
  const pointsRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!pointsRef.current || data.length === 0) return

    const xValues = data.map((d: any) => {
      const val = d[xCol]
      return typeof val === "number" ? val : Number.parseFloat(val)
    })
    const yValues = data.map((d: any) => {
      const val = d[yCol]
      return typeof val === "number" ? val : Number.parseFloat(val)
    })
    const zValues = data.map((d: any) => {
      const val = d[zCol]
      return typeof val === "number" ? val : Number.parseFloat(val)
    })

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)
    const zMin = Math.min(...zValues)
    const zMax = Math.max(...zValues)

    const positions = new Float32Array(data.length * 3)
    const colors = new Float32Array(data.length * 3)

    data.forEach((_, idx: number) => {
      const x = (xValues[idx] - xMin) / (xMax - xMin || 1) - 0.5
      const y = (yValues[idx] - yMin) / (yMax - yMin || 1) - 0.5
      const z = (zValues[idx] - zMin) / (zMax - zMin || 1) - 0.5

      positions[idx * 3] = x
      positions[idx * 3 + 1] = y
      positions[idx * 3 + 2] = z

      const colorRatio = (zValues[idx] - zMin) / (zMax - zMin || 1)
      const hue = (1 - colorRatio) * 0.33 // Green to Red

      const color = new THREE.Color().setHSL(hue, 1, 0.5)
      colors[idx * 3] = color.r
      colors[idx * 3 + 1] = color.g
      colors[idx * 3 + 2] = color.b
    })

    if (pointsRef.current.geometry) {
      pointsRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      pointsRef.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    }
  }, [data, xCol, yCol, zCol])

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial size={0.02} vertexColors sizeAttenuation />
    </points>
  )
}

function TankScene({ data, xCol, yCol, zCol, showManholes, showWindGirders, showNoScan }: any) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 1.5]} />
      <OrbitControls enableZoom enablePan enableRotate />

      <gridHelper args={[1, 10]} />

      {/* Cylindrical tank body */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.8, 32]} />
        <meshPhongMaterial color="#e8f0f8" opacity={0.2} transparent wireframe />
      </mesh>

      {/* Zero point marker */}
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <Text position={[0.05, -0.4, 0]} fontSize={0.05} color="#ff0000">
        0
      </Text>

      {/* Data points cloud */}
      <DataPointsCloud data={data} xCol={xCol} yCol={yCol} zCol={zCol} />

      {/* Manhole markers */}
      {showManholes && (
        <mesh position={[0.3, 0.2, 0]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="#0000ff" />
        </mesh>
      )}

      {/* Wind girder markers */}
      {showWindGirders && (
        <mesh position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      )}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
    </>
  )
}

export function Tank3DAdvanced({ data, metadata }: Tank3DAdvancedProps) {
  const [showManholes, setShowManholes] = useState(true)
  const [showWindGirders, setShowWindGirders] = useState(true)
  const [showNoScan, setShowNoScan] = useState(true)
  const [columnInfo, setColumnInfo] = useState<{ xCol: string; yCol: string; zCol: string }>({
    xCol: "",
    yCol: "",
    zCol: "",
  })

  useEffect(() => {
    if (data.length === 0) return

    const keys = Object.keys(data[0])
    const findColumn = (keywords: string[]) => {
      return keys.find((k) => keywords.some((keyword) => k.toLowerCase().includes(keyword))) || keys[0]
    }

    const xCol = findColumn(["x", "x-coordinate", "x_coord"])
    const yCol = findColumn(["y", "y-coordinate", "y_coord", "height"])
    const zCol = findColumn(["z", "z-coordinate", "thickness", "depth"])

    setColumnInfo({ xCol, yCol, zCol })
  }, [data])

  if (data.length === 0 || !columnInfo.xCol) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No data available for 3D visualization</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Checkbox id="manholes" checked={showManholes} onCheckedChange={(checked) => setShowManholes(!!checked)} />
            <label htmlFor="manholes" className="text-sm text-foreground cursor-pointer">
              Manholes (Blue)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="girders"
              checked={showWindGirders}
              onCheckedChange={(checked) => setShowWindGirders(!!checked)}
            />
            <label htmlFor="girders" className="text-sm text-foreground cursor-pointer">
              Wind Girders (Yellow)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="noscan" checked={showNoScan} onCheckedChange={(checked) => setShowNoScan(!!checked)} />
            <label htmlFor="noscan" className="text-sm text-foreground cursor-pointer">
              No-Scan Areas (Gray)
            </label>
          </div>
        </div>

        <div className="w-full h-96 rounded-lg border border-border overflow-hidden">
          <Canvas>
            <TankScene
              data={data}
              xCol={columnInfo.xCol}
              yCol={columnInfo.yCol}
              zCol={columnInfo.zCol}
              showManholes={showManholes}
              showWindGirders={showWindGirders}
              showNoScan={showNoScan}
            />
          </Canvas>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded text-sm text-muted-foreground">
          <p>
            X: {columnInfo.xCol} • Y: {columnInfo.yCol} • Z: {columnInfo.zCol}
          </p>
          <p className="mt-2">Color gradient: Green (high) → Red (low) based on {columnInfo.zCol}</p>
        </div>
      </Card>
    </div>
  )
}
