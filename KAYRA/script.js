
/* =========================================
   KAYRA
   SLIDE + FAST NPC DIALOGUE STYLE TEXT
========================================= */

const slides = Array.from(
    document.querySelectorAll(".slide")
);

const navButtons = document.querySelectorAll(
    ".nav-links button"
);

const mobileNavButtons = document.querySelectorAll(
    ".mobile-nav-link"
);

const previousButton =
    document.getElementById("previousSlide");

const nextButton =
    document.getElementById("nextSlide");

const slideCounter =
    document.getElementById("slideCounter");

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

let currentSlide = 0;


/* =========================================
   TEXT ANIMATION PREPARATION
========================================= */

function prepareTextAnimation() {

    const animatedElements =
        document.querySelectorAll(
            ".animated-heading, .animate-text"
        );

    animatedElements.forEach(element => {

        element.dataset.originalHTML =
            element.innerHTML;

    });

}


/* =========================================
   GET TEXT NODES
========================================= */

function collectTextNodes(
    element,
    result
) {

    const walker =
        document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );

    let node;

    while (
        node = walker.nextNode()
    ) {

        result.push(node);

    }

}


/* =========================================
   NPC DIALOGUE STYLE TEXT
========================================= */

function typeElement(
    element,
    speed
) {

    if (
        !element.dataset.originalHTML
    ) {
        return;
    }


    /*
        Save the original HTML.

        This lets us keep:

        <span class="highlight">
            DIRECTION
        </span>

        red while the letters appear.
    */

    const originalHTML =
        element.dataset.originalHTML;


    /*
        Create a temporary container
        containing the original structure.
    */

    const template =
        document.createElement("div");

    template.innerHTML =
        originalHTML;


    /*
        Get all original text nodes.
    */

    const originalTextNodes = [];

    collectTextNodes(
        template,
        originalTextNodes
    );


    /*
        Create the same HTML structure
        inside the real element.
    */

    element.innerHTML =
        template.innerHTML;


    /*
        Get the newly created text nodes.
    */

    const visibleTextNodes = [];

    collectTextNodes(
        element,
        visibleTextNodes
    );


    /*
        Store the original text for
        every text node.
    */

    const textData =
        originalTextNodes.map(
            node => node.textContent
        );


    /*
        Clear all visible text.
    */

    visibleTextNodes.forEach(
        node => {

            node.textContent = "";

        }
    );


    /*
        Flatten every character into
        ONE continuous sequence.

        This is the important part.

        There is NO waiting between:

        BUILD
        YOUR
        K
        FUTURE

        Everything is treated as one
        continuous typing sequence.
    */

    const characters = [];


    textData.forEach(
        (text, nodeIndex) => {

            for (
                let i = 0;
                i < text.length;
                i++
            ) {

                characters.push({
                    nodeIndex: nodeIndex,
                    character: text[i]
                });

            }

        }
    );


    let characterIndex = 0;


    /*
        TYPE ONE CHARACTER
    */

    function typeCharacter() {

        if (
            characterIndex >=
            characters.length
        ) {
            return;
        }


        const current =
            characters[characterIndex];


        const targetNode =
            visibleTextNodes[
                current.nodeIndex
            ];


        /*
            Add the next character.

            Previous characters remain.

            Example:

            B
            BU
            BUI
            BUIL
            BUILD
        */

        targetNode.textContent +=
            current.character;


        characterIndex++;


        /*
            Very small delay.

            25ms for headings gives
            the fast MACHINE: ZERO feel.

            No gap between words.
        */

        setTimeout(
            typeCharacter,
            speed
        );

    }


    typeCharacter();

}


/* =========================================
   ANIMATE SLIDE TEXT
========================================= */

function animateSlideText(slide) {

    const elements =
        slide.querySelectorAll(
            ".animated-heading, .animate-text"
        );


    elements.forEach(
        (element, index) => {

            /*
                Headings:
                25ms per character

                Paragraphs:
                12ms per character
            */

            const speed =
                element.classList.contains(
                    "animated-heading"
                )
                    ? 25
                    : 12;


            /*
                Small delay between separate
                elements, but NO gap between
                characters inside them.
            */

            setTimeout(
                () => {

                    typeElement(
                        element,
                        speed
                    );

                },

                index * 120
            );

        }
    );

}


/* =========================================
   SHOW SLIDE
========================================= */

function showSlide(index) {

    if (
        index < 0
    ) {

        index =
            slides.length - 1;

    }


    if (
        index >= slides.length
    ) {

        index = 0;

    }


    currentSlide = index;


    /* =====================================
       ACTIVATE SLIDE
    ====================================== */

    slides.forEach(
        (slide, i) => {

            slide.classList.toggle(
                "active",
                i === currentSlide
            );

        }
    );


    /* =====================================
       NAVIGATION ACTIVE STATE
    ====================================== */

    navButtons.forEach(
        button => {

            const buttonSlide =
                Number(
                    button.dataset.slide
                );

            button.classList.toggle(
                "active",
                buttonSlide === currentSlide
            );

        }
    );


    /* =====================================
       SLIDE COUNTER
    ====================================== */

    if (slideCounter) {

        slideCounter.textContent =
            `${String(
                currentSlide + 1
            ).padStart(2, "0")} / ${String(
                slides.length
            ).padStart(2, "0")}`;

    }


    /* =====================================
       RESET SCROLL
    ====================================== */

    if (
        slides[currentSlide]
    ) {

        slides[currentSlide].scrollTop = 0;

    }


    /* =====================================
       START TEXT ANIMATION
    ====================================== */

    setTimeout(
        () => {

            animateSlideText(
                slides[currentSlide]
            );

        },

        120
    );


    /* =====================================
       SKILL CARDS
    ====================================== */

    if (
        currentSlide === 2
    ) {

        animateSkillCards();

    }

}


/* =========================================
   NEXT SLIDE
========================================= */

function nextSlide() {

    showSlide(
        currentSlide + 1
    );

}


/* =========================================
   PREVIOUS SLIDE
========================================= */

function previousSlide() {

    showSlide(
        currentSlide - 1
    );

}


/* =========================================
   DESKTOP NAVIGATION
========================================= */

navButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                showSlide(
                    Number(
                        button.dataset.slide
                    )
                );

            }
        );

    }
);


/* =========================================
   MOBILE NAVIGATION
========================================= */

mobileNavButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                showSlide(
                    Number(
                        button.dataset.slide
                    )
                );


                mobileMenu.classList.remove(
                    "open"
                );

            }
        );

    }
);


/* =========================================
   MOBILE MENU
========================================= */

if (
    menuButton
) {

    menuButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================
   PREVIOUS BUTTON
========================================= */

if (
    previousButton
) {

    previousButton.addEventListener(
        "click",
        previousSlide
    );

}


/* =========================================
   NEXT BUTTON
========================================= */

if (
    nextButton
) {

    nextButton.addEventListener(
        "click",
        nextSlide
    );

}


/* =========================================
   INTERNAL SLIDE BUTTONS
========================================= */

document
    .querySelectorAll(
        "[data-slide-target]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    showSlide(
                        Number(
                            button.dataset.slideTarget
                        )
                    );

                }
            );

        }
    );


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowRight" ||
            event.key === "PageDown"
        ) {

            nextSlide();

        }


        if (
            event.key === "ArrowLeft" ||
            event.key === "PageUp"
        ) {

            previousSlide();

        }

    }
);


/* =========================================
   SKILL CARD ANIMATION
========================================= */

function animateSkillCards() {

    const cards =
        document.querySelectorAll(
            ".skill-card"
        );


    cards.forEach(
        card => {

            card.classList.remove(
                "skill-card-visible"
            );

        }
    );


    cards.forEach(
        (card, index) => {

            setTimeout(
                () => {

                    card.classList.add(
                        "skill-card-visible"
                    );

                },

                350 +
                (
                    index * 450
                )
            );

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

prepareTextAnimation();

showSlide(0);

