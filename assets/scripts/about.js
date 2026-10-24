
(function initThemeEngine() {
    const activeTheme = localStorage.getItem('fundusguard_theme') || 'dark';
    if (activeTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light-theme');
    }
})();

(function setupAboutInteractiveBehaviors() {
    // 1. Light/Dark Adaptive Optics Toggle Mechanism
    const themeToggleBtn = document.getElementById('app-theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label-txt');

    function updateThemeUI(isLight) {
        if (!themeIcon || !themeLabel) return;
        if (isLight) {
            themeIcon.textContent = 'light_mode';
            themeLabel.textContent = 'Light Adaptive';
        } else {
            themeIcon.textContent = 'dark_mode';
            themeLabel.textContent = 'Dark Optics';
        }
    }

    const initialIsLight = document.documentElement.classList.contains('light-theme');
    updateThemeUI(initialIsLight);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const isCurrentlyLight = document.documentElement.classList.contains('light-theme');
            if (isCurrentlyLight) {
                document.documentElement.classList.remove('light-theme');
                document.documentElement.classList.add('dark');
                localStorage.setItem('fundusguard_theme', 'dark');
                updateThemeUI(false);
            } else {
                document.documentElement.classList.add('light-theme');
                document.documentElement.classList.remove('dark');
                localStorage.setItem('fundusguard_theme', 'light');
                updateThemeUI(true);
            }
        });
    }

    // 2. Navigation Highlighting (Highlight "About" link in global header)
    try {
        const navLinks = document.querySelectorAll('header nav a[data-path], #mobile-drawer a[data-path]');
        navLinks.forEach(link => {
            if (link.getAttribute('data-path') === 'about' || link.getAttribute('href')?.includes('about')) {
                link.classList.add('text-optic-disc-gold', 'font-semibold', 'bg-surface-container-high');
                link.classList.remove('text-on-surface-variant');
            }
        });
    } catch (e) {
        // Fallback gracefully
    }
})();
