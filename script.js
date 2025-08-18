// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const nav = document.querySelector('nav');
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // FAQ accordion functionality - updated for new structure
    window.toggleFaq = function(element) {
        const answer = element.nextElementSibling;
        const icon = element.querySelector('i');
        
        // Close other open FAQs
        document.querySelectorAll('#faq .bg-white').forEach(faqItem => {
            const otherAnswer = faqItem.querySelector('.hidden');
            const otherIcon = faqItem.querySelector('i.fa-chevron-down');
            if (otherAnswer && otherAnswer !== answer && !otherAnswer.classList.contains('hidden')) {
                otherAnswer.classList.add('hidden');
                if (otherIcon) {
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Toggle current FAQ
        if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            answer.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    };

    // Form handling
    const betaForm = document.getElementById('betaForm');
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('floorPlan');
    const filePreview = document.getElementById('filePreview');

    // File upload drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileDropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        fileDropZone.classList.add('border-primary', 'bg-primary/5');
        fileDropZone.classList.remove('border-gray-300');
    }

    function unhighlight() {
        fileDropZone.classList.remove('border-primary', 'bg-primary/5');
        fileDropZone.classList.add('border-gray-300');
    }

    fileDropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    // Make file drop zone clickable
    fileDropZone.addEventListener('click', function() {
        fileInput.click();
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                showFilePreview(file);
            } else {
                alert('Proszę wybrać plik PDF, JPG lub PNG');
            }
        }
    }

    function showFilePreview(file) {
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        filePreview.innerHTML = `
            <div class="flex items-center gap-4">
                <i class="fas fa-file-alt text-2xl text-primary"></i>
                <div class="flex-1">
                    <div class="font-semibold text-neutral">${fileName}</div>
                    <div class="text-sm text-neutral-rest">${fileSize} MB</div>
                </div>
                <i class="fas fa-check-circle text-xl text-success"></i>
            </div>
        `;
        filePreview.classList.remove('hidden');
    }

    // Form submission
    betaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        const submitBtn = betaForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            submitBtn.disabled = false;
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            betaForm.reset();
            filePreview.classList.add('hidden');
            filePreview.innerHTML = '';
        }, 2000);
    });

    function validateForm() {
        const requiredFields = betaForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc2626';
                isValid = false;
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        });

        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.style.borderColor = '#dc2626';
            isValid = false;
        }

        // Validate file
        if (!fileInput.files.length) {
            fileDropZone.style.borderColor = '#dc2626';
            isValid = false;
        } else {
            fileDropZone.style.borderColor = '#d1d5db';
        }

        // Validate data consent
        const dataConsent = document.getElementById('dataConsent');
        if (!dataConsent.checked) {
            dataConsent.parentElement.style.color = '#dc2626';
            isValid = false;
        } else {
            dataConsent.parentElement.style.color = '#374151';
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = betaForm.querySelector('[style*="border-color: rgb(220, 38, 38)"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isValid;
    }

    // Modal functionality
    window.showSuccessModal = function() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('hidden');
    };

    window.closeModal = function() {
        const modal = document.getElementById('successModal');
        modal.classList.add('hidden');
    };

    // Close modal on outside click
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.transition-transform').forEach(el => {
        observer.observe(el);
    });

    // Floor plan hover effect
    const floorPlan = document.querySelector('.floor-plan');
    if (floorPlan) {
        floorPlan.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.05)';
        });
        
        floorPlan.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(-5deg) rotateX(5deg) scale(1)';
        });
    }

    // Analytics tracking (placeholder)
    window.trackEvent = function(category, action, label) {
        // Google Analytics tracking would go here
        console.log('Track event:', category, action, label);
    };

    // Track form interactions
    betaForm.addEventListener('submit', () => trackEvent('Form', 'Submit', 'Beta Registration'));
    
    document.querySelectorAll('a[href="#beta-form"], button[type="submit"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim();
            trackEvent('Button', 'Click', text);
        });
    });

    // Performance optimization: Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add loading states to navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function() {
            // Add active state
            document.querySelectorAll('nav a[href^="#"]').forEach(l => l.classList.remove('text-primary'));
            this.classList.add('text-primary');
        });
    });

    // Add custom validation messages
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('invalid', function() {
        if (this.validity.valueMissing) {
            this.setCustomValidity('Proszę podać adres email');
        } else if (this.validity.typeMismatch) {
            this.setCustomValidity('Proszę podać prawidłowy adres email');
        }
    });

    emailInput.addEventListener('input', function() {
        this.setCustomValidity('');
    });

    // Add tooltips for features (Tailwind hover effects are already applied)
    const features = document.querySelectorAll('.transition-transform');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            if (!this.classList.contains('hover:-translate-y-2')) {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        feature.addEventListener('mouseleave', function() {
            if (!this.classList.contains('hover:-translate-y-2')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    console.log('MieszkaniaAI landing page loaded successfully! 🏠🤖');
});
