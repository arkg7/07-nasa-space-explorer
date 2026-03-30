// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.getElementById('fetchButton');
const gallery = document.getElementById('gallery');
const API_KEY = 'homtlabxEaOuTITOxbHcLHrYheyERL4JYPbHpl7i';


// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

function fetchAPOD() {
  gallery.innerHTML = `<div class="placeholder">
        <div class="placeholder-icon">🔭</div>
        <p>Fetching Images....</p>
      </div>`;
  console.log('Fetching APOD for date range:', startInput.value, 'to', endInput.value);
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startInput.value}&end_date=${endInput.value}&thumbs=true`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Do something with the fetched data, e.g., display it in the gallery
    displayAPOD(data);
  })
  .catch((error) => {
    console.error('Error fetching APOD:', error);
  });
}

function displayAPOD(data) {
  gallery.innerHTML = ''; // Clear the gallery before displaying new images
  for (const apod of data) {
    gallery.appendChild(createAPODCard(apod));
  }
}

createAPODCard = (data) => {
  // Create a new element to display the APOD data
  const apodElement = document.createElement('div');
  apodElement.style.cursor = 'pointer';
  apodElement.style.width = '350px';
  apodElement.style.margin = '10px';
  apodElement.style.border = '1px solid #ccc';
  apodElement.style.padding = '10px';
  apodElement.style.borderRadius = '8px';
  apodElement.style.backgroundColor = '#e2e2e2';
  apodElement.style.justifyContent = 'center';
  apodElement.style.display = 'flex';
  apodElement.style.flexDirection = 'column';
  apodElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';


  apodElement.classList.add('apod');

  // Add the APOD image to the element
  if (data.media_type === 'image') {
    const img = document.createElement('img');
    img.src = data.hdurl;
    img.alt = data.title;
    img.style.maxWidth = '300px';
    img.style.height = '200px';
    img.style.alignSelf = 'center';
    apodElement.appendChild(img);
  } else if (data.media_type === 'video') {
    const video = document.createElement('video');
    video.src = data.url;
    video.style.maxWidth = '300px';
    video.style.height = '200px';
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.style.alignSelf = 'center';
    apodElement.appendChild(video);
  }
  // Add the title and description to the element
  const title = document.createElement('h3');
  title.textContent = data.title;
  title.style.padding = '10px 0 5px 0';
  title.style.color = '#200077';
  title.style.fontFamily = 'Inter, sans-serif';
  apodElement.appendChild(title);

  const date = document.createElement('p');
  date.textContent = `${new Date(data.date).toLocaleDateString(('en-US'), { year: 'numeric', month: 'long', day: 'numeric' })}`;
  date.style.fontFamily = 'DM Mono, monospace';
  date.style.color = '#555';
  apodElement.appendChild(date);


  // Add modal functionality to the element for description
  apodElement.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'hidden';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const descriptionBox = document.createElement('div');
    descriptionBox.style.backgroundColor = '#fff';
    descriptionBox.style.padding = '20px';
    descriptionBox.style.borderRadius = '8px';
    descriptionBox.style.border = '3px solid #200077';
    descriptionBox.style.boxShadow = '0 10px 12px rgba(0, 195, 255, 0.3)';
    descriptionBox.style.maxWidth = '600px';
    descriptionBox.style.textAlign = 'center';

    const descriptionTitle = document.createElement('h2');
    descriptionTitle.textContent = data.title;
    descriptionTitle.style.marginBottom = '10px';
    descriptionTitle.style.color = '#200077';
    descriptionBox.appendChild(descriptionTitle);

    if (data.media_type === 'image') {
      const img = document.createElement('img');
      img.src = data.hdurl;
      img.alt = data.title;
      img.style.maxWidth = '500px';
      img.style.maxHeight = '400px';
      img.style.alignSelf = 'center';
      descriptionBox.appendChild(img);
    } else if (data.media_type === 'video') {
    const video = document.createElement('video');
      video.src = data.url;
      video.style.maxWidth = '500px';
      video.style.maxHeight = '400px';
      video.loop = true;
      video.muted = true;
      video.autoplay = true;
      video.style.alignSelf = 'center';
      descriptionBox.appendChild(video);
    }

    const descriptionText = document.createElement('p');
    descriptionText.textContent = data.explanation;
    descriptionText.style.fontFamily = 'Inter, sans-serif';
    descriptionText.style.color = '#333';
    descriptionBox.appendChild(descriptionText);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.backgroundColor = '#200077';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    descriptionBox.appendChild(closeButton);

    modal.appendChild(descriptionBox);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.fadeIn = modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: 'forwards' });
  });
  return apodElement;
};


// Add an event listener to the fetch button to call the fetchAPOD function when clicked  

fetchButton.addEventListener('click', fetchAPOD);