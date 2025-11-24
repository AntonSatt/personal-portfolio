// Typewriter Effect
const typeWriterElement = document.getElementById('typewriter');
const texts = [
    "DevOps Engineer",
    "Cloud Architect",
    "Automation Expert",
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

// Calculate current week number (started Sept 1, 2025)
function updateWeekNumber() {
    const startDate = new Date('2025-09-01');
    const today = new Date();
    // Calculate difference in milliseconds
    const diffTime = Math.abs(today - startDate);
    // Calculate difference in weeks
    const weeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)); 
    const remaining = 104 - weeks;
    
document.querySelectorAll('.week-number').forEach(el => el.textContent = weeks);
    document.querySelectorAll('.weeks-remaining').forEach(el => el.textContent = remaining);
}

// Smooth scroll to projects section
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Toast notification function
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-8 right-8 px-6 py-4 bg-slate-800 border border-cyan-500/50 rounded-xl text-white shadow-2xl transform translate-y-full opacity-0 transition-all duration-300 z-50';
        document.body.appendChild(toast);
    }
    
toast.textContent = message;
    // Show toast
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    });
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
    }, 3000);
}

// Update week numbers on page load
updateWeekNumber();

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Show success message
        showToast('Message sent! I\'ll get back to you soon.');
        
        // Reset form
        this.reset();
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData);
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

