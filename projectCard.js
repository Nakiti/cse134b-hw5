class ProjectCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const imgSrc = this.getAttribute('img-src') || '';
        const imgSrcset = this.getAttribute('img-srcset') || '';
        const sizes = this.getAttribute('sizes') || '';
        const imgAlt = this.getAttribute('img-alt') || '';
        const github = this.getAttribute('github') || '#';
        const description = this.getAttribute('description') || '';
        const bgColor = this.getAttribute('bg-color') || '#ffffff';
        
        // Parse slideshow images - expects JSON array of image base names (without -N suffix)
        // e.g., ["claimable", "claimable", ...] or full paths
        let slideshowImages = [];
        const slideshowAttr = this.getAttribute('slideshow-images');
        if (slideshowAttr) {
            try {
                slideshowImages = JSON.parse(slideshowAttr);
            } catch (e) {
                console.error('Failed to parse slideshow-images:', e);
            }
        }

        const githubIcon = `
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 018 3.44c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
        `;

        const githubAnchor = `<a class="project-card-github" href="${github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">${githubIcon}</a>`;

        this.innerHTML = `
            <article class="project-card">
                <picture class="project-card-image">
                    <source
                        media="(min-width: 1024px)"
                        srcset="${imgSrcset.split(', ').find(s => s.includes('large')) || imgSrc}"
                    >
                    <source
                        media="(min-width: 768px)"
                        srcset="${imgSrcset.split(', ').find(s => s.includes('medium')) || imgSrc}"
                    >
                    <img 
                        src="${imgSrc}"
                        srcset="${imgSrcset}"
                        sizes="${sizes}"
                        alt="${imgAlt}"
                        loading="lazy"
                    >
                </picture>
                
                <div class="project-card-title-bar" style="background-color: ${bgColor}">
                    <h3>${title}</h3>
                    ${githubAnchor}
                </div>
            </article>
        `;

        this.cardData = {
            title,
            imgSrc,
            imgSrcset,
            description,
            bgColor,
            github,
            slideshowImages
        };

        const article = this.querySelector('.project-card');
        const githubLink = this.querySelector('.project-card-github');
        
        if (article) {
            article.addEventListener('click', (e) => {
                if (e.target === githubLink || githubLink.contains(e.target)) {
                    return;
                }
                this.openModal();
            });
        }
    }

    openModal() {
        const { title, imgSrc, imgSrcset, description, bgColor, github, slideshowImages } = this.cardData;
        
        // Build images array - use slideshow images if provided, otherwise just the main image
        let images = [];
        if (slideshowImages && slideshowImages.length > 0) {
            images = slideshowImages;
        } else {
            // Fallback: just use the main image
            images = [{
                src: imgSrc,
                srcset: imgSrcset
            }];
        }
        
        let currentImageIndex = 0;

        const backdrop = document.createElement('div');
        backdrop.className = 'project-card-modal-backdrop';
        
        // Generate dots HTML
        const dotsHTML = images.length > 1 
            ? `<div class="slideshow-dots">
                ${images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
               </div>`
            : '';
        
        // Generate navigation buttons only if more than one image
        const navButtonsHTML = images.length > 1
            ? `<button class="slideshow-nav slideshow-prev" aria-label="Previous image">&lt;</button>
               <button class="slideshow-nav slideshow-next" aria-label="Next image">&gt;</button>`
            : '';
        
        const modal = document.createElement('div');
        modal.className = 'project-card-modal';
        modal.innerHTML = `
            <div class="project-card-modal-content">
                <button class="project-card-modal-close" aria-label="Close modal">&times;</button>
                
                <div class="project-card-modal-slideshow">
                    <div class="slideshow-container">
                        <picture class="slideshow-picture">
                            <source
                                class="slideshow-source-large"
                                media="(min-width: 1024px)"
                                srcset="${this.getLargeSrc(images[0])}"
                            >
                            <source
                                class="slideshow-source-medium"
                                media="(min-width: 768px)"
                                srcset="${this.getMediumSrc(images[0])}"
                            >
                            <img 
                                class="slideshow-image"
                                src="${this.getMediumSrc(images[0])}"
                                srcset="${images[0].srcset || ''}"
                                sizes="(min-width: 1024px) 800px, (min-width: 768px) 600px, 100vw"
                                alt="${title}"
                                loading="lazy"
                            >
                        </picture>
                        ${navButtonsHTML}
                    </div>
                    ${dotsHTML}
                </div>
                
                <div class="project-card-modal-description">
                    <p>${description || 'No description provided.'}</p>
                </div>
                
                <div class="project-card-modal-title-bar" style="background-color: ${bgColor}">
                    <h2>${title}</h2>
                    <a class="project-card-modal-github" href="${github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 018 3.44c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `;
        
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        
        const slideshowImage = modal.querySelector('.slideshow-image');
        const slideshowSourceLarge = modal.querySelector('.slideshow-source-large');
        const slideshowSourceMedium = modal.querySelector('.slideshow-source-medium');
        const prevBtn = modal.querySelector('.slideshow-prev');
        const nextBtn = modal.querySelector('.slideshow-next');
        const dots = modal.querySelectorAll('.dot');
        
        const updateImage = (index) => {
            currentImageIndex = (index + images.length) % images.length;
            const currentImg = images[currentImageIndex];
            
            // Update the picture sources for responsive loading
            if (slideshowSourceLarge) {
                slideshowSourceLarge.srcset = this.getLargeSrc(currentImg);
            }
            if (slideshowSourceMedium) {
                slideshowSourceMedium.srcset = this.getMediumSrc(currentImg);
            }
            slideshowImage.src = this.getMediumSrc(currentImg);
            slideshowImage.srcset = currentImg.srcset || '';
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentImageIndex);
            });
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateImage(currentImageIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateImage(currentImageIndex + 1);
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                updateImage(parseInt(dot.getAttribute('data-index')));
            });
        });
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        });
        
        const closeBtn = modal.querySelector('.project-card-modal-close');
        closeBtn.addEventListener('click', () => {
            backdrop.remove();
        });
        
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                backdrop.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Helper to extract large src from srcset or image object
    getLargeSrc(img) {
        if (typeof img === 'string') return img;
        if (img.srcset) {
            const largeSrc = img.srcset.split(', ').find(s => s.includes('large'));
            if (largeSrc) return largeSrc.split(' ')[0];
        }
        return img.src || '';
    }
    
    // Helper to extract medium src from srcset or image object  
    getMediumSrc(img) {
        if (typeof img === 'string') return img;
        if (img.srcset) {
            const mediumSrc = img.srcset.split(', ').find(s => s.includes('medium'));
            if (mediumSrc) return mediumSrc.split(' ')[0];
        }
        return img.src || '';
    }
    
    // Helper to extract small src from srcset or image object
    getSmallSrc(img) {
        if (typeof img === 'string') return img;
        if (img.srcset) {
            const smallSrc = img.srcset.split(', ').find(s => s.includes('small'));
            if (smallSrc) return smallSrc.split(' ')[0];
        }
        return img.src || '';
    }
}

customElements.define('project-card', ProjectCard);
