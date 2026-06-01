document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 120; 

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    const revealElements = document.querySelectorAll('.glass-card, .section-title');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (!element.style.transform && !element.classList.contains('revealed')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            }

            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('revealed');
            }
        });
    };


    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});



const projectModal = document.getElementById('projectModal');

const openProjectModal = document.getElementById('openProjectModal');

const closeModal = document.getElementById('closeModal');

openProjectModal.addEventListener('click', () => {

    projectModal.classList.add('show-modal');

});

closeModal.addEventListener('click', () => {

    projectModal.classList.remove('show-modal');

});


window.addEventListener('click', (e) => {

    if (e.target === projectModal) {

        projectModal.classList.remove('show-modal');

    }

});

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');


    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        updateCardBoundaries();
    });


    const mouse = { x: -1000, y: -1000, radius: 120 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });


    let cards = [];
    function updateCardBoundaries() {
        const cardElements = document.querySelectorAll('.glass-card');
        cards = Array.from(cardElements).map(el => {
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left + window.scrollX,
                right: rect.right + window.scrollX,
                top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY
            };
        });
    }

    updateCardBoundaries();
    window.addEventListener('scroll', updateCardBoundaries);


    const petalCount = 25;
    const petals = [];

    class Petal {
        constructor() {
            this.reset();
            this.y = Math.random() * height; 
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -20;
            this.size = Math.random() * 8 + 10; 
            this.speedY = Math.random() * 1.5 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.angle = Math.random() * 360;
            this.spinSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.4 + 0.4;
            this.isLanding = false;
            this.landedTimer = 0;
            this.landedMaxTime = Math.random() * 200 + 150; 
        }

        update() {
  
            if (this.isLanding) {
                this.landedTimer++;
                if (this.landedTimer > this.landedMaxTime) {
                    this.opacity -= 0.01; // Dissolve elegantly
                    if (this.opacity <= 0) this.reset();
                }
                return;
            }

       
            const absoluteY = this.y + window.scrollY;

  
            for (let card of cards) {
                if (this.x > card.left && this.x < card.right &&
                    absoluteY >= card.top - 2 && absoluteY <= card.top + 8) {
                    if (Math.random() > 0.3) { 
                        this.isLanding = true;
                        this.y = card.top - window.scrollY; 
                        return;
                    }
                }
            }

           
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 30) * 0.5; 
            this.angle += this.spinSpeed;

           
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const pushX = (dx / distance) * force * 4;
                const pushY = (dy / distance) * force * 2;

                this.x += pushX;
                this.y += pushY;
            }

           
            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);

           
            ctx.fillStyle = `rgba(255, 220, 245, ${this.opacity})`;

           
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

   
    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
});


const projectGallery = document.getElementById("projectGallery");

const images = [
    "images/benta1.jpeg",
    "images/benta2.jpeg",
    "images/benta3.jpeg",
    "images/benta4.jpeg"
];

let currentImage = 0;

projectGallery.addEventListener("click", (e) => {

    e.stopPropagation();

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }

    projectGallery.src = images[currentImage];

});
