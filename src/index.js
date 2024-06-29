const API_URL = 'https://script.google.com/macros/s/AKfycbygs3e3zkkJnjyYDVUT-waLOBHUAuf0e5MPHP574CyEXXT3MHZP15GT2bOZRHKzGtPf/exec';

async function fetchData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

function createTimelineEvent(event) {
    return `
        <div class="event" data-category="${event.Category}">
            <div class="event-content">
                <h3>${event.Title}</h3>
                <p><strong>${event.Year}-${event.Month.toString().padStart(2, '0')}-${event.Day.toString().padStart(2, '0')}</strong></p>
                <img src="${event.Media}" alt="${event.Title}">
                <p>${event.Description}</p>
                <span class="category">${event.Category}</span>
            </div>
        </div>
    `;
}

function renderTimeline(data) {
    const timeline = document.querySelector('.timeline');
    const events = data.filter(event => event.Type !== 'Title');
    timeline.innerHTML = events.map(createTimelineEvent).join('');

    const titleEvent = data.find(event => event.Type === 'Title');
    if (titleEvent) {
        const titleContainer = document.getElementById('title-container');
        titleContainer.innerHTML = `<h2>${titleEvent.Title}</h2><p>${titleEvent.Description}</p>`;
    }
}

function createFilterButtons(categories) {
    const filtersContainer = document.querySelector('.filters');
    const allButton = `<button class="filter-btn" data-category="all">All</button>`;
    const categoryButtons = categories.map(category => 
        `<button class="filter-btn" data-category="${category}">${category}</button>`
    ).join('');
    filtersContainer.innerHTML = allButton + categoryButtons;
}

function filterEvents(category) {
    const events = document.querySelectorAll('.event');
    events.forEach(event => {
        if (category === 'all' || event.dataset.category === category) {
            event.style.display = 'block';
        } else {
            event.style.display = 'none';
        }
    });
}

async function initializeTimeline() {
    try {
        const data = await fetchData();
        renderTimeline(data);

        const categories = [...new Set(data.map(event => event.Category))];
        createFilterButtons(categories);

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterEvents(button.dataset.category);
            });
        });
    } catch (error) {
        console.error('Error fetching or rendering data:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeTimeline);