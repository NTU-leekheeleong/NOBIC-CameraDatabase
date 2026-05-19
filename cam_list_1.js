(() => {
const viewToken = window.cameraDbViewToken;
// Container element with id "tableContainer" has been declared in NOBIC_CameraDatabase.html
// Assuming tableContainer is cleared before this script is loaded
const tableContainer = document.querySelector('#tableContainer');

// Create a new table and its elements
const table = document.createElement('table');
table.id = 'cameraTable';
table.style.width = 'auto';
table.style.borderCollapse = 'collapse';

const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');
table.appendChild(tableHead);
table.appendChild(tableBody);

// Create and append the header row
const headerRow = document.createElement('tr');
const headers = [
    "#", "Photo", "Camera Manufacturer", "Model No", "Pixel Count", 
    "Pixel Size", "Sensor Type", "Sensor Manufacturer", "Sensor Model", 
    "Mono/Color", "Pixel Format", "Exposure (min)", "Exposure (max)", "Shutter Type", "Lens Mount", 
    "Interface Type", "Manufacturer Spec URL"
];

headers.forEach(headerText => {
    const header = document.createElement('th');
    header.innerHTML = headerText.replace(/<br>/g, ' '); // Replace <br> with space for text
    header.style.border = '1px solid var(--table-border)';
    header.style.padding = '4px 8px';
    header.style.textAlign = 'center';
    header.style.backgroundColor = 'var(--table-header-bg)';
    headerRow.appendChild(header);
});

tableHead.appendChild(headerRow);

// Fetch the data and populate the table
let data; // Variable to store fetched data globally
fetch('NOBIC_CamDatabase_1.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to read NOBIC_CamDatabase_1.json');
        }
        return response.json();
    })
    .then(dataResponse => {
        if (!isCurrentCameraDbView(viewToken)) {
            return;
        }
        data = dataResponse;
        data.forEach((camera, index) => {
            const row = tableBody.insertRow();

            row.insertCell().textContent = index + 1;

            const imgCell = row.insertCell();
            const imgElement = document.createElement('img');
            imgElement.src = camera.image_cam_icon;
            imgElement.alt = `Image of ${camera.model}`;
            imgElement.style.maxWidth = '100px';
            imgElement.style.maxHeight = '50px';
            imgElement.style.width = 'auto';
            imgElement.style.height = 'auto';
            imgElement.style.objectFit = 'contain';
            imgElement.style.display = 'block';
            imgElement.style.margin = '0 auto';
            imgElement.addEventListener('click', () => zoomImage(camera.image_cam));
            imgCell.appendChild(imgElement);

            row.insertCell().textContent = camera.cam_manufacturer;

            const modelCell = row.insertCell();
            const modelLink = document.createElement('a');
            modelLink.href = '#';
            modelLink.textContent = camera.model;
            modelLink.style.textDecoration = 'underline';  // Make it look clickable
            modelLink.addEventListener('click', (event) => {
                event.preventDefault();  // Prevent default link behavior
                fetchCameraDetails(camera.model);
            });
            modelCell.appendChild(modelLink);

            row.insertCell().textContent = camera.pixelCount;
            row.insertCell().textContent = camera.pixelSize;
            row.insertCell().textContent = camera.sensorType;
            row.insertCell().textContent = camera.sensorManufacturer;
            row.insertCell().textContent = camera.sensorModel;
            row.insertCell().textContent = camera.color_mono;

            const pixelFormatCell = row.insertCell();
            pixelFormatCell.textContent = camera.pixelFormat;
            pixelFormatCell.style.width = '100px'; 

            row.insertCell().textContent = camera.expo_min;
            row.insertCell().textContent = camera.expo_max;
            row.insertCell().textContent = camera.shutterType;
            row.insertCell().textContent = camera.lensMount;
            row.insertCell().textContent = camera.interfaceType;
            
            const specCell = row.insertCell();
            const specLink = document.createElement('a');
            specLink.href = camera.cam_URL;
            specLink.textContent = 'Spec Sheet';
            specLink.target = '_blank';
            specLink.rel = 'noopener noreferrer';
            specCell.appendChild(specLink);

            Array.from(row.cells).forEach(cell => {
                cell.style.padding = '2px 8px';
                cell.style.verticalAlign = 'middle';
                cell.style.whiteSpace = 'pre-line';
            });
        });

        // Clear the existing table and append the created table to the tableContainer
        tableContainer.textContent = '';
        tableContainer.appendChild(table);
    })
    .catch(error => console.error('Error loading the camera data:', error));

})();
