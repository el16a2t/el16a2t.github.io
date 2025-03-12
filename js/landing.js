const left = document.querySelector('.left');
const right = document.querySelector('.right');
const container = document.querySelector('.container');

// Add hover effects
left.addEventListener('mouseenter', () => {
    container.classList.add('hover-left');
});

left.addEventListener('mouseleave', () => {
    container.classList.remove('hover-left');
});

right.addEventListener('mouseenter', () => {
    container.classList.add('hover-right');
});

right.addEventListener('mouseleave', () => {
    container.classList.remove('hover-right');
});

// Add some subtle animation for buttons
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateX(-50%) scale(1.05)';
        button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateX(-50%) scale(1)';
        button.style.boxShadow = 'none';
    });
});