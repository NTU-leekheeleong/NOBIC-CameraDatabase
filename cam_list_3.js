(() => {
const viewToken = window.cameraDbViewToken;
// Container element with id "tableContainer" has been declared in NOBIC_CameraDatabase.html
// Assuming tableContainer is cleared before this script is loaded
const tableContainer = document.querySelector('#tableContainer');

const table = document.createElement('table');
table.id = 'cameraTable';
table.style.width = 'auto';
table.style.borderCollapse = 'collapse';

const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');
table.appendChild(tableHead);
table.appendChild(tableBody);

const headerRow = document.createElement('tr');
const headers = [
    "#", "Photo", "Camera Manufacturer", "Model No", "Resolution",
    "Pixel Size", "Pixel Count", "Sensor Diagonal",
    "Sensor Active Area", "Mono/Color", "Sensor Model",
    "Frame Rate", "Interface", "Manufacturer Spec URL"
];

headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    header.style.border = '1px solid var(--table-border)';
    header.style.padding = '4px 8px';
    header.style.textAlign = 'center';
    header.style.backgroundColor = 'var(--table-header-bg)';
    headerRow.appendChild(header);
});

tableHead.appendChild(headerRow);

fetch('NOBIC_CamDatabase_3.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to read NOBIC_CamDatabase_3.json');
        }
        return response.json();
    })
    .then(data => {
        if (!isCurrentCameraDbView(viewToken)) {
            return;
        }
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

            row.insertCell().textContent = camera.model;

            row.insertCell().textContent = camera.resolutionMP;
            row.insertCell().textContent = camera.pixelSize_um;
            row.insertCell().textContent = camera.pixelCount;
            row.insertCell().textContent = camera.sensorDiagonal;
            row.insertCell().textContent = camera.sensorActiveArea;
            row.insertCell().textContent = camera.color_mono;
            row.insertCell().textContent = camera.sensorModel;
            row.insertCell().textContent = camera.frameRate_fps;
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

        tableContainer.textContent = '';
        tableContainer.appendChild(table);
    })
    .catch(error => console.error('Error loading the camera list #3 data:', error));

})();
