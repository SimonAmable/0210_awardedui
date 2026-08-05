"use client"

import { useEffect, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"

import { defaultOffset, hexToRgb, resolvePalette, shaderVertexShader, type ShaderBackgroundProps } from "./shader-utils"

const causticsFragmentShader = `precision highp float;
uniform vec2 u_resolution,u_pointer,u_velocity,u_offset;
uniform float u_time,u_intensity,u_zoom,u_warp,u_contrast,u_speed,u_grain,u_drift,u_animate,u_reverse,u_rotate,u_seed,u_smooth_blend,u_cursor_on,u_cursor_effect,u_cursor_strength,u_cursor_radius;
uniform vec3 u_colors[8];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
vec3 gradient(float t){t=clamp(t,0.,.999);float x=t*7.;int i=int(floor(x));float f=fract(x);if(u_smooth_blend>.5)f=f*f*(3.-2.*f);if(i==0)return mix(u_colors[0],u_colors[1],f);if(i==1)return mix(u_colors[1],u_colors[2],f);if(i==2)return mix(u_colors[2],u_colors[3],f);if(i==3)return mix(u_colors[3],u_colors[4],f);if(i==4)return mix(u_colors[4],u_colors[5],f);if(i==5)return mix(u_colors[5],u_colors[6],f);return mix(u_colors[6],u_colors[7],f);}
float causticField(vec2 p,float time){vec2 wave=p*4.4;wave+=vec2(sin(wave.y*1.7+time*.75),cos(wave.x*1.35-time*.6))*.42*u_warp;float primary=sin(wave.x+sin(wave.y*1.4+time*.45));float secondary=sin(wave.y+sin(wave.x*1.25-time*.35));float crossing=sin((wave.x+wave.y)*.7+time*.22);return abs(primary*secondary+.35*crossing);}
void main(){vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;vec2 p=uv*u_zoom+u_offset;float time=u_time*u_speed*.16*u_animate*(u_reverse>.5?-1.:1.);p+=vec2(sin(time*.32),cos(time*.27))*u_drift*.7+u_seed*.001;p=mat2(cos(u_rotate),-sin(u_rotate),sin(u_rotate),cos(u_rotate))*p;float d=length(uv-u_pointer);if(u_cursor_on>.5){float influence=smoothstep(u_cursor_radius,0.,d)*u_cursor_strength;vec2 dir=normalize(uv-u_pointer+.0001);if(u_cursor_effect<.5)p+=u_velocity*influence*1.5;else if(u_cursor_effect<1.5)p+=dir*influence*.55;else if(u_cursor_effect<2.5){float a=influence*3.;p=mat2(cos(a),-sin(a),sin(a),cos(a))*p;}else p+=dir*sin(d*28.-time*7.)*influence*.18;}float field=causticField(p,time);float v=1.-smoothstep(.05,.78,field);v=pow(v,.65+u_contrast*.5);v=mix(.5,v,u_intensity);vec3 color=gradient(v);color+=(hash(gl_FragCoord.xy+u_seed)-.5)*u_grain;gl_FragColor=vec4(color,1.);}`

export type CausticsShaderBackgroundProps = ShaderBackgroundProps

export function CausticsShaderBackground({ colors, preset = "caustics", intensity = 100, zoom = 50, warp = 50, contrast = 25, speed = 33, grain = 74, drift = 0, animate = true, reverse = false, rotation = 0, offset = defaultOffset, seed = 0, smoothBlend = false, cursor = false, cursorEffect = "velocity", cursorStrength = 50, cursorRadius = 50, className }: CausticsShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paletteColors = useMemo(() => resolvePalette(colors, preset), [colors, preset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false })
    if (!gl) return
    const shouldAnimate = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); return shader }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, shaderVertexShader)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, causticsFragmentShader)); gl.linkProgram(program); gl.useProgram(program)
    const position = gl.getAttribLocation(program, "a_position")
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const pointer = { x: 0, y: 0, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 }
    const effect = ["velocity", "repel", "swirl", "ripple"].indexOf(cursorEffect)
    const palette = Array.from({ length: 8 }, (_, index) => hexToRgb(paletteColors[index % paletteColors.length] ?? "#000000")).flat()
    let frame = 0; let visible = true; let width = 0; let height = 0
    const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 2); width = Math.max(1, Math.floor(canvas.clientWidth * ratio)); height = Math.max(1, Math.floor(canvas.clientHeight * ratio)); if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height) } }
    const onPointerMove = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = .5 - (event.clientY - rect.top) / rect.height; pointer.velocityX = x - pointer.lastX; pointer.velocityY = y - pointer.lastY; pointer.lastX = x; pointer.lastY = y; pointer.x = x; pointer.y = y }
    const render = (now: number) => { if (!visible || document.hidden) return; resize(); gl.uniform2f(uniform("u_resolution"), width, height); gl.uniform1f(uniform("u_time"), now * .001); gl.uniform2f(uniform("u_pointer"), pointer.x, pointer.y); gl.uniform2f(uniform("u_velocity"), pointer.velocityX, pointer.velocityY); gl.uniform3fv(uniform("u_colors"), palette); gl.uniform1f(uniform("u_intensity"), intensity / 100); gl.uniform1f(uniform("u_zoom"), .5 + zoom / 50); gl.uniform1f(uniform("u_warp"), warp / 100); gl.uniform1f(uniform("u_contrast"), contrast / 100); gl.uniform1f(uniform("u_speed"), speed / 100); gl.uniform1f(uniform("u_grain"), grain / 100); gl.uniform1f(uniform("u_drift"), drift / 100); gl.uniform1f(uniform("u_animate"), shouldAnimate ? 1 : 0); gl.uniform1f(uniform("u_reverse"), reverse ? 1 : 0); gl.uniform1f(uniform("u_rotate"), rotation * Math.PI / 180); gl.uniform1f(uniform("u_seed"), seed); gl.uniform1f(uniform("u_smooth_blend"), smoothBlend ? 1 : 0); gl.uniform2f(uniform("u_offset"), offset.x / 100, offset.y / 100); gl.uniform1f(uniform("u_cursor_on"), cursor ? 1 : 0); gl.uniform1f(uniform("u_cursor_effect"), Math.max(0, effect)); gl.uniform1f(uniform("u_cursor_strength"), cursorStrength / 100); gl.uniform1f(uniform("u_cursor_radius"), .05 + cursorRadius / 100); gl.drawArrays(gl.TRIANGLES, 0, 3); pointer.velocityX *= .9; pointer.velocityY *= .9; frame = requestAnimationFrame(render) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !frame) frame = requestAnimationFrame(render); if (!visible) { cancelAnimationFrame(frame); frame = 0 } })
    const pointerTarget = canvas.parentElement ?? canvas
    observer.observe(canvas); pointerTarget.addEventListener("pointermove", onPointerMove); const onVisibility = () => { if (!document.hidden && visible && !frame) frame = requestAnimationFrame(render) }; document.addEventListener("visibilitychange", onVisibility); frame = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); pointerTarget.removeEventListener("pointermove", onPointerMove); document.removeEventListener("visibilitychange", onVisibility); gl.deleteProgram(program); gl.deleteBuffer(buffer) }
  }, [animate, contrast, cursor, cursorEffect, cursorRadius, cursorStrength, drift, grain, intensity, offset, paletteColors, reverse, rotation, seed, smoothBlend, speed, warp, zoom])

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />
}
