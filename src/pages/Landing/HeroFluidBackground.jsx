import { useEffect, useRef } from 'react';

/**
 * Real-time WebGL fluid simulation for the hero background.
 *
 * Brass ink swirling on cream paper. The cursor leaves bleeding trails as
 * it moves, scroll perturbs the fluid downward, and everything decays back
 * to nothing so the screen never fully fills up. ~512×288 simulation
 * buffers, displayed full-canvas. Targets 60fps on integrated GPUs.
 *
 * Fallback: if WebGL or float textures aren't available, the parent renders
 * the existing SVG painterly instead — this component returns null when it
 * detects an unsupported environment, signalled via the onUnsupported
 * callback so the parent can swap in the SVG version.
 */
function HeroFluidBackground({ onUnsupported }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!gl) {
      console.warn('[fluid] no WebGL — falling back');
      onUnsupported?.();
      return undefined;
    }
    // Half-float for sim buffers — graceful fallback if extension missing
    const halfFloatExt = gl.getExtension('OES_texture_half_float') || gl.getExtension('OES_texture_float');
    if (!halfFloatExt) {
      console.warn('[fluid] no half-float texture — falling back');
      onUnsupported?.();
      return undefined;
    }
    const halfFloatType = halfFloatExt.HALF_FLOAT_OES || gl.FLOAT;
    gl.getExtension('OES_texture_half_float_linear');
    gl.getExtension('OES_texture_float_linear');
    // For rendering to half-float FBOs
    gl.getExtension('EXT_color_buffer_half_float');
    gl.getExtension('WEBGL_color_buffer_float');

    // ── Shaders ────────────────────────────────────────────────────────
    const VERT = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    // Advection: sample target texture at (uv - velocity*dt). The texture
    // we read from is what gets carried by the velocity field.
    const ADVECT = `
      precision highp float;
      uniform sampler2D uVelocity;
      uniform sampler2D uTarget;
      uniform vec2 uTexel;
      uniform float uDt;
      uniform float uDecay;
      varying vec2 vUv;
      void main() {
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vec2 coord = vUv - vel * uDt * uTexel;
        gl_FragColor = texture2D(uTarget, coord) * uDecay;
      }
    `;

    // Splat: add a soft gaussian of force/color centered on a point.
    const SPLAT = `
      precision highp float;
      uniform sampler2D uTarget;
      uniform vec2 uPoint;
      uniform vec3 uColor;
      uniform float uRadius;
      uniform float uAspect;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - uPoint;
        p.x *= uAspect;
        float intensity = exp(-dot(p, p) / uRadius);
        vec4 base = texture2D(uTarget, vUv);
        gl_FragColor = base + vec4(uColor * intensity, 0.0);
      }
    `;

    // Display: map density intensity to the brand brass palette.
    // The four stops are the same hex tokens used everywhere else on the
    // site (#fff2d4 → #d4a13d → #a06f1d → #5e3d10) so the fluid reads as
    // the same brass that lives in the painterly SVG, navbar accents, and
    // CTA chips.
    const DISPLAY = `
      precision highp float;
      uniform sampler2D uDensity;
      varying vec2 vUv;
      void main() {
        vec4 d = texture2D(uDensity, vUv);
        float intensity = clamp((d.r + d.g + d.b) / 3.0, 0.0, 2.0);
        vec3 cream     = vec3(1.000, 0.949, 0.831);  // #fff2d4
        vec3 brassLite = vec3(0.831, 0.631, 0.239);  // #d4a13d
        vec3 brassMid  = vec3(0.627, 0.435, 0.114);  // #a06f1d
        vec3 brassDeep = vec3(0.369, 0.239, 0.063);  // #5e3d10
        vec3 col = mix(cream, brassLite, smoothstep(0.0, 0.30, intensity));
        col = mix(col, brassMid, smoothstep(0.30, 0.75, intensity));
        col = mix(col, brassDeep, smoothstep(0.75, 1.4, intensity));
        // Cap alpha at 0.45 so the SVG painterly below always shows
        // through, even when trails accumulate from rapid mouse motion.
        float a = smoothstep(0.0, 0.6, intensity) * 0.45;
        gl_FragColor = vec4(col * a, a);
      }
    `;

    // ── Shader plumbing ───────────────────────────────────────────────
    function compile(src, type) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(sh);
        console.error('Shader compile failed:', err, src);
        return null;
      }
      return sh;
    }
    function program(fsrc) {
      const prog = gl.createProgram();
      const vs = compile(VERT, gl.VERTEX_SHADER);
      const fs = compile(fsrc, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.bindAttribLocation(prog, 0, 'aPos');
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('Program link failed:', gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    }

    const advectProg = program(ADVECT);
    const splatProg = program(SPLAT);
    const displayProg = program(DISPLAY);
    if (!advectProg || !splatProg || !displayProg) {
      console.warn('[fluid] shader/program failure', { advectProg: !!advectProg, splatProg: !!splatProg, displayProg: !!displayProg });
      onUnsupported?.();
      return undefined;
    }

    // Full-screen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // ── Sim buffers (ping-pong FBOs) ──────────────────────────────────
    const SIM_W = 512;
    const SIM_H = 288;

    function createFBO(w, h) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, halfFloatType, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.warn('FBO incomplete:', status);
      }
      return { tex, fbo, w, h };
    }
    function createDoubleFBO(w, h) {
      return { read: createFBO(w, h), write: createFBO(w, h), swap() { const t = this.read; this.read = this.write; this.write = t; } };
    }
    const velocity = createDoubleFBO(SIM_W, SIM_H);
    const density = createDoubleFBO(SIM_W, SIM_H);

    // Clear all to transparent black to start
    [velocity.read, velocity.write, density.read, density.write].forEach((b) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, b.fbo);
      gl.viewport(0, 0, b.w, b.h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });

    // ── Render helpers ────────────────────────────────────────────────
    function drawQuad() {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function blit(dst) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst ? dst.fbo : null);
      gl.viewport(0, 0, dst ? dst.w : canvas.width, dst ? dst.h : canvas.height);
      drawQuad();
    }

    function advect(targetDouble, dt, decay) {
      gl.useProgram(advectProg);
      gl.uniform1i(gl.getUniformLocation(advectProg, 'uVelocity'), 0);
      gl.uniform1i(gl.getUniformLocation(advectProg, 'uTarget'), 1);
      gl.uniform2f(gl.getUniformLocation(advectProg, 'uTexel'), 1.0 / SIM_W, 1.0 / SIM_H);
      gl.uniform1f(gl.getUniformLocation(advectProg, 'uDt'), dt);
      gl.uniform1f(gl.getUniformLocation(advectProg, 'uDecay'), decay);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, targetDouble.read.tex);
      blit(targetDouble.write);
      targetDouble.swap();
    }

    function splat(targetDouble, pointX, pointY, colorR, colorG, colorB, radius) {
      gl.useProgram(splatProg);
      gl.uniform1i(gl.getUniformLocation(splatProg, 'uTarget'), 0);
      gl.uniform2f(gl.getUniformLocation(splatProg, 'uPoint'), pointX, pointY);
      gl.uniform3f(gl.getUniformLocation(splatProg, 'uColor'), colorR, colorG, colorB);
      gl.uniform1f(gl.getUniformLocation(splatProg, 'uRadius'), radius);
      gl.uniform1f(gl.getUniformLocation(splatProg, 'uAspect'), SIM_W / SIM_H);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targetDouble.read.tex);
      blit(targetDouble.write);
      targetDouble.swap();
    }

    function display() {
      gl.useProgram(displayProg);
      gl.uniform1i(gl.getUniformLocation(displayProg, 'uDensity'), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      drawQuad();
    }

    // ── Input state ──────────────────────────────────────────────────
    const pointer = { x: 0.7, y: 0.5, lx: 0.7, ly: 0.5, dx: 0, dy: 0, active: false };
    let scrollImpulse = 0;
    let lastScrollY = window.scrollY;

    function setSize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }
    setSize();

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height; // GL origin bottom-left
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      pointer.lx = pointer.x;
      pointer.ly = pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.dx = (x - pointer.lx) * 6;
      pointer.dy = (y - pointer.ly) * 6;
      pointer.active = true;
    }

    function onScroll() {
      const cur = window.scrollY;
      scrollImpulse += (cur - lastScrollY) * 0.0008;
      scrollImpulse = Math.max(-0.4, Math.min(0.4, scrollImpulse));
      lastScrollY = cur;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const resizeObs = new ResizeObserver(setSize);
    resizeObs.observe(canvas.parentElement);

    // No seed — fluid starts blank and only adds brass where the cursor
    // moves. The SVG painterly below provides the base composition.

    // ── Animation loop ────────────────────────────────────────────────
    let last = performance.now();
    let running = true;
    let rafId = 0;

    function frame(t) {
      if (!running) return;
      let dt = (t - last) / 1000;
      if (dt > 0.05) dt = 0.05; // cap to prevent huge jumps on tab refocus
      last = t;

      // No ambient force — fluid is pure cursor interaction. At rest the
      // SVG painterly below is the only thing visible.

      // Pointer splats — brass trails appear under the cursor and bleed
      // briefly along the velocity field before fading back to transparent.
      // Density per splat is deliberately small so even rapid sweeps don't
      // accumulate into a wash; the velocity field carries them visibly.
      if (pointer.active) {
        const speed = Math.hypot(pointer.dx, pointer.dy);
        const force = Math.min(0.4 + speed * 0.6, 1.4);
        splat(density, pointer.x, pointer.y, 0.06 * force, 0.042 * force, 0.014 * force, 0.04);
        splat(velocity, pointer.x, pointer.y, pointer.dx * 2.0, pointer.dy * 2.0, 0.0, 0.04);
        pointer.dx *= 0.7;
        pointer.dy *= 0.7;
        if (Math.abs(pointer.dx) < 0.001 && Math.abs(pointer.dy) < 0.001) pointer.active = false;
      }

      // Scroll perturbs the velocity field without adding density.
      if (Math.abs(scrollImpulse) > 0.001) {
        splat(velocity, 0.85, 0.5, 0.0, -scrollImpulse * 3.5, 0.0, 0.35);
        scrollImpulse *= 0.85;
      }

      // Aggressive decay — trails fade in under a second so the fluid
      // never builds into a wash. The SVG below is what's visible at rest.
      advect(velocity, dt * 100, 0.94);
      advect(density, dt * 100, 0.9);

      display();
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    // Pause when the page is hidden to spare battery
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else {
        running = true;
        last = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObs.disconnect();
      gl.deleteProgram(advectProg);
      gl.deleteProgram(splatProg);
      gl.deleteProgram(displayProg);
      gl.deleteBuffer(quad);
      [velocity.read, velocity.write, density.read, density.write].forEach((b) => {
        gl.deleteTexture(b.tex);
        gl.deleteFramebuffer(b.fbo);
      });
    };
  }, [onUnsupported]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}

export default HeroFluidBackground;
