/* ==========================================================================
   YAROSLAV CYBERNETIC WORKSPACE // INTERACTIVE ENGINE (script.js)
   DYNAMIC INTERACTIVITY, WEB AUDIO SYNTHESIS, AND HEAVY CLIENT FX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Remove loading state from body
    document.body.classList.remove('loading');

    // Smooth scroll helper — works on both file:// and http://
    function smoothScrollTo(el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    // Hero action buttons
    document.querySelectorAll('.scroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.dataset.target);
            if (el) smoothScrollTo(el);
        });
    });

    // Nav anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
        link.addEventListener('click', e => {
            const el = document.getElementById(link.getAttribute('href').slice(1));
            if (el) { e.preventDefault(); smoothScrollTo(el); }
        });
    });

    /* ==========================================================================
       1. Custom Lagrangian Cursor Trailer System
       ========================================================================== */
    const cursor = document.getElementById('cyber-cursor');
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    const label = cursor.querySelector('.cursor-label');

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    // Linear Interpolation (Lerp) for lag-free fluid following
    const lerpSpeed = 0.12;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Move with smooth damping
        cursorX += (mouseX - cursorX) * lerpSpeed;
        cursorY += (mouseY - cursorY) * lerpSpeed;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate3d(-50%, -50%, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Interstellar Link listeners
    const hoverElements = document.querySelectorAll('a, button, .tilt-card, .select-train, input[type="range"]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hover-link');
            // Play dynamic hover chime
            playChime(400, 1200, 0.08, 'sine');
            
            // Adjust pointer cursor tag text
            if (el.classList.contains('tilt-card')) {
                label.textContent = "ПОГРУЗИТЬСЯ";
            } else if (el.classList.contains('select-train')) {
                label.textContent = "ДЕПО";
            } else if (el.id === 'cyber-video' || el.classList.contains('trigger-btn')) {
                label.textContent = "ФИЛЬМ";
            } else {
                label.textContent = "КЛИК";
            }
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-link');
        });
        
        el.addEventListener('click', () => {
            // Click visual pulse
            ring.style.transform = 'scale(1.6)';
            setTimeout(() => {
                ring.style.transform = '';
            }, 300);
            
            playChime(1500, 300, 0.12, 'triangle');
        });
    });

    /* ==========================================================================
       2. Web Audio Synthesizer Interface (Chimes & Tones)
       ========================================================================== */
    let audioCtx = null;
    let isMuted = false;

    // Initialize Audio Context on first interaction to comply with browser privacy rules
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    // Bind initialization to standard user triggers
    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);

    const btnMute = document.getElementById('btn-audio-mute');
    btnMute.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            btnMute.classList.add('muted');
            btnMute.style.borderColor = 'var(--accent-red)';
            btnMute.style.color = 'var(--accent-red)';
        } else {
            btnMute.classList.remove('muted');
            btnMute.style.borderColor = 'var(--border-glass)';
            btnMute.style.color = 'var(--text-secondary)';
        }
    });

    // High fidelity modular chime synthesizer
    function playChime(startFreq, endFreq, duration, type = 'sine') {
        if (isMuted) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = type;
            // Frequency sweep to sound software-like
            osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

            gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio errors suppressed
        }
    }

    /* ==========================================================================
       3. 3D Card Physics Tilt Transformations
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // mouse x within card
            const y = e.clientY - rect.top;  // mouse y within card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Maximum bounds (12deg tilting)
            const rotateX = ((centerY - y) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ==========================================================================
       4. Real-time Canvas Toon-Shading Anime Shader (CSS filter fallback for "play" card)
       ========================================================================== */
    const canvasCards = document.querySelectorAll('.anime-canvas-fallback');

    canvasCards.forEach(canvas => {
        const card = canvas.closest('.tilt-card');
        const ctx = canvas.getContext('2d');
        let imgLoaded = false;
        let rendered = false;

        const img = new Image();
        img.src = card.querySelector('.base-img').src;

        img.onload = () => {
            imgLoaded = true;
            canvas.width = 480;
            canvas.height = Math.round(480 * (img.height / img.width));
            applyAnimeShader();
        };

        card.addEventListener('mouseenter', () => {
            if (!imgLoaded || rendered) return;
            applyAnimeShader();
        });

        function applyAnimeShader() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                // Keep copy of original grayscale for edge detection
                const gray = new Float32Array(canvas.width * canvas.height);

                // Pass 1: posterization + vivid saturation (anime flat-color look)
                for (let i = 0; i < data.length; i += 4) {
                    let r = data[i], g = data[i+1], b = data[i+2];

                    // Posterize to 6 discrete levels
                    const steps = 6, step = 255 / (steps - 1);
                    r = Math.round(r / step) * step;
                    g = Math.round(g / step) * step;
                    b = Math.round(b / step) * step;

                    // Strong saturation boost — anime colors are very vivid
                    const luma = 0.299*r + 0.587*g + 0.114*b;
                    const sat = 2.4;
                    r = luma + sat * (r - luma);
                    g = luma + sat * (g - luma);
                    b = luma + sat * (b - luma);

                    // Slight warm skin-tone shift
                    r = Math.min(255, Math.max(0, r + 12));
                    g = Math.min(255, Math.max(0, g - 4));
                    b = Math.min(255, Math.max(0, b - 8));

                    data[i]   = r;
                    data[i+1] = g;
                    data[i+2] = b;

                    // Store grayscale for Sobel pass
                    gray[i >> 2] = 0.299*r + 0.587*g + 0.114*b;
                }

                // Pass 2: Sobel edge detection → dark ink outlines
                const w = canvas.width, h = canvas.height;
                const kX = [[-1,0,1],[-2,0,2],[-1,0,1]];
                const kY = [[-1,-2,-1],[0,0,0],[1,2,1]];

                for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        let vX = 0, vY = 0;
                        for (let ky = -1; ky <= 1; ky++) {
                            for (let kx = -1; kx <= 1; kx++) {
                                const g = gray[(y + ky) * w + (x + kx)];
                                vX += g * kX[ky+1][kx+1];
                                vY += g * kY[ky+1][kx+1];
                            }
                        }
                        const edge = Math.sqrt(vX*vX + vY*vY);
                        if (edge > 90) {
                            const pi = (y * w + x) * 4;
                            // Dark navy ink outline (anime style)
                            data[pi]   = 10;
                            data[pi+1] = 8;
                            data[pi+2] = 25;
                        }
                    }
                }

                ctx.putImageData(imgData, 0, 0);
                rendered = true;
            } catch (err) {
                // Fallback: vivid CSS filter when pixel access is blocked
                canvas.style.filter = "contrast(2.1) saturate(4) hue-rotate(-8deg) brightness(1.08)";
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        }
    });

    /* ==========================================================================
       5. Interactive Locomotive Train Physics Station
       ========================================================================== */
    const trainIllustration = document.querySelector('.locomotive-illustration');
    const btnWhistle = document.getElementById('btn-train-sound');
    const btnAccelerate = document.getElementById('btn-train-accelerate');
    const gaugeFill = document.getElementById('train-throttle');
    const throttleTxt = document.getElementById('throttle-txt');
    const wheels = document.querySelectorAll('.wheel');
    const pistonRod = document.getElementById('piston-rod');
    const steamClouds = document.getElementById('steam-clouds');

    let currentSpeed = 75; // Starting throttle %
    let baseWhistleFreq = 392; // G4 pitch

    // Train Horn (Multiple Oscillators Chord)
    btnWhistle.addEventListener('click', () => {
        if (isMuted) return;
        initAudio();
        if (!audioCtx) return;

        try {
            // Whistle chords: G4 (392Hz) + B4 (493Hz) + D5 (587Hz)
            const freqs = [baseWhistleFreq, baseWhistleFreq * 1.25, baseWhistleFreq * 1.5];
            const nodes = [];

            const mainGain = audioCtx.createGain();
            mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
            mainGain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.15); // Fade in
            mainGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2); // Long blow fade

            freqs.forEach(freq => {
                const osc = audioCtx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                // Slight pitch vibrato
                osc.frequency.linearRampToValueAtTime(freq + 10, audioCtx.currentTime + 0.5);
                osc.frequency.linearRampToValueAtTime(freq - 5, audioCtx.currentTime + 1.0);

                osc.connect(mainGain);
                osc.start();
                osc.stop(audioCtx.currentTime + 1.25);
            });

            mainGain.connect(audioCtx.destination);
            
            // Whistle shaking steam visual effect
            trainIllustration.style.animation = 'chevronBounce 0.1s infinite';
            setTimeout(() => {
                trainIllustration.style.animation = '';
            }, 1000);

        } catch (e) { }
    });

    // Locomotive Acceleration Mechanics
    btnAccelerate.addEventListener('click', () => {
        currentSpeed += 25;
        if (currentSpeed > 200) {
            currentSpeed = 25; // Reset engine speed
        }

        gaugeFill.style.width = `${Math.min(100, currentSpeed / 2)}%`;
        
        let label = "STATION_STANDBY";
        let durationDivider = 1;

        if (currentSpeed === 25) {
            label = "25% // COLD_INJECTION";
            durationDivider = 0.3;
        } else if (currentSpeed === 50) {
            label = "50% // STEADY_CRUISE";
            durationDivider = 0.6;
        } else if (currentSpeed === 75) {
            label = "75% // FAST_LAP";
            durationDivider = 1.0;
        } else if (currentSpeed === 100) {
            label = "100% // MAXIMUM_PRESSURE";
            durationDivider = 1.4;
        } else if (currentSpeed === 125) {
            label = "125% // OVERDRIVE_FORCED";
            durationDivider = 1.8;
            playChime(100, 200, 0.4, 'sawtooth');
        } else if (currentSpeed >= 150) {
            label = "CYBERNETIC_HYPER_BOOST";
            durationDivider = 2.8;
            btnAccelerate.textContent = "СБРОСИТЬ ТЯГУ";
            // Flash train headlights
            document.querySelector('.headlight-eye').style.fill = 'var(--accent-red)';
            document.querySelector('.light-beam').style.fill = 'var(--accent-red)';
        }

        if (currentSpeed === 25) {
            btnAccelerate.textContent = "УСКОРИТЬ МАШИНУ";
            document.querySelector('.headlight-eye').style.fill = '#ffffff';
            document.querySelector('.light-beam').style.fill = 'var(--accent-cyan)';
        }

        throttleTxt.textContent = `${label}`;

        // Accelerate wheel rotation speeds dynamically
        wheels.forEach(w => {
            const isFast = w.classList.contains('spin-fast');
            const newDuration = (isFast ? 1.2 : 2.2) / durationDivider;
            w.style.animationDuration = `${newDuration}s`;
        });

        // Speed up steam cloud puffs
        const puffs = steamClouds.querySelectorAll('.steam-puff');
        puffs.forEach(p => {
            p.style.animationDuration = `${2 / durationDivider}s`;
        });
    });

    // Locomotive selection switcher
    const trainCards = document.querySelectorAll('.select-train');
    trainCards.forEach(card => {
        card.addEventListener('click', () => {
            trainCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const trainType = card.getAttribute('data-train-type');
            if (trainType === 'bullet') {
                baseWhistleFreq = 587; // high speed horn (D5)
                btnWhistle.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg> ПОДАТЬ СИГНАЛ (ELECTRONIC SIREN)
                `;
            } else if (trainType === 'steam') {
                baseWhistleFreq = 220; // heavy steam whistle (A3)
                btnWhistle.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg> ПОДАТЬ ГУДОК (HEAVY STEAM)
                `;
            } else {
                baseWhistleFreq = 293; // standard diesel chord (D4)
                btnWhistle.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg> ВЫДАТЬ ЗВУК (FREIGHT TYPHOON)
                `;
            }
        });
    });

    /* ==========================================================================
       6. Custom HTML5 Media Deck Video Player Engineering
       ========================================================================== */
    const video = document.getElementById('cyber-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const videoHUD = document.getElementById('video-hud');
    const btnHUDPlay = document.getElementById('btn-central-play');
    
    const btnPlay = document.getElementById('btn-video-play');
    const iconPlay = btnPlay.querySelector('.p-play-ico');
    const iconPause = btnPlay.querySelector('.p-pause-ico');
    const btnStop = document.getElementById('btn-video-stop');
    const btnVol = document.getElementById('btn-video-volume');
    const iconVolUp = btnVol.querySelector('.v-up');
    const iconVolMute = btnVol.querySelector('.v-mute');
    
    const volSlider = document.getElementById('volume-slider');
    const timeline = document.getElementById('control-timeline');
    const timeProgress = document.getElementById('timeline-progress');
    const timeHandle = document.getElementById('timeline-handle');
    const txtCurrTime = document.getElementById('val-curr-time');
    const txtTotalTime = document.getElementById('val-total-time');

    // Sync volume slider
    video.volume = volSlider.value;

    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
            videoHUD.classList.remove('active');
            iconPlay.classList.add('hide');
            iconPause.classList.remove('hide');
            document.querySelector('.deck-status').textContent = 'PLAYBACK_ACTIVE // 30 FPS';
            document.querySelector('.deck-status').style.color = 'var(--accent-cyan)';
        } else {
            video.pause();
            videoHUD.classList.add('active');
            iconPlay.classList.remove('hide');
            iconPause.classList.add('hide');
            document.querySelector('.deck-status').textContent = 'PLAYBACK_PAUSED';
            document.querySelector('.deck-status').style.color = 'var(--accent-orange)';
        }
    }

    [btnHUDPlay, btnPlay, videoWrapper].forEach(trigger => {
        // Wrapper only triggers play/pause on click inside video window
        if (trigger === videoWrapper) {
            trigger.addEventListener('click', (e) => {
                if (e.target === video || e.target === videoHUD || e.target.closest('.hud-central-trigger')) {
                    togglePlay();
                }
            });
        } else {
            trigger.addEventListener('click', togglePlay);
        }
    });

    btnStop.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        videoHUD.classList.add('active');
        iconPlay.classList.remove('hide');
        iconPause.classList.add('hide');
        document.querySelector('.deck-status').textContent = 'PLAYBACK_STOPPED // TERMINATED';
        document.querySelector('.deck-status').style.color = 'var(--accent-red)';
    });

    // Volume Adjustment
    volSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        video.volume = val;
        video.muted = (val === "0");
        if (video.muted) {
            iconVolUp.classList.add('hide');
            iconVolMute.classList.remove('hide');
        } else {
            iconVolUp.classList.remove('hide');
            iconVolMute.classList.add('hide');
        }
    });

    btnVol.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            iconVolUp.classList.add('hide');
            iconVolMute.classList.remove('hide');
            volSlider.value = 0;
        } else {
            iconVolUp.classList.remove('hide');
            iconVolMute.classList.add('hide');
            volSlider.value = video.volume || 0.8;
        }
    });

    // Timeline tracker & seeker calculations
    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        if (secs < 10) secs = '0' + secs;
        return `${mins}:${secs}`;
    }

    video.addEventListener('loadedmetadata', () => {
        txtTotalTime.textContent = formatTime(video.duration);
    });

    video.addEventListener('timeupdate', () => {
        const pct = (video.currentTime / video.duration) * 100;
        timeProgress.style.width = `${pct}%`;
        timeHandle.style.left = `${pct}%`;
        txtCurrTime.textContent = formatTime(video.currentTime);
    });

    // Click/Drag Timeline Seeker
    let isDraggingTimeline = false;

    function scrub(e) {
        const rect = timeline.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.currentTime = pct * video.duration;
    }

    timeline.addEventListener('mousedown', (e) => {
        isDraggingTimeline = true;
        scrub(e);
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingTimeline) scrub(e);
    });

    window.addEventListener('mouseup', () => {
        isDraggingTimeline = false;
    });

    /* ==========================================================================
       7. Custom Telemetry Canvas Audio Waveform generator (Visualizer)
       ========================================================================== */
    const vizCanvas = document.getElementById('canvas-sound-visualizer');
    const vizCtx = vizCanvas.getContext('2d');

    function resizeViz() {
        vizCanvas.width = vizCanvas.offsetWidth;
        vizCanvas.height = vizCanvas.offsetHeight;
    }
    resizeViz();
    window.addEventListener('resize', resizeViz);

    function drawVisualizer() {
        vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
        
        const width = vizCanvas.width;
        const height = vizCanvas.height;
        
        // Dynamic sine wave mock audio signals generated mathematically
        vizCtx.lineWidth = 1.5;
        
        if (!video.paused && !video.muted) {
            // Signal Active: draw glowing green frequencies
            const time = Date.now() * 0.008;
            vizCtx.strokeStyle = 'rgba(0, 255, 213, 0.45)';
            vizCtx.beginPath();
            
            for (let i = 0; i < width; i += 4) {
                let y = height / 2 + 
                        Math.sin(i * 0.02 + time) * 10 * Math.cos(i * 0.005) + 
                        Math.sin(i * 0.06 - time * 1.5) * 4;
                if (i === 0) vizCtx.moveTo(i, y);
                else vizCtx.lineTo(i, y);
            }
            vizCtx.stroke();

            // Twin higher frequency signal layer
            vizCtx.strokeStyle = 'rgba(255, 123, 0, 0.3)';
            vizCtx.beginPath();
            for (let i = 0; i < width; i += 6) {
                let y = height / 2 + 
                        Math.sin(i * 0.04 - time) * 8 * Math.cos(i * 0.01) + 
                        Math.sin(i * 0.1 + time) * 3;
                if (i === 0) vizCtx.moveTo(i, y);
                else vizCtx.lineTo(i, y);
            }
            vizCtx.stroke();
        } else {
            // Idle state line showing ambient telemetry grid
            vizCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            vizCtx.beginPath();
            vizCtx.moveTo(0, height / 2);
            vizCtx.lineTo(width, height / 2);
            vizCtx.stroke();
        }

        requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();

    /* ==========================================================================
       8. Navigation HUD Scroll Highlighting & Track Elements
       ========================================================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('header, section, main');

    const scrollObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // high density offset
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Smooth timeline scrolling indicators
    const progressFill = document.getElementById('progress-indicator');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressFill.style.width = scrolled + "%";
    });

    /* ==========================================================================
       9. Procedural Steam Train Ambience (Steam clicks synthesizer)
       ========================================================================== */
    const btnAmbient = document.getElementById('btn-ambient-audio');
    let trainSynthInterval = null;
    let isAmbientPlaying = false;

    btnAmbient.addEventListener('click', () => {
        isAmbientPlaying = !isAmbientPlaying;
        if (isAmbientPlaying) {
            btnAmbient.classList.add('active');
            btnAmbient.querySelector('.sound-wave-bars').style.opacity = '1';
            // Start synthesizing procedural steam wheels rhythmic "chugga-chugga" clicks
            startTrainDriveSynthesis();
            playChime(300, 600, 0.3, 'sine');
        } else {
            btnAmbient.classList.remove('active');
            btnAmbient.querySelector('.sound-wave-bars').style.opacity = '0';
            stopTrainDriveSynthesis();
        }
    });

    function startTrainDriveSynthesis() {
        if (trainSynthInterval) return;
        initAudio();
        
        let counter = 0;
        trainSynthInterval = setInterval(() => {
            if (isMuted || !audioCtx) return;
            try {
                // Rhythmic train click sound (chug-chug click-clack)
                const osc = audioCtx.createOscillator();
                const filter = audioCtx.createBiquadFilter();
                const gain = audioCtx.createGain();

                osc.type = 'triangle';
                
                // Formulate rhythmic engine cycles: chug (80Hz) to clack (180Hz)
                const phase = counter % 4;
                let freq = 60;
                let release = 0.08;
                let vol = 0.07;
                
                if (phase === 0) {
                    freq = 65; // Chug
                } else if (phase === 1) {
                    freq = 55;
                } else if (phase === 2) {
                    freq = 110; // Click
                    release = 0.03;
                    vol = 0.05;
                } else {
                    freq = 95; // Clack
                    release = 0.04;
                    vol = 0.04;
                }

                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(250, audioCtx.currentTime);

                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + release);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + release + 0.05);

                counter++;
            } catch (e) {}
        }, 320); // 320ms rhythmic engine timing
    }

    function stopTrainDriveSynthesis() {
        if (trainSynthInterval) {
            clearInterval(trainSynthInterval);
            trainSynthInterval = null;
        }
    }

    /* ==========================================================================
       Heart explosion effect on nexus section hover
       ========================================================================== */
    const heartSignal = document.querySelector('.nexus-heart-signal');
    if (heartSignal) {
        let heartCooldown = false;

        heartSignal.addEventListener('mouseenter', () => {
            if (heartCooldown) return;
            heartCooldown = true;
            setTimeout(() => { heartCooldown = false; }, 800);

            const rect = heartSignal.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const colors = [
                '#ff007f', '#ff3399', '#ff66b2', '#ff0055',
                '#ff44aa', '#ff1493', '#e0006f', '#ff69b4',
                '#c700ff', '#ff4488'
            ];

            const count = 22;
            for (let i = 0; i < count; i++) {
                const heart = document.createElement('span');
                heart.className = 'flying-heart';
                heart.textContent = '♥';

                // Spread in all directions, slightly biased upward
                const angle = (i / count) * 360 - 90;
                const spread = 70 + Math.random() * 80;
                const dx = Math.cos((angle * Math.PI) / 180) * spread;
                const dy = Math.sin((angle * Math.PI) / 180) * spread - 20;

                const size = 14 + Math.random() * 22;
                const delay = (Math.random() * 0.25).toFixed(3);
                const duration = (0.9 + Math.random() * 0.4).toFixed(2);
                const color = colors[Math.floor(Math.random() * colors.length)];

                heart.style.cssText = `
                    left: ${cx}px;
                    top: ${cy}px;
                    font-size: ${size}px;
                    color: ${color};
                    text-shadow: 0 0 8px ${color};
                    --dx: ${dx.toFixed(1)}px;
                    --dy: ${dy.toFixed(1)}px;
                    --delay: ${delay}s;
                    --duration: ${duration}s;
                `;

                document.body.appendChild(heart);
                const removeAfter = (parseFloat(duration) + parseFloat(delay)) * 1000 + 100;
                setTimeout(() => heart.remove(), removeAfter);
            }
        });
    }
});
