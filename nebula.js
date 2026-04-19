// nebula.js - Background nebula + bintang super cepat (5-7.5) + black hole
(function() {
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

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    function initStars() {
        stars = [];
        const starCount = Math.floor(width * height / 3000);
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                speedY: Math.random() * 2.5 + 5,    // 5 - 7.5 pixel per frame
                speedX: (Math.random() - 0.5) * 1.5,
                blink: Math.random() > 0.7,
                blinkSpeed: Math.random() * 0.03 + 0.01
            });
        }
    }

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

        const grad2 = ctx.createRadialGradient(
            width * 0.5 + Math.sin(time * 0.05) * 50,
            height * 0.4 + Math.cos(time * 0.04) * 30,
            50,
            width * 0.5,
            height * 0.5,
            width * 0.6
        );
        grad2.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
    }

    function drawStars() {
        for (let star of stars) {
            let alpha = star.alpha;
            if (star.blink) {
                alpha += Math.sin(time * star.blinkSpeed * 10) * 0.2;
                alpha = Math.min(0.9, Math.max(0.2, alpha));
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`;
            ctx.fill();
            
            star.x += star.speedX;
            star.y += star.speedY;
            if (star.x < -50) star.x = width + 50;
            if (star.x > width + 50) star.x = -50;
            if (star.y < -50) star.y = height + 50;
            if (star.y > height + 50) star.y = -50;
        }
    }

    function drawBlackHole() {
        const x = width - 80;
        const y = 80;
        const baseRadius = 30;
        
        // Efek denyut black hole
        const pulse = Math.sin(time * 3) * 0.1 + 0.9;
        const radius = baseRadius * pulse;
        
        // Lingkaran akresi (cincin berputar)
        for (let i = 0; i < 3; i++) {
            const ringRadius = radius + 12 + i * 8;
            ctx.beginPath();
            ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 100, 50, ${0.2 - i * 0.05})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Cincin akresi yang berputar (partial arc)
        for (let r = 0; r < 2; r++) {
            const ringRadius = radius + 10 + r * 10;
            const startAngle = time * 2 + r;
            const endAngle = startAngle + Math.PI * 1.5;
            ctx.beginPath();
            ctx.arc(x, y, ringRadius, startAngle, endAngle);
            ctx.strokeStyle = `rgba(255, 150, 80, ${0.5 - r * 0.2})`;
            ctx.lineWidth = 3 - r;
            ctx.stroke();
        }
        
        // Black hole core (hitam pekat dengan gradien)
        const blackHoleGrad = ctx.createRadialGradient(x - 5, y - 5, 5, x, y, radius);
        blackHoleGrad.addColorStop(0, '#000000');
        blackHoleGrad.addColorStop(0.7, '#111111');
        blackHoleGrad.addColorStop(1, '#2a0a2a');
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = blackHoleGrad;
        ctx.fill();
        
        // Efek gravitasi (lingkaran cahaya tipis di tepi)
        ctx.beginPath();
        ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 80, 80, ${0.3 + Math.sin(time * 5) * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Efek sinar hisap (garis-garis ke arah pusat)
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI * 2 / 8 + time;
            const x1 = x + Math.cos(angle) * (radius + 8);
            const y1 = y + Math.sin(angle) * (radius + 8);
            const x2 = x + Math.cos(angle) * (radius + 25);
            const y2 = y + Math.sin(angle) * (radius + 25);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(255, 150, 80, ${0.2 + Math.sin(time * 5 + i) * 0.1})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    function animate() {
        if (!ctx) return;
        drawNebula();
        drawStars();
        drawBlackHole();
        time += 0.02;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    resizeCanvas();
    animate();
})();
