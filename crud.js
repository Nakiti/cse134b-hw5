
const STORAGE_KEY = 'myLocalProjects';
let projects = [];          

const itemsList = document.getElementById('items-list');
const form = document.getElementById('crud-form');
const formTitle = document.getElementById('form-title');
const btnSave = document.getElementById('btn-save');
const btnDelete = document.getElementById('btn-delete');
const btnNew = document.getElementById('btn-new');

const inputId = document.getElementById('project-id');
const inputTitle = document.getElementById('title');
const inputImgSrc = document.getElementById('img-src');
const inputImgAlt = document.getElementById('img-alt');
const inputLink = document.getElementById('link');
const inputBgColor = document.getElementById('bg-color');

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    renderList();
    
    resetForm();
});


function loadProjects() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        projects = JSON.parse(storedData);
    } else {
        projects = [];
    }
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    renderList();
}

function renderList() {
    itemsList.innerHTML = ''; 

    if (projects.length === 0) {
        itemsList.innerHTML = '<li style="padding:1rem; opacity:0.7;">No projects found.</li>';
        return;
    }

    projects.forEach((project, index) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        
        btn.className = 'project-list-item';
        btn.innerHTML = `
            <span class="color-dot" style="background:${project.bgColor}"></span>
            ${project.title || 'Untitled Project'}
        `;
        
        btn.onclick = () => loadProjectIntoForm(index);
        
        li.appendChild(btn);
        itemsList.appendChild(li);
    });
}

function loadProjectIntoForm(index) {
    const project = projects[index];
    
    formTitle.textContent = `Edit: ${project.title}`;
    
    inputId.value = index; 
    inputTitle.value = project.title || '';
    inputImgSrc.value = project.imgSrc || '';
    inputImgAlt.value = project.imgAlt || '';
    inputLink.value = project.href || 'projects.html'; 
    inputBgColor.value = project.bgColor || '#ffffff';
    
    btnDelete.style.display = 'inline-block';
}

function resetForm() {
    form.reset();
    inputId.value = ''; 
    formTitle.textContent = 'Create New Project';
    btnDelete.style.display = 'none'; 
    inputBgColor.value = '#ffffff';
}

btnNew.addEventListener('click', () => {
    resetForm();
});

form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const id = inputId.value;
    
    const projectData = {
        title: inputTitle.value,
        imgSrc: inputImgSrc.value,
        imgSrcset: `${inputImgSrc.value} 400w, ${inputImgSrc.value} 800w`, 
        sizes: "(min-width: 768px) 33vw, 100vw",
        imgAlt: inputImgAlt.value,
        href: inputLink.value,
        bgColor: inputBgColor.value
    };

    if (id === '') {
        projects.push(projectData);
        alert('Project Created!');
    } else {
        projects[parseInt(id)] = projectData;
        alert('Project Updated!');
    }

    saveToStorage(); 
    resetForm();     
});

btnDelete.addEventListener('click', () => {
    const id = inputId.value;
    
    if (id !== '' && confirm('Are you sure you want to delete this project?')) {
        projects.splice(parseInt(id), 1); 
        saveToStorage();
        resetForm();
    }
});