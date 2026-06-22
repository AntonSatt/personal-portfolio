// Typewriter Effect
const typeWriterElement = document.getElementById('typewriter');
const texts = [
    "Platform Engineer",
    "DevOps Engineer",
    "GitOps Practitioner",
    "Cloud Architect",
    "Linux Enthusiast"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typeWriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typeWriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter on load
document.addEventListener('DOMContentLoaded', typeWriter);

// Intersection Observer for Fade-in Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    observer.observe(el);
});

// Smooth scroll to projects section
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Toast notification function with icon support
function showToast(message, type = 'success') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    // Define icons and colors based on type
    const icons = {
        success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>`,
        error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`,
        info: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>`
    };
    
    const colors = {
        success: 'bg-green-500/20 border-green-500/50 text-green-400',
        error: 'bg-red-500/20 border-red-500/50 text-red-400',
        info: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
    };
    
    // Set toast content with icon
    toast.className = `fixed bottom-8 right-8 max-w-md px-6 py-4 ${colors[type]} border rounded-xl shadow-2xl transform translate-y-full opacity-0 transition-all duration-300 z-50 flex items-center gap-3`;
    toast.innerHTML = `
        <div class="flex-shrink-0">${icons[type]}</div>
        <p class="text-white font-medium">${message}</p>
    `;
    
    // Show toast
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    });
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
    }, 4000);
}

// Contact form handling with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
        const formspreeURL = 'https://formspree.io/f/xvzqqbqd';
        
        // Get form data
        const formData = new FormData(this);
        
        // Get all form elements
        const submitButton = this.querySelector('button[type="submit"]');
        const formInputs = this.querySelectorAll('input, textarea');
        const originalButtonHTML = submitButton.innerHTML;
        
        // Disable form during submission
        submitButton.disabled = true;
        formInputs.forEach(input => input.disabled = true);
        
        // Add loading spinner to button
        submitButton.innerHTML = `
            <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
            </span>
        `;
        
        try {
            const response = await fetch(formspreeURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success state
                submitButton.innerHTML = `
                    <span class="flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Message Sent!</span>
                    </span>
                `;
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.disabled = false;
                    formInputs.forEach(input => input.disabled = false);
                }, 3000);
            } else {
                const data = await response.json();
                if (data.errors) {
                    showToast('Error: ' + data.errors.map(error => error.message).join(', '), 'error');
                } else {
                    showToast('Failed to send message. Please try again.', 'error');
                }
                // Re-enable form immediately on error
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = false;
                formInputs.forEach(input => input.disabled = false);
            }
        } catch (error) {
            showToast('Network error. Please check your connection and try again.', 'error');
            console.error('Form submission error:', error);
            // Re-enable form immediately on error
            submitButton.innerHTML = originalButtonHTML;
            submitButton.disabled = false;
            formInputs.forEach(input => input.disabled = false);
        }
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// About Me Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let sliderInterval;

function showSlide(index) {
    if (slides.length === 0) return;
    
    slides.forEach(slide => {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0');
    });
    
    indicators.forEach(ind => {
        ind.classList.remove('bg-white');
        ind.classList.add('bg-white/50');
    });
    
    slides[index].classList.remove('opacity-0');
    slides[index].classList.add('opacity-100');
    
    indicators[index].classList.remove('bg-white/50');
    indicators[index].classList.add('bg-white');
    
    currentSlide = index;
}

function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function setSlide(index) {
    showSlide(index);
    resetTimer();
}

function startSlider() {
    if(slides.length > 0) {
        const currentDuration = parseInt(slides[currentSlide].getAttribute('data-duration')) || 5000;
        sliderInterval = setTimeout(() => {
            nextSlide();
            startSlider(); // Recursively call to set next timeout
        }, currentDuration);
    }
}

function resetTimer() {
    clearTimeout(sliderInterval);
    startSlider();
}

// Initialize slider
startSlider();

// Timeline Accordion
function toggleTimeline(button) {
    const item = button.closest('.timeline-item');
    const content = item.querySelector('.timeline-content');
    const chevron = button.querySelector('svg');
    const isExpanded = item.dataset.expanded === 'true';

    if (isExpanded) {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
        item.dataset.expanded = 'false';
    } else {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
        item.dataset.expanded = 'true';
    }
}

// Program progress bar: fraction of the 2-year program elapsed (Sept 2025 to Sept 2027)
document.addEventListener('DOMContentLoaded', function() {
    const bar = document.getElementById('program-progress');
    if (!bar) return;
    const start = new Date('2025-09-01').getTime();
    const end = new Date('2027-09-01').getTime();
    const now = Date.now();
    const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
    bar.style.width = pct.toFixed(1) + '%';
    const weekEl = document.getElementById('program-week');
    if (weekEl) {
        const week = Math.min(104, Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 7))));
        weekEl.textContent = week;
    }
});

