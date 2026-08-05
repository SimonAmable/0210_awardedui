"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const vertexShader = `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.,1.); }`

const defaultColors = ["#000000", "#00FF37", "#B6FF41", "#000000"]
const defaultOffset = { x: 0, y: 0 }

const fragmentShader = `precision highp float;
uniform vec2 u_resolution,u_pointer,u_velocity,u_offset;
uniform float u_time,u_intensity,u_zoom,u_warp,u_contrast,u_speed,u_grain,u_drift,u_animate,u_reverse,u_rotate,u_seed,u_smooth_blend,u_cursor_on,u_cursor_effect,u_cursor_strength,u_cursor_radius,u_style;
uniform vec3 u_colors[8];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.55;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+4.1;a*=.5;}return v;}
vec3 gradient(float t){t=clamp(t,0.,.999);float x=t*7.;int i=int(floor(x));float f=fract(x);if(u_smooth_blend>.5)f=f*f*(3.-2.*f);if(i==0)return mix(u_colors[0],u_colors[1],f);if(i==1)return mix(u_colors[1],u_colors[2],f);if(i==2)return mix(u_colors[2],u_colors[3],f);if(i==3)return mix(u_colors[3],u_colors[4],f);if(i==4)return mix(u_colors[4],u_colors[5],f);if(i==5)return mix(u_colors[5],u_colors[6],f);return mix(u_colors[6],u_colors[7],f);}
void main(){vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;vec2 p=uv*u_zoom+u_offset;float time=u_time*u_speed*.16*u_animate*(u_reverse>.5?-1.:1.);p+=vec2(sin(time*.7),cos(time*.53))*u_drift*.55+u_seed*.001;p=mat2(cos(u_rotate),-sin(u_rotate),sin(u_rotate),cos(u_rotate))*p;p+=vec2(sin(p.y*3.+time),cos(p.x*3.-time))*u_warp*.16;float d=length(uv-u_pointer);if(u_cursor_on>.5){float influence=smoothstep(u_cursor_radius,0.,d)*u_cursor_strength;vec2 dir=normalize(uv-u_pointer+.0001);if(u_cursor_effect<.5)p+=u_velocity*influence*1.8;else if(u_cursor_effect<1.5)p+=dir*influence*.65;else if(u_cursor_effect<2.5){float a=influence*4.;p=mat2(cos(a),-sin(a),sin(a),cos(a))*p;}else p+=dir*sin(d*32.-time*8.)*influence*.14;}float v;if(u_style<.5){float a=fbm(p*1.45+vec2(time*.11,-time*.06));float b=fbm(p*3.1-vec2(time*.07,time*.12));v=smoothstep(.22,.83,a*.72+b*.42);}else{vec2 c=p*5.;c+=vec2(sin(c.y+time*.55),sin(c.x-time*.42))*.42;v=pow(abs(sin(c.x+sin(c.y))*sin(c.y+sin(c.x))),.28);}v=mix(.5,v,u_intensity);v=pow(max(v,.001),1.3-u_contrast*.65);vec3 color=gradient(v);color+=(hash(gl_FragCoord.xy)-.5)*u_grain;gl_FragColor=vec4(color,1.);}`

export interface SmokeShaderBackgroundProps {
  colors?: string[]
  style?: "smoke" | "caustics"
  intensity?: number
  zoom?: number
  warp?: number
  contrast?: number
  speed?: number
  grain?: number
  drift?: number
  animate?: boolean
  reverse?: boolean
  rotation?: number
  offset?: { x: number; y: number }
  seed?: number
  smoothBlend?: boolean
  cursor?: boolean
  cursorEffect?: "velocity" | "repel" | "swirl" | "ripple"
  cursorStrength?: number
  cursorRadius?: number
  className?: string
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "")
  const number = Number.parseInt(value.length === 3 ? value.split("").map((part) => part + part).join("") : value, 16)
  return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255]
}

export function SmokeShaderBackground({ colors = defaultColors, style = "smoke", intensity = 100, zoom = 50, warp = 50, contrast = 25, speed = 33, grain = 74, drift = 0, animate = true, reverse = false, rotation = 0, offset = defaultOffset, seed = 0, smoothBlend = false, cursor = false, cursorEffect = "velocity", cursorStrength = 50, cursorRadius = 50, className }: SmokeShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false })
    if (!gl) return
    const shouldAnimate = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); return shader }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader)); gl.linkProgram(program); gl.useProgram(program)
    const position = gl.getAttribLocation(program, "a_position")
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const pointer = { x: 0, y: 0, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 }
    const effect = ["velocity", "repel", "swirl", "ripple"].indexOf(cursorEffect)
    const palette = Array.from({ length: 8 }, (_, index) => hexToRgb(colors[index % colors.length] ?? "#000000")).flat()
    let frame = 0; let visible = true; let width = 0; let height = 0
    const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 2); width = Math.max(1, Math.floor(canvas.clientWidth * ratio)); height = Math.max(1, Math.floor(canvas.clientHeight * ratio)); if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height) } }
    const onPointerMove = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = .5 - (event.clientY - rect.top) / rect.height; pointer.velocityX = x - pointer.lastX; pointer.velocityY = y - pointer.lastY; pointer.lastX = x; pointer.lastY = y; pointer.x = x; pointer.y = y }
    const render = (now: number) => { if (!visible || document.hidden) return; resize(); gl.uniform2f(uniform("u_resolution"), width, height); gl.uniform1f(uniform("u_time"), now * .001); gl.uniform2f(uniform("u_pointer"), pointer.x, pointer.y); gl.uniform2f(uniform("u_velocity"), pointer.velocityX, pointer.velocityY); gl.uniform3fv(uniform("u_colors"), palette); gl.uniform1f(uniform("u_style"), style === "smoke" ? 0 : 1); gl.uniform1f(uniform("u_intensity"), intensity / 100); gl.uniform1f(uniform("u_zoom"), .5 + zoom / 50); gl.uniform1f(uniform("u_warp"), warp / 100); gl.uniform1f(uniform("u_contrast"), contrast / 100); gl.uniform1f(uniform("u_speed"), speed / 100); gl.uniform1f(uniform("u_grain"), grain / 100); gl.uniform1f(uniform("u_drift"), drift / 100); gl.uniform1f(uniform("u_animate"), shouldAnimate ? 1 : 0); gl.uniform1f(uniform("u_reverse"), reverse ? 1 : 0); gl.uniform1f(uniform("u_rotate"), rotation * Math.PI / 180); gl.uniform1f(uniform("u_seed"), seed); gl.uniform1f(uniform("u_smooth_blend"), smoothBlend ? 1 : 0); gl.uniform2f(uniform("u_offset"), offset.x / 100, offset.y / 100); gl.uniform1f(uniform("u_cursor_on"), cursor ? 1 : 0); gl.uniform1f(uniform("u_cursor_effect"), Math.max(0, effect)); gl.uniform1f(uniform("u_cursor_strength"), cursorStrength / 100); gl.uniform1f(uniform("u_cursor_radius"), .05 + cursorRadius / 100); gl.drawArrays(gl.TRIANGLES, 0, 3); pointer.velocityX *= .9; pointer.velocityY *= .9; frame = requestAnimationFrame(render) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !frame) frame = requestAnimationFrame(render); if (!visible) { cancelAnimationFrame(frame); frame = 0 } })
    const pointerTarget = canvas.parentElement ?? canvas
    observer.observe(canvas); pointerTarget.addEventListener("pointermove", onPointerMove); const onVisibility = () => { if (!document.hidden && visible && !frame) frame = requestAnimationFrame(render) }; document.addEventListener("visibilitychange", onVisibility); frame = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); pointerTarget.removeEventListener("pointermove", onPointerMove); document.removeEventListener("visibilitychange", onVisibility); gl.deleteProgram(program); gl.deleteBuffer(buffer) }
  }, [animate, colors, contrast, cursor, cursorEffect, cursorRadius, cursorStrength, drift, grain, intensity, offset, reverse, rotation, seed, smoothBlend, speed, style, warp, zoom])
  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />
}
