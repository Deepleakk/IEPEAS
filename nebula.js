// nebula.js - Background nebula biru gelap + bintang bergerak + matahari
(function() {
    // Buat canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'nebulaCanvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;
    let stars = [];

    // Resize canvas sesuai ukuran layar
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    // Inisialisasi bintang
    function initStars() {
        stars = [];
        const starCount = Math.floor(width * height / 4000); // dinamis
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                speedY: Math.random() * 0.2 + 0.05,
                speedX: (Math.random() - 0.5) * 0.1,
                blink: Math.random() > 0.7,
                blinkSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    // Gambar nebula bergerak (gradient biru kehitaman)
    function drawNebula() {
        const grad = ctx.createLinearGradient(
            width * (0.3 + Math.sin(time * 0.1) * 0.05),
            height * (0.2 + Math.cos(time * 0.07) * 0.05),
            width * (0.7 + Math.sin(time * 0.08) * 0.05),
            height * (0.8 + Math.cos(time * 0.06) * 0.05)
        );
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.3, '#0c1445');
        grad.addColorStop(0.6, '#1e1b4b');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Efek nebula kedua (lembut)
        const grad2 = ctx.createRadialGradient(
            width * 0.5 + Math.sin(time * 0.05) * 50,
            height * 0.4 + Math.cos(time * 0.04) * 30,
            50,
            width * 0.5,
            height * 0.5,
            width * 0.6
        );
        grad2.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
    }

    // Gambar bintang bergerak & berkedip
    function drawStars() {
        for (let star of stars) {
            let alpha = star.alpha;
            if (star.blink) {
                alpha += Math.sin(time * star.blinkSpeed * 10) * 0.15;
                alpha = Math.min(0.8, Math.max(0.2, alpha));
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`;
            ctx.fill();
            
            // Pergerakan bintang
            star.x += star.speedX;
            star.y += star.speedY;
            if (star.x < 0) star.x = width;
            if (star.x > width) star.x = 0;
            if (star.y < 0) star.y = height;
            if (star.y > height) star.y = 0;
        }
    }

    // Gambar matahari dengan sinar berputar
    function drawSun() {
        const sunX = width - 80;
        const sunY = 80;
        const radius = 40;
        
        // Glow luar matahari
        const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 70);
        glow.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
        glow.addColorStop(1, 'rgba(255, 100, 50, 0)');
        ctx.beginPath();
        ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        
        // Bulatan matahari
        const sunGrad = ctx.createRadialGradient(sunX - 10, sunY - 10, 10, sunX, sunY, radius);
        sunGrad.addColorStop(0, '#ffdd77');
        sunGrad.addColorStop(0.6, '#ffaa33');
        sunGrad.addColorStop(1, '#ff6600');
        ctx.beginPath();
        ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();
        
        // Sinar matahari berputar
        const rayCount = 12;
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2 + time * 0.5;
            const x1 = sunX + Math.cos(angle) * radius;
            const y1 = sunY + Math.sin(angle) * radius;
            const x2 = sunX + Math.cos(angle) * (radius + 20);
            const y2 = sunY + Math.sin(angle) * (radius + 20);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 2 + Math.sin(time * 5 + i) * 1;
            ctx.strokeStyle = `rgba(255, 200, 100, ${0.5 + Math.sin(time * 3 + i) * 0.2})`;
            ctx.stroke();
        }
    }

    // Animasi utama
    function animate() {
        if (!ctx) return;
        drawNebula();
        drawStars();
        drawSun();
        time += 0.02;
        requestAnimationFrame(animate);
    }

    // Event resize layar
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Start
    resizeCanvas();
    animate();
})();
