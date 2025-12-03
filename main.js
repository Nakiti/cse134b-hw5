const localData = [
    {
        "title": "Claimable AI",
        "imgSrc": "assets/medium/claimable-1.png",
        "imgSrcset": "assets/small/claimable-1.png 400w, assets/medium/claimable-1.png 800w, assets/large/claimable-1.png 1200w",
        "sizes": "(min-width: 768px) 33vw, 100vw",
        "imgAlt": "A screenshot of the Claimable AI project interface",
        "href": "projects.html",
        "bgColor": "#DDD6FE",
        "description": "Claimable AI is an innovative platform that leverages artificial intelligence to help users identify and claim financial benefits they may be eligible for. The system uses advanced natural language processing to understand user situations and matches them with applicable programs."
    },
    {
        "title": "Fulfill AI",
        "imgSrc": "assets/medium/fulfill-1.png",
        "imgSrcset": "assets/small/fulfill-1.png 400w, assets/medium/fulfill-1.png 800w, assets/large/fulfill-1.png 1200w",
        "sizes": "(min-width: 768px) 33vw, 100vw",
        "imgAlt": "Screenshot of Fulfill AI Project",
        "href": "projects.html",
        "bgColor": "#FED7AA",
        "description": "Fulfill AI is a comprehensive tool designed to streamline order fulfillment processes using artificial intelligence. It optimizes inventory management, predicts demand patterns, and automates the fulfillment workflow to reduce errors and improve delivery times."
    },
    {
        "title": "Ecommerce Web Scraper",
        "imgSrc": "assets/medium/ecommerce-1.png",
        "imgSrcset": "assets/small/ecommerce-1.png 400w, assets/medium/ecommerce-1.png 800w, assets/large/ecommerce-1.png 1200w",
        "sizes": "(min-width: 768px) 33vw, 100vw",
        "imgAlt": "Screenshot of Ecommerce Scraper Project",
        "href": "projects.html",
        "bgColor": "#FBCFE8",
        "description": "The Ecommerce Web Scraper is a powerful tool built to extract product data from multiple online retailers. It collects pricing information, product details, and availability data in real-time, enabling competitive analysis and market research."
    }
];

const cardContainer = document.querySelector('.project-card-container');
const loadLocalBtn = document.getElementById('load-local');
const loadRemoteBtn = document.getElementById('load-remote');

const BIN_ID = '692fe72943b1c97be9d46e7a'; 
const API_KEY = '$2a$10$eerLTsJLDYhO6IlxwvwnUOQD6veIe/Jzbu9zyYGiSwKiU.Q6Cuyvi '; 

function renderCards(projects) {
    cardContainer.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('project-card');

        card.setAttribute('title', project.title);
        card.setAttribute('img-src', project.imgSrc);
        card.setAttribute('img-srcset', project.imgSrcset);
        card.setAttribute('sizes', project.sizes);
        card.setAttribute('img-alt', project.imgAlt);
        // Use `github` attribute for the repository link (falls back to '#')
        card.setAttribute('github', project.github || '#');
        card.setAttribute('bg-color', project.bgColor);
        // Set the description attribute
        card.setAttribute('description', project.description || '');

        cardContainer.appendChild(card);
    });
}

function loadLocal() {
    const storedData = localStorage.getItem('myLocalProjects');
    
    if (storedData) {
        const projects = JSON.parse(storedData);
        console.log('Loaded from LocalStorage:', projects);
        renderCards(projects);
    } else {
        console.error('No local data found!');
    }
}

async function loadRemote() {
    try {
        cardContainer.innerHTML = '<p style="text-align:center; color:white;">Loading remote data...</p>';

        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            headers: {
                'X-Master-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const projects = data.record; 
        
        console.log('Loaded from Remote:', projects);
        renderCards(projects);

    } catch (error) {
        console.error('Error fetching remote data:', error);
        cardContainer.innerHTML = '<p style="text-align:center; color:red;">Error loading data.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('myLocalProjects')) {
        localStorage.setItem('myLocalProjects', JSON.stringify(localData));
    }

    loadLocalBtn.addEventListener('click', loadLocal);
    loadRemoteBtn.addEventListener('click', loadRemote);
});