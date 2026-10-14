"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BjorkShaderAvatarProps extends React.ComponentProps<"div"> {
  initials?: string;
  label?: string;
  size?: number;
  animated?: boolean;
}

// Adapted from the supplied Bjork avatar. Wundu blue and gold are also the
// static fallback, so devices without WebGL still show the same identity.
export const BjorkShaderAvatar = React.memo(function BjorkShaderAvatar({
  initials = "",
  label = "Wundu IA",
  size = 76,
  animated = true,
  className,
  style,
  ...props
}: BjorkShaderAvatarProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [contextVersion, setContextVersion] = React.useState(0);
  const reduced = useReducedMotion();
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animated) return;
    // Keep the last frame when focus/keyboard changes trigger browser compositing.
    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    if (!gl) return;
    canvas.style.opacity = "1";
    let frame = 0,
      disposed = false,
      visible = true;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram(),
      buffer = gl.createBuffer();
    function cleanup() {
      disposed = true;
      cancelAnimationFrame(frame);
      if (program) gl!.deleteProgram(program);
      if (buffer) gl!.deleteBuffer(buffer);
      shaders.forEach((s) => gl!.deleteShader(s));
    }
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
    }
    const vertex = compile(
      gl.VERTEX_SHADER,
      "attribute vec2 position;varying vec2 vUv;void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}",
    );
    const fragment = compile(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      varying vec2 vUv;uniform float time;
      void main(){vec2 uv=vUv*2.-1.;float radius=length(uv);
        float wave=sin(uv.x*3.4+time*.45)+cos(uv.y*4.2-time*.38);
        float ring=sin(radius*9.-time*.72);
        vec3 blue=vec3(.02,.24,.77),deep=vec3(.015,.07,.43),gold=vec3(.98,.86,.20);
        vec3 color=mix(deep,blue,smoothstep(-1.4,1.8,wave+ring*.35));
        color=mix(color,gold,smoothstep(1.45,1.95,wave+ring*.5));
        float shine=(1.-smoothstep(0.,.75,length(uv-vec2(-.3,.4))));
        color+=vec3(.08,.14,.2)*shine;
        gl_FragColor=vec4(color*(1.-radius*.18),(1.-smoothstep(.98,1.,radius)));}`,
    );
    if (!vertex || !fragment || !program || !buffer) {
      cleanup();
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      cleanup();
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position"),
      time = gl.getUniformLocation(program, "time");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const started = performance.now();
    function render(now: number) {
      if (disposed || !visible || document.hidden) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2),
        width = Math.max(1, Math.round(canvas!.clientWidth * ratio)),
        height = Math.max(1, Math.round(canvas!.clientHeight * ratio));
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        gl!.viewport(0, 0, width, height);
      }
      gl!.uniform1f(time, reduced ? 0.9 : (now - started) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      if (!reduced) frame = requestAnimationFrame(render);
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      cancelAnimationFrame(frame);
      if (visible) render(performance.now());
    });
    observer.observe(canvas);
    const wake = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) render(performance.now());
    };
    const lost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      canvas.style.opacity = "0";
    };
    const restored = () => setContextVersion((version) => version + 1);
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      render(performance.now());
    });
    resize.observe(canvas);
    document.addEventListener("visibilitychange", wake);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    render(performance.now());
    return () => {
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", wake);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      cleanup();
    };
  }, [animated, reduced, contextVersion]);
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "wundu-ai-avatar relative grid shrink-0 place-items-center overflow-hidden rounded-full",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <canvas aria-hidden ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <span className="relative z-10 text-white">{initials}</span>
    </div>
  );
});
export { BjorkShaderAvatar as WunduAIAvatar };
export default BjorkShaderAvatar;
