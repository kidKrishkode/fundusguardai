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
