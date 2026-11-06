
// TAB SWITCHING
function switchTab(tabId) {
    // Deactivate all nav buttons
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });

    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    // Show selected tab panel
    const targetPanel = document.getElementById(`view-${tabId}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // Update breadcrumb
    const tabNames = {
        overview: 'Overview',
        keys: 'Key Management',
        analytics: 'Usage & Analytics',
        audit: 'Audit Trail',
        billing: 'Billings & Quota',
        settings: 'Settings',
        account: 'Account Profile'
    };
    const crumb = document.getElementById('breadcrumb-current');
    if (crumb && tabNames[tabId]) {
        crumb.textContent = tabNames[tabId];
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }

    // Scroll viewport to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach click listeners to all tab buttons
document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if (tab) switchTab(tab);
    });
});

// MOBILE SIDEBAR TOGGLE
const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');
if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// THEME SWITCHER (DARK / LIGHT MODE)
const themeBtn = document.getElementById('theme-toggle-btn');
const themeText = document.getElementById('theme-text');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
        themeText.textContent = 'Light Mode';
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    } else {
        themeText.textContent = 'Dark Mode';
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    }
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`);
    });
}

// TOAST NOTIFICATION
let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('app-toast');
    const text = document.getElementById('toast-message');
    if (!toast || !text) return;
    text.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// COPY API KEY
function copyApiKey(keyStr) {
    navigator.clipboard.writeText(keyStr).then(() => {
        showToast('API Key copied to clipboard!');
    }).catch(() => {
        showToast('Copied: ' + keyStr);
    });
}

// TOGGLE TOKEN MASK
let isMasked = true;
function toggleTokenMask(elemId, actualKey) {
    const el = document.getElementById(elemId);
    if (!el) return;
    if (isMasked) {
        el.textContent = actualKey;
        isMasked = false;
        showToast('API Key revealed');
    } else {
        el.textContent = actualKey.slice(0, 8) + '••••••••••••••••' + actualKey.slice(-8);
        isMasked = true;
        showToast('API Key masked');
    }
}

// REVOKE KEY
function revokeKey(rowId, badgeId) {
    if (confirm('Are you sure you want to revoke this API key? Applications using this token will fail immediately.')) {
        const badge = document.getElementById(badgeId);
        if (badge) {
            badge.className = 'badge-status revoked';
            badge.textContent = 'Revoked';
        }
        showToast('API Key successfully revoked');
    }
}

// MODAL ACTIONS
function openKeyModal() {
    const modal = document.getElementById('key-modal');
    if (modal) modal.classList.add('open');
}

function closeKeyModal() {
    const modal = document.getElementById('key-modal');
    if (modal) modal.classList.remove('open');
}

function generateNewKeyAction() {
    const nameInput = document.getElementById('modal-key-name');
    const keyName = nameInput ? nameInput.value : 'New Staging Key';
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newKey = 'fg_live_' + randomHex;

    // Add to table
    const tbody = document.querySelector('#keys-table tbody');
    if (tbody) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
              <div style="font-weight: 700; color: var(--text-primary);">${keyName}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Custom token</div>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="mono-cell" style="color: var(--accent-amber); font-weight: 600;">${newKey.slice(0, 8)}••••••••${newKey.slice(-4)}</span>
              </div>
            </td>
            <td class="mono-cell">Just Now</td>
            <td class="mono-cell">—</td>
            <td><span class="badge-status active">Active</span></td>
            <td style="text-align: right;">
              <div class="table-actions" style="justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="copyApiKey('${newKey}')" style="padding: 5px 10px; font-size: 0.78rem;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <span>Copy</span>
                </button>
              </div>
            </td>
          `;
        tbody.appendChild(row);
    }

    closeKeyModal();
    switchTab('keys');
    showToast(`Key "${keyName}" generated successfully!`);
}

// AUDIT LOG FILTER
function filterAuditLogs() {
    const input = document.getElementById('audit-search');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll('#audit-table tbody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(filter) ? '' : 'none';
    });
}
