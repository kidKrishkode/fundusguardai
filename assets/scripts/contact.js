
(function () {
    // 1. Mobile Drawer Navigation Toggle
    const mobileBtn = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', () => {
            const isHidden = mobileDrawer.classList.contains('hidden');
            if (isHidden) {
                mobileDrawer.classList.remove('hidden');
            } else {
                mobileDrawer.classList.add('hidden');
            }
        });
    }

    // 2. Track Selector Tabs Logic
    const trackBtns = document.querySelectorAll('.track-btn');
    const hiddenTrackInput = document.getElementById('selectedTrackInput');
    const trackPills = document.querySelectorAll('[data-select-track]');

    const trackNames = {
        trial: 'Clinical Trial & Hospital Partner',
        feedback: 'Ophthalmologist Diagnostic Feedback',
        academic: 'Academic & Research Collaboration',
        pacs: 'Technical / PACS Integration'
    };

    function activateTrack(trackKey) {
        trackBtns.forEach(btn => {
            if (btn.getAttribute('data-track') === trackKey) {
                btn.classList.add('bg-primary-container', 'text-on-primary', 'font-semibold', 'shadow-sm');
                btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-bright');
            } else {
                btn.classList.remove('bg-primary-container', 'text-on-primary', 'font-semibold', 'shadow-sm');
                btn.classList.add('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-bright');
            }
        });
        if (hiddenTrackInput && trackNames[trackKey]) {
            hiddenTrackInput.value = trackNames[trackKey];
        }
    }

    trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const track = btn.getAttribute('data-track');
            activateTrack(track);
        });
    });

    trackPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const track = pill.getAttribute('data-select-track');
            if (track && trackNames[track]) {
                activateTrack(track);
            }
        });
    });

    // 3. Form Submission Simulation & Confirmation Generation
    const form = document.getElementById('clinicalInquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const resetBtn = document.getElementById('resetBtn');
    const confirmationNotice = document.getElementById('confirmationNotice');
    const referenceCodeNumber = document.getElementById('referenceCodeNumber');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic HTML5 validation check
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-wait');
            submitText.textContent = 'Encrypting & Logging Dossier...';

            setTimeout(() => {
                // Generate a randomized realistic reference token
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                const trackPrefix = (hiddenTrackInput.value.slice(0, 3)).toUpperCase();
                const refString = `#FG-${new Date().getFullYear()}-${trackPrefix}-${randomSuffix}`;

                if (referenceCodeNumber) {
                    referenceCodeNumber.textContent = refString;
                }

                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-wait');
                submitText.textContent = 'Submit Clinical Inquiry';

                // Reveal confirmation card
                if (confirmationNotice) {
                    confirmationNotice.classList.remove('hidden');
                    confirmationNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reset inputs except track
                const currentTrack = hiddenTrackInput.value;
                form.reset();
                hiddenTrackInput.value = currentTrack;
            }, 850);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            if (confirmationNotice) {
                confirmationNotice.classList.add('hidden');
            }
        });
    }

    // 4. Clinical FAQ Accordion Behavior
    const faqButtons = document.querySelectorAll('.faq-toggle');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const content = button.nextElementSibling;
            const icon = button.querySelector('.faq-icon');

            // Close all other accordions for clean clinical focus
            faqButtons.forEach(otherBtn => {
                if (otherBtn !== button) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                    const otherIcon = otherBtn.querySelector('.faq-icon');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle clicked
            if (!isExpanded) {
                button.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                button.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    });

})();
