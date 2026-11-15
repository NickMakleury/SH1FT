document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const main = document.getElementById('main-content');
    const path = document.getElementById('path-1');
    const ft = document.getElementById('group-ft');
    const svg = document.getElementById('shift-svg');
    const percentage = document.getElementById('loading-percentage');
    const container = preloader?.querySelector('.logo-container, .preloader-content');
    if (![preloader, main, path, ft, svg, percentage, container].every(Boolean)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Progresso visual por tempo, independente dos downloads da página.
    const duration = 3000;
    let progress = 0;
    let finished = false;
    let frame, finishTimer, safetyTimer;
    const previousOverflow = document.body.style.overflow;

    function finish() {
        if (finished) return;
        finished = true;
        cancelAnimationFrame(frame);
        clearTimeout(finishTimer);
        clearTimeout(safetyTimer);
        window.removeEventListener('resize', render);
        document.body.style.overflow = previousOverflow;
        main.inert = false;
        main.removeAttribute('aria-hidden');
        main.classList.remove('hidden');
        main.classList.add('visible');
        document.body.classList.remove('is-loading');
        preloader.classList.add('fade-out');
        setTimeout(() => { preloader.hidden = true; }, 800);
    }

    function render() {
        const available = container.clientWidth;
        const height = Math.max(1, Math.min(Math.max(80, Math.min(window.innerHeight * 0.18, 200)), available * 150 / 618));
        const baseWidth = height * 618 / 150;
        const stretch = progress * Math.max(0, available - baseWidth) * 150 / height;
        const right = 351.665 + stretch;
        path.setAttribute('d', `M${right} 0.24628V145.701L316.637 147.443V31.179H315.785L282.475 52.0597V24.787L318.484 1.98864L${right} 0.24628Z`);
        ft.setAttribute('transform', `translate(${stretch} 0)`);
        svg.setAttribute('viewBox', `0 0 ${618 + stretch} 150`);
        svg.style.height = `${height}px`;
        svg.style.width = `${baseWidth + stretch * height / 150}px`;
        percentage.textContent = `${Math.floor(progress * 100)}%`;
    }

    preloader.hidden = false;
    document.body.classList.add('is-loading');
    document.body.style.overflow = 'hidden';
    main.inert = true;
    main.setAttribute('aria-hidden', 'true');
    // Evita prender a página se houver uma falha durante a animação.
    safetyTimer = setTimeout(finish, 6500);
    window.addEventListener('resize', render);
    render();
    const start = performance.now() + 600;
    function animate(now) {
        const t = Math.max(0, Math.min(1, (now - start) / duration));
        progress = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        render();
        if (t < 1) frame = requestAnimationFrame(animate);
        else finishTimer = setTimeout(finish, 400);
    }
    frame = requestAnimationFrame(animate);
});

function scrollTo(id) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
}
