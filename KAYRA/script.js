/* =========================================
   KAYRA
   SLIDE + NPC DIALOGUE STYLE TEXT ANIMATION
========================================= */

const slides = Array.from(document.querySelectorAll(".slide"));
const navButtons = document.querySelectorAll(".nav-links button");
const mobileNavButtons = document.querySelectorAll(".mobile-nav-link");
const previousButton = document.getElementById("previousSlide");
const nextButton = document.getElementById("nextSlide");
const slideCounter = document.getElementById("slideCounter");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

let currentSlide = 0;

/* =========================================
   TEXT ANIMATION PREPARATION
========================================= */

function prepareTextAnimation() {
    const animatedElements = document.querySelectorAll(".animated-heading, .animate-text");
    animatedElements.forEach(element => {
        if (!element.dataset.originalHTML) {
            element.dataset.originalHTML = element.innerHTML;
        }
    });
}

function resetAnimatedText(slideElement) {
    const animatedElements = slideElement.querySelectorAll(".animated-heading, .animate-text");
    animatedElements.forEach(element => {
        if (element.dataset.originalHTML) {
            element.innerHTML = element.dataset.originalHTML;
        }
    });
}

function animateSlideText(slideElement) {
    resetAnimatedText(slideElement);
    const animatedElements = slideElement.querySelectorAll(".animated-heading, .animate-text");
    
    let globalCharIndex = 0;

    animatedElements.forEach(element => {
        const wrapTextNodes = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue;
                const fragment = document.createDocumentFragment();
                const words = text.split(/(\s+)/);

                words.forEach(word => {
                    if (word.trim() === "") {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const wordSpan = document.createElement("span");
                        wordSpan.className = "word";

                        for (let i = 0; i < word.length; i++) {
                            const charSpan = document.createElement("span");
                            charSpan.className = "char";
                            charSpan.textContent = word[i];
                            charSpan.style.animationDelay = `${globalCharIndex * 0.025}s`;
                            globalCharIndex++;
                            wordSpan.appendChild(charSpan);
                        }
                        fragment.appendChild(wordSpan);
                    }
                });

                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(wrapTextNodes);
            }
        };

        wrapTextNodes(element);
    });
}

/* =========================================
   SKILL CARDS ANIMATION
========================================= */

function triggerSkillCards(slideElement) {
    const cards = slideElement.querySelectorAll(".skill-card");
    cards.forEach((card, index) => {
        card.classList.remove("skill-card-visible");
        setTimeout(() => {
            card.classList.add("skill-card-visible");
        }, 150 * index + 300);
    });
}

/* =========================================
   SLIDE SWITCHING LOGIC
========================================= */

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;

    slides[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");

    // Update active navbar button
    navButtons.forEach((btn, i) => {
        btn.classList.toggle("active", i === currentSlide);
    });

    // Update slide counter text
    if (slideCounter) {
        const slideNum = String(currentSlide + 1).padStart(2, "0");
        const totalSlides = String(slides.length).padStart(2, "0");
        slideCounter.textContent = `${slideNum} / ${totalSlides}`;
    }

    // Trigger animations for the new active slide
    animateSlideText(slides[currentSlide]);
    triggerSkillCards(slides[currentSlide]);

    // Close mobile menu if open
    if (mobileMenu) mobileMenu.classList.remove("open");
}

/* =========================================
   EVENT LISTENERS
========================================= */

if (nextButton) {
    nextButton.addEventListener("click", () => {
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0);
        }
    });
}

if (previousButton) {
    previousButton.addEventListener("click", () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(slides.length - 1);
        }
    });
}

navButtons.forEach((button, index) => {
    button.addEventListener("click", () => goToSlide(index));
});

mobileNavButtons.forEach((button, index) => {
    button.addEventListener("click", () => goToSlide(index));
});

document.querySelectorAll("[data-slide-target]").forEach(button => {
    button.addEventListener("click", (e) => {
        const target = parseInt(e.target.getAttribute("data-slide-target"), 10);
        if (!isNaN(target)) goToSlide(target);
    });
});

if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });
}

// Keyboard arrow navigation
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
    }
});

/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
    prepareTextAnimation();
    goToSlide(0);
});
