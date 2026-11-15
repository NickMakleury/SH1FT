document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const path1 = document.getElementById('path-1');
    const groupFT = document.getElementById('group-ft');
    const shiftSvg = document.getElementById('shift-svg');
    const percentageText = document.getElementById('loading-percentage');

    let progress = 0;
    const duration = 3000; // total loading time in ms
    const intervalTime = 16; // roughly 60fps
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    // The SVG original viewBox is 618 wide, displayed at ~18vh tall.
    // We need to calculate how many SVG units correspond to the full viewport width,
    // so the "1" can stretch until near the right edge of the screen.
    const svgHeight = shiftSvg.getBoundingClientRect().height || window.innerHeight * 0.18;
    const svgAspectOriginal = 618 / 150; // original viewBox aspect ratio
    const svgRenderedWidth = svgHeight * svgAspectOriginal; // how wide the original SVG renders
    const svgUnitsPerPx = 618 / svgRenderedWidth; // SVG units per CSS pixel

    // Target: stretch "1" so FT lands near the right edge (95vw), leaving ~5vw margin
    const targetPixelWidth = window.innerWidth * 0.89;
    // Current right edge of FT in SVG units = 618
    // Current rendered px width of SVG at 0% = svgRenderedWidth
    // Extra px needed = targetPixelWidth - svgRenderedWidth
    const extraPixels = Math.max(0, targetPixelWidth - svgRenderedWidth);
    const maxStretch = extraPixels * svgUnitsPerPx;

    const baseViewBoxWidth = 618;

    // Wait slightly for the CSS fade-in to happen before animating
    setTimeout(() => {
        const interval = setInterval(() => {
            currentStep++;
            
            // Easing function: easeInOutCubic for a smooth start and end
            let t = currentStep / totalSteps;
            let easeProgress = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            progress = Math.min(100, Math.floor(easeProgress * 100));
            
            // Calculate how much we stretch the vector
            let stretchAmount = easeProgress * maxStretch;

            // 1) Update the right-side coordinates of the "1" path
            const newRightX = 351.665 + stretchAmount;
            path1.setAttribute('d', `M${newRightX} 0.24628V145.701L316.637 147.443V31.179H315.785L282.475 52.0597V24.787L318.484 1.98864L${newRightX} 0.24628Z`);

            // 2) Move the F and T group to the right
            groupFT.setAttribute('transform', `translate(${stretchAmount}, 0)`);

            // 3) Expand the viewBox of the whole SVG so nothing is cropped
            shiftSvg.setAttribute('viewBox', `0 0 ${baseViewBoxWidth + stretchAmount} 150`);

            // Update percentage text
            percentageText.innerText = `${progress}%`;

            if (currentStep >= totalSteps) {
                clearInterval(interval);
                
                // Finish loading sequence
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        mainContent.classList.remove('hidden');
                        
                        // Trigger reflow
                        void mainContent.offsetWidth;
                        
                        mainContent.classList.add('visible');
                        document.body.style.overflow = 'auto'; // Restore scrolling
                    }, 800); // Wait for preloader fade out transition
                }, 400); // Small pause at 100%
            }
        }, intervalTime);
    }, 600); // initial delay before animation begins
});

// Scroll suave para uma seção pelo ID
function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}
