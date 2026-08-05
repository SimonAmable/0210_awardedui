"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { imposterSyndromeFragmentShader } from "./imposter-syndrome-shader-source"

const vertexShader = `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`

type ImposterSyndromeShaderProps = {
  className?: string
  animate?: boolean
}

function createNoiseTexture(gl: WebGL2RenderingContext) {
  const size = 256
  const data = new Uint8Array(size * size * 4)
  for (let index = 0; index < size * size; index += 1) {
    const value = Math.floor((Math.sin(index * 12.9898) * 43758.5453 % 1 + 1) % 1 * 255)
    const offset = index * 4
    data[offset] = value
    data[offset + 1] = (value * 1.7) % 255
    data[offset + 2] = value
    data[offset + 3] = 255
  }
  return { width: size, height: size, data }
}

function createMoonTexture() {
  const size = 256
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x + 0.5) / size * 2 - 1
      const dy = (y + 0.5) / size * 2 - 1
      const distance = Math.sqrt(dx * dx + dy * dy)
      const crater = Math.sin((dx * 9.7 + dy * 4.3) * Math.PI) * 0.08 + Math.sin((dx * 21.2 - dy * 13.1) * Math.PI) * 0.04
      const value = distance < 1 ? Math.max(0, 210 - distance * 100 + crater * 255) : 0
      const offset = (y * size + x) * 4
      data[offset] = value
      data[offset + 1] = value
      data[offset + 2] = value
      data[offset + 3] = 255
    }
  }
  return { width: size, height: size, data }
}

function createBackgroundTexture() {
  const size = 256
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y += 1) {
    const position = y / (size - 1)
    const isOcean = position > 0.58
    for (let x = 0; x < size; x += 1) {
      const shimmer = Math.sin(x * 0.35 + y * 0.12) * 4
      const offset = (y * size + x) * 4
      data[offset] = isOcean ? 18 + shimmer : 55 + position * 25
      data[offset + 1] = isOcean ? 38 + shimmer : 55 + position * 20
      data[offset + 2] = isOcean ? 46 + shimmer : 66 + position * 20
      data[offset + 3] = 255
    }
  }
  return { width: size, height: size, data }
}

function createTexture(gl: WebGL2RenderingContext, textureData: { width: number; height: number; data: Uint8Array }) {
  const texture = gl.createTexture()
  if (!texture) return null
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData.width, textureData.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureData.data)
  return texture
}

export function ImposterSyndromeShader({ className, animate = true }: ImposterSyndromeShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext("webgl2", { alpha: false, antialias: false })
    if (!canvas || !gl) return
    const shouldAnimate = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error("Unable to create shader.")
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error."
        gl.deleteShader(shader)
        throw new Error(message)
      }
      return shader
    }

    let program: WebGLProgram
    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, imposterSyndromeFragmentShader))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "Unable to link shader program.")
      gl.useProgram(program)
    } catch (error) {
      console.error("Imposter Syndrome shader failed to compile.", error)
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const noise = createTexture(gl, createNoiseTexture(gl))
    const moon = createTexture(gl, createMoonTexture())
    const background = createTexture(gl, createBackgroundTexture())
    const black = createTexture(gl, { width: 1, height: 1, data: new Uint8Array([0, 0, 0, 255]) })
    const textures = [noise, moon, background, black]
    const channelResolution = new Float32Array([256, 256, 1, 256, 256, 1, 256, 256, 1, 1, 1, 1])
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const resolution = uniform("iResolution")
    const time = uniform("iTime")
    const timeDelta = uniform("iTimeDelta")
    const frameRate = uniform("iFrameRate")
    const frame = uniform("iFrame")
    const channelTime = uniform("iChannelTime")
    const channelRes = uniform("iChannelResolution")
    const mouse = uniform("iMouse")
    const pointer = { x: 0, y: 0 }
    let pointerInitialized = false
    let width = 1
    let height = 1
    let frameNumber = 0
    let lastTime = 0
    let animationFrame = 0

    textures.forEach((texture, index) => {
      gl.activeTexture(gl.TEXTURE0 + index)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(uniform(`iChannel${index}`), index)
    })

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
      height = Math.max(1, Math.floor(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = (event.clientX - rect.left) / rect.width * width
      pointer.y = (rect.bottom - event.clientY) / rect.height * height
      pointerInitialized = true
    }

    const render = (now: number) => {
      resize()
      if (!pointerInitialized) {
        pointer.x = width * 0.58
        pointer.y = height * 0.62
        pointerInitialized = true
      }
      const seconds = now * 0.001
      const delta = lastTime ? seconds - lastTime : 0
      lastTime = seconds
      gl.uniform3f(resolution, width, height, 1)
      gl.uniform1f(time, shouldAnimate ? seconds : 10)
      gl.uniform1f(timeDelta, delta)
      gl.uniform1f(frameRate, delta > 0 ? 1 / delta : 60)
      gl.uniform1i(frame, frameNumber)
      gl.uniform1fv(channelTime, new Float32Array([seconds, seconds, seconds, seconds]))
      gl.uniform3fv(channelRes, channelResolution)
      gl.uniform4f(mouse, pointer.x, pointer.y, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frameNumber += 1
      if (shouldAnimate) animationFrame = window.requestAnimationFrame(render)
    }

    canvas.addEventListener("pointermove", onPointerMove)
    animationFrame = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      canvas.removeEventListener("pointermove", onPointerMove)
      textures.forEach((texture) => { if (texture) gl.deleteTexture(texture) })
      if (buffer) gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [animate])

  return <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-black", className)}><canvas ref={canvasRef} aria-label="Interactive Imposter Syndrome sky shader" className="absolute inset-0 h-full w-full" /></div>
}
