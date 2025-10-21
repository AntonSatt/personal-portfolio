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