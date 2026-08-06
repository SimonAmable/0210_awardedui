"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

import { cloudsFragmentShader } from "./clouds-shader-background-source"

const vertexShader = `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`

export type CloudsShaderBackgroundProps = {
  className?: string
  animate?: boolean
}

export function CloudsShaderBackground({ className, animate = true }: CloudsShaderBackgroundProps) {
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
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, cloudsFragmentShader))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "Unable to link shader program.")
      gl.useProgram(program)
    } catch (error) {
      console.error("Clouds shader failed to compile.", error)
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const resolution = uniform("iResolution")
    const time = uniform("iTime")
    const timeDelta = uniform("iTimeDelta")
    const frameRate = uniform("iFrameRate")
    const frame = uniform("iFrame")
    const channelTime = uniform("iChannelTime")
    const channelResolution = uniform("iChannelResolution")
    const mouse = uniform("iMouse")
    const date = uniform("iDate")
    const sampleRate = uniform("iSampleRate")
    const pointer = { x: 0, y: 0, clickX: 0, clickY: 0 }
    let pointerDown = false
    let width = 1
    let height = 1
    let frameNumber = 0
    let lastTime = 0
    let animationFrame = 0

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

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = (event.clientX - rect.left) / rect.width * width
      pointer.y = (rect.bottom - event.clientY) / rect.height * height
    }
    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event)
      pointer.clickX = pointer.x
      pointer.clickY = pointer.y
      pointerDown = true
    }
    const onPointerMove = (event: PointerEvent) => updatePointer(event)
    const onPointerUp = () => { pointerDown = false }
    const setDate = (now: Date) => gl.uniform4f(date, now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())

    const render = (now: number) => {
      resize()
      const seconds = now * 0.001
      const delta = lastTime ? seconds - lastTime : 0
      lastTime = seconds
      gl.uniform3f(resolution, width, height, 1)
      gl.uniform1f(time, shouldAnimate ? seconds : 0)
      gl.uniform1f(timeDelta, delta)
      gl.uniform1f(frameRate, delta > 0 ? 1 / delta : 60)
      gl.uniform1i(frame, frameNumber)
      gl.uniform1fv(channelTime, new Float32Array([seconds, seconds, seconds, seconds]))
      gl.uniform3fv(channelResolution, new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
      gl.uniform4f(mouse, pointerDown ? pointer.x : 0, pointerDown ? pointer.y : 0, pointer.clickX, pointer.clickY)
      setDate(new Date())
      gl.uniform1f(sampleRate, 44100)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frameNumber += 1
      if (shouldAnimate) animationFrame = window.requestAnimationFrame(render)
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    animationFrame = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      if (buffer) gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [animate])

  return <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-sky-400", className)}><canvas ref={canvasRef} aria-label="Animated cloud shader background" className="absolute inset-0 h-full w-full touch-none" /></div>
}
