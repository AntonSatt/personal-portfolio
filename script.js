// Calculate current week number (started Sept 1, 2025)
function updateWeekNumber() {
    const startDate = new Date('2025-09-01');
    const today = new Date();
    const weeks = Math.floor((today - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const remaining = 104 - weeks;
    
    document.querySelectorAll('.week-number').forEach(el => el.textContent = ` ${weeks} `);
    document.querySelectorAll('.weeks-remaining').forEach(el => el.textContent = remaining);
}

// Smooth scroll to projects section
function scrollToProjects() {
    document.getElementById('projects').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Toast notification function
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update week numbers on page load
updateWeekNumber();

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: this.elements['name'].value,
        email: this.elements['email'].value,
        message: this.elements['message'].value
    };
    
    // Show success message
    showToast('Message sent! I\'ll get back to you soon.');
    
    // Reset form
    this.reset();
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
});