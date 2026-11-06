/*tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "error-container": "#93000a", "on-surface": "#e3e1e9", "on-tertiary-fixed": "#410002", "primary-container": "#f66018", "on-primary-container": "#4f1700", "on-error": "#690005", "on-secondary-fixed-variant": "#653e00", "secondary": "#ffb95f", "text-secondary": "#94A3B8", "optic-disc-gold": "#FCD34D", "border-amber-glow": "rgba(245, 158, 11, 0.15)", "outline": "#a98a7e", "on-primary-fixed": "#370e00", "surface": "#121318", "on-primary-fixed-variant": "#7f2b00", "primary-fixed-dim": "#ffb599", "on-tertiary-fixed-variant": "#93000b", "surface-container-lowest": "#0d0e13", "on-background": "#e3e1e9", "tertiary-fixed-dim": "#ffb4ab", "secondary-container": "#ee9800", "primary": "#ffb599", "tertiary-fixed": "#ffdad6", "border-subtle": "rgba(148, 163, 184, 0.12)", "secondary-fixed": "#ffddb8", "surface-container-low": "#1a1b21", "background": "#121318", "inverse-surface": "#e3e1e9", "on-surface-variant": "#e2bfb2", "tertiary-container": "#ff544a", "glaucoma-critical": "#EF4444", "on-secondary": "#472a00", "surface-container": "#1e1f25", "surface-tint": "#ffb599", "on-secondary-container": "#5b3800", "outline-variant": "#5a4138", "surface-bright": "#38393f", "secondary-fixed-dim": "#ffb95f", "surface-overlay": "rgba(26, 30, 44, 0.65)", "status-healthy": "#10B981", "primary-fixed": "#ffdbce", "surface-dim": "#121318", "on-tertiary-container": "#5c0004", "on-primary": "#5a1c00", "inverse-on-surface": "#2f3036", "surface-variant": "#34343a", "error": "#ffb4ab", "tertiary": "#ffb4ab", "surface-container-high": "#292a2f", "on-error-container": "#ffdad6", "inverse-primary": "#a73a00", "surface-glass": "rgba(18, 20, 29, 0.75)", "text-primary": "#FAFAFA", "surface-container-highest": "#34343a", "on-tertiary": "#690005", "on-secondary-fixed": "#2a1700" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "space-xl": "2rem", "gutter": "1rem", "space-sm": "0.5rem", "space-md": "0.75rem", "space-lg": "1.25rem", "space-xs": "0.25rem", "gutter-desktop": "1.5rem", "margin": "1rem", "margin-desktop": "2rem" }, "fontFamily": { "metric-display": ["Plus Jakarta Sans"], "body-lg": ["Inter"], "headline-md": ["Plus Jakarta Sans"], "headline-lg-mobile": ["Plus Jakarta Sans"], "label-md": ["Inter"], "label-sm": ["Inter"], "body-sm": ["Inter"], "body-md": ["Inter"], "headline-lg": ["Plus Jakarta Sans"], "headline-xl": ["Plus Jakarta Sans"], "headline-xl-mobile": ["Plus Jakarta Sans"], "title-md": ["Inter"] }, "fontSize": { "metric-display": ["24px", { "lineHeight": "30px", "letterSpacing": "-0.02em", "fontWeight": "700" }], "body-lg": ["15px", { "lineHeight": "22px", "letterSpacing": "-0.005em", "fontWeight": "400" }], "headline-md": ["20px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600" }], "headline-lg-mobile": ["22px", { "lineHeight": "28px", "letterSpacing": "-0.015em", "fontWeight": "600" }], "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500" }], "label-sm": ["11px", { "lineHeight": "14px", "letterSpacing": "0.04em", "fontWeight": "600" }], "body-sm": ["12px", { "lineHeight": "16px", "fontWeight": "400" }], "body-md": ["13px", { "lineHeight": "18px", "fontWeight": "400" }], "headline-lg": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "600" }], "headline-xl": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.025em", "fontWeight": "700" }], "headline-xl-mobile": ["30px", { "lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700" }], "title-md": ["16px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" }] } } } };
*/

// Release Tab Filtering
function filterReleases(type) {
    const rows = document.querySelectorAll(".release-row");
    const buttons = document.querySelectorAll(".release-tab-btn");

    buttons.forEach(btn => {
        if (btn.getAttribute("data-tab") === type) {
            btn.className = "release-tab-btn px-4 py-2 rounded-xl font-label-md text-label-md transition-colors bg-primary-container text-on-primary font-bold shadow-sm";
        } else {
            btn.className = "release-tab-btn px-4 py-2 rounded-xl font-label-md text-label-md transition-colors bg-surface-container border border-border-subtle text-text-secondary hover:text-on-surface hover:bg-surface-container-high";
        }
    });

    rows.forEach(row => {
        const rowType = row.getAttribute("data-type");
        if (type === "all" || rowType === type) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Search Input Filtering
const searchInput = document.getElementById("release-search");
if (searchInput) {
    searchInput.addEventListener("input", function (e) {
        const term = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll(".release-row");

        rows.forEach(row => {
            const text = row.getAttribute("data-text") || "";
            if (text.includes(term) || row.textContent.toLowerCase().includes(term)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}

// Mobile nav toggle
const mobileNavToggle = document.getElementById("mobile-nav-toggle");
const mobileDrawer = document.getElementById("mobile-drawer");
if (mobileNavToggle && mobileDrawer) {
    mobileNavToggle.addEventListener("click", () => {
        mobileDrawer.classList.toggle("hidden");
    });
}
