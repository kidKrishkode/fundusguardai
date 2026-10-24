
(function initDiagnosticHUD() {
    const buttons = document.querySelectorAll('#layer-toggles .tab-btn');
    const fundusImg = document.getElementById('fundus-img');
    const overlay = document.getElementById('canvas-overlay');

    if (!buttons.length || !fundusImg) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-on-primary', 'font-medium', 'shadow-sm');
                b.classList.add('text-text-secondary');
            });

            btn.classList.remove('text-text-secondary');
            btn.classList.add('bg-primary-container', 'text-on-primary', 'font-medium', 'shadow-sm');

            const layer = btn.getAttribute('data-layer');

            if (layer === 'raw') {
                fundusImg.style.filter = 'contrast(100%) brightness(100%)';
                if (overlay) overlay.style.opacity = '0';
            } else if (layer === 'contour') {
                fundusImg.style.filter = 'contrast(125%) brightness(95%)';
                if (overlay) overlay.style.opacity = '1';
            } else if (layer === 'vessel') {
                fundusImg.style.filter = 'contrast(200%) saturate(30%) hue-rotate(180deg)';
                if (overlay) overlay.style.opacity = '0.4';
            } else if (layer === 'heatmap') {
                fundusImg.style.filter = 'contrast(140%) saturate(220%) hue-rotate(45deg)';
                if (overlay) overlay.style.opacity = '0.9';
            }
        });
    });
})();
