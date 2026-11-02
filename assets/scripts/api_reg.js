
// 1. Password Visibility Toggle
window.togglePasswordVisibility = function (inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility';
    }
};

// 2. Interactive Tag Pills Toggle
window.toggleTag = function (btn) {
    if (btn.classList.contains('bg-primary-container')) {
        btn.classList.remove('bg-primary-container', 'text-white', 'shadow-sm');
        btn.classList.add('bg-surface-container-high', 'text-zinc-300');
    } else {
        btn.classList.add('bg-primary-container', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-surface-container-high', 'text-zinc-300');
    }
};

// 3. SDK Installation Tabs
let currentSdk = 'npm';
window.switchSdkTab = function (type) {
    currentSdk = type;
    const npmBtn = document.getElementById('tab-npm');
    const pipBtn = document.getElementById('tab-pip');
    const cmdText = document.getElementById('sdk-install-cmd');

    if (type === 'npm') {
        npmBtn.classList.add('bg-surface-container', 'text-white');
        npmBtn.classList.remove('text-text-secondary');
        pipBtn.classList.remove('bg-surface-container', 'text-white');
        pipBtn.classList.add('text-text-secondary');
        cmdText.textContent = 'npm i @fundusguard/ai-sdk';
    } else {
        pipBtn.classList.add('bg-surface-container', 'text-white');
        pipBtn.classList.remove('text-text-secondary');
        npmBtn.classList.remove('bg-surface-container', 'text-white');
        npmBtn.classList.add('text-text-secondary');
        cmdText.textContent = 'pip install fundusguard-ai';
    }
};

window.copyCurrentSdkCmd = function () {
    const cmd = document.getElementById('sdk-install-cmd').textContent;
    window.copyToClipboard(cmd, 'Command copied!');
};

// 4. Form Validation & Modal Trigger
window.handleFormSubmit = function () {
    const name = document.getElementById('dev-name').value.trim();
    const email = document.getElementById('dev-email').value.trim();
    const pwd = document.getElementById('dev-password').value;
    const pwdConfirm = document.getElementById('dev-password-confirm').value;
    const terms = document.getElementById('terms-agree').checked;
    const errBox = document.getElementById('form-error');
    const errMsg = document.getElementById('form-error-msg');

    if (!name || !email || !pwd || !pwdConfirm) {
        errMsg.textContent = 'Please fill out all required developer identity credentials.';
        errBox.classList.remove('hidden');
        errBox.classList.add('flex');
        return;
    }

    if (pwd !== pwdConfirm) {
        errMsg.textContent = 'Secret passkeys do not match. Please re-enter.';
        errBox.classList.remove('hidden');
        errBox.classList.add('flex');
        return;
    }

    if (!terms) {
        errMsg.textContent = 'You must acknowledge the Investigational CDSS Terms & Clinical Privacy Protocols.';
        errBox.classList.remove('hidden');
        errBox.classList.add('flex');
        return;
    }

    errBox.classList.add('hidden');
    errBox.classList.remove('flex');

    // Populate target email and open OTP Modal
    document.getElementById('modal-target-email').textContent = email;
    const modalBackdrop = document.getElementById('registration-modal-backdrop');
    modalBackdrop.classList.remove('hidden');
    modalBackdrop.classList.add('flex');

    // Reset modal state
    document.getElementById('flow-phase-otp').classList.remove('hidden');
    document.getElementById('flow-phase-otp').classList.add('flex');
    document.getElementById('flow-phase-processing').classList.add('hidden');
    document.getElementById('flow-phase-processing').classList.remove('flex');
};

window.closeRegisterModal = function () {
    const modalBackdrop = document.getElementById('registration-modal-backdrop');
    modalBackdrop.classList.add('hidden');
    modalBackdrop.classList.remove('flex');
};

// 5. OTP Inputs auto focus advance
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// 6. OTP Verification and Loading State Progression
window.submitOtpVerification = function () {
    let enteredCode = '';
    otpInputs.forEach(i => enteredCode += i.value);

    if (enteredCode !== '123456' && enteredCode.length !== 6) {
        document.getElementById('otp-error-msg').classList.remove('hidden');
        return;
    }

    document.getElementById('otp-error-msg').classList.add('hidden');

    // Transition to Queue Loading State
    document.getElementById('flow-phase-otp').classList.add('hidden');
    document.getElementById('flow-phase-otp').classList.remove('flex');
    const proc = document.getElementById('flow-phase-processing');
    proc.classList.remove('hidden');
    proc.classList.add('flex');

    const steps = [
        { text: "Verifying developer credentials...", progress: "25%" },
        { text: "Allocating neural model inference quota on SPI-OWL cluster...", progress: "50%" },
        { text: "Generating 256-bit secret token...", progress: "75%" },
        { text: "Finalizing workspace credentials...", progress: "100%" }
    ];

    let stepIndex = 0;
    const statusText = document.getElementById('provisioning-status-text');
    const progressBar = document.getElementById('provision-progress-fill');

    const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
            statusText.textContent = steps[stepIndex].text;
            progressBar.style.width = steps[stepIndex].progress;
        } else {
            clearInterval(interval);
            // Complete modal and reveal Success Key State
            window.closeRegisterModal();

            const regForm = document.getElementById('api-registration-form');
            const successCard = document.getElementById('success-token-card');
            regForm.classList.add('hidden');
            successCard.classList.remove('hidden');
            successCard.classList.add('flex');

            window.copyToClipboard('fg_live_99f3a817b204e19d', 'API key generated and copied!');
        }
    }, 700);
};

// 7. Secret Token Reveal Toggle
let secretRevealed = false;
window.toggleSecretReveal = function () {
    secretRevealed = !secretRevealed;
    const disp = document.getElementById('api-secret-display');
    const btnText = document.getElementById('secret-reveal-text');
    const btnIcon = document.getElementById('secret-reveal-icon');

    if (secretRevealed) {
        disp.textContent = 'fg_sec_48a1c99f92ad41c8801b7a2d';
        btnText.textContent = 'Hide';
        btnIcon.textContent = 'visibility_off';
    } else {
        disp.textContent = 'fg_sec_48a1c99f••••••••••••';
        btnText.textContent = 'Reveal';
        btnIcon.textContent = 'visibility';
    }
};

// 8. Clipboard Copy Helper with Toast
window.copyToClipboard = function (text, customMsg) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copy-toast');
        const toastText = document.getElementById('copy-toast-text');
        if (customMsg) toastText.textContent = customMsg;
        else toastText.textContent = 'Key copied to clipboard!';
        toast.classList.remove('translate-y-24', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 2500);
    }).catch(err => {
        console.warn('Clipboard write error: ', err);
    });
};

// 9. Resend OTP countdown
window.resendOtp = function () {
    const cd = document.getElementById('otp-countdown');
    cd.textContent = '59s';
    let timeLeft = 59;
    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            cd.textContent = 'Ready';
        } else {
            cd.textContent = timeLeft + 's';
        }
    }, 1000);
};

// 10. Theme Toggle
(function () {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const toggleIcon = document.getElementById('theme-toggle-icon');
    const html = document.documentElement;

    function updateIcon(isDark) {
        if (toggleIcon) {
            toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
    }

    const stored = localStorage.getItem('fg_theme');
    const isDarkInit = stored ? stored === 'dark' : true;
    if (isDarkInit) html.classList.add('dark');
    else html.classList.remove('dark');
    updateIcon(isDarkInit);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('fg_theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);
        });
    }
})();
