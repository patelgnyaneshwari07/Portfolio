const fadeSections = document.querySelectorAll(".fade-in");

fadeSections[0]?.classList.add("is-visible");

if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    fadeSections.forEach((section) => fadeObserver.observe(section));
} else {
    fadeSections.forEach((section) => section.classList.add("is-visible"));
}

window.setTimeout(() => {
    fadeSections.forEach((section) => section.classList.add("is-visible"));
}, 1400);

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const interactiveCards = document.querySelectorAll(".project-card, .education-card, .credential-card");
const tetrahedra = document.querySelectorAll(".tetra");
const photoDialog = document.querySelector(".image-dialog");
const photoZoomTrigger = document.querySelector(".photo-zoom-trigger");
const photoDialogClose = document.querySelector(".image-dialog-close");

const updateScrollUi = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${progress})`;
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
};

window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const closePhotoDialog = () => {
    if (photoDialog?.open) photoDialog.close();
};

photoZoomTrigger?.addEventListener("click", () => photoDialog?.showModal());
photoDialogClose?.addEventListener("click", closePhotoDialog);
photoDialog?.addEventListener("click", (event) => {
    if (event.target === photoDialog) closePhotoDialog();
});

const sectionLinks = navLinks.filter((link) => document.querySelector(link.getAttribute("href")));
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`));
    });
}, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
sectionLinks.forEach((link) => sectionObserver.observe(document.querySelector(link.getAttribute("href"))));

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
        projectCards.forEach((card) => {
            const matches = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("is-hidden", !matches);
            card.classList.toggle("is-filtering", matches);
        });
    });
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    interactiveCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - .5;
            const y = (event.clientY - bounds.top) / bounds.height - .5;
            card.style.transform = `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 2}deg) translateY(-4px)`;
        });
        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });

    window.addEventListener("pointermove", (event) => {
        const x = (event.clientX / window.innerWidth - .5) * 14;
        const y = (event.clientY / window.innerHeight - .5) * 14;
        tetrahedra.forEach((tetra, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            tetra.style.marginLeft = `${x * direction}px`;
            tetra.style.marginTop = `${y * direction}px`;
        });
    }, { passive: true });
}
