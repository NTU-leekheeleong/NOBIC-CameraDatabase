// Container element with id "tableContainer" has been declared in IDMxS_CameraDatabase.html
const tableContainer = document.querySelector('#tableContainer');

// Create a new table and its elements
const table = document.createElement('table');
table.id = 'cameraTable';
table.style.width = '1200px';
table.style.borderCollapse = 'collapse';
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');
table.appendChild(tableHead);
table.appendChild(tableBody);

// Create and append the header row
const headerRow = document.createElement('tr');
const headers = [
    "#", "Camera Manufacturer", "Model No", "Sensor Manufacturer", "Sensor Model",
    "Quantum Efficiency Spec Graph<br>(Extracted from camera manufacturer Spec)"
];
headers.forEach(headerText => {
    const header = document.createElement('th');
    header.innerHTML = headerText
    header.style.border = '1px solid #ddd';
    header.style.padding = '8px';
    header.style.textAlign = 'center';
    header.style.backgroundColor = '#f2f2f2';
    headerRow.appendChild(header);
});

tableHead.appendChild(headerRow);

// Fetch the data and populate the table
fetch('IDMxS_CamDatabase.json')
    .then(response => response.json())
    .then(data => {
        data.forEach((camera, index) => {
            const row = tableBody.insertRow();
            const cellContents = [
                index + 1,
                camera.cam_manufacturer,
                `<span class="clickable-model" style="cursor: pointer; color: blue; text-decoration: underline;">${camera.model}</span>`,
                camera.sensorManufacturer,
                camera.sensorModel,
                `<img src="./${camera.image_folder}/QE_Spec.gif" alt="QE of ${camera.model}" style="width: 300px; cursor: zoom-in;">`
            ];

            cellContents.forEach((content, cellIndex) => {
                const cell = row.insertCell(cellIndex);
                cell.innerHTML = content;
            });

            // Add click event listener to the model cell
            const modelCell = row.querySelector('.clickable-model');
            if (modelCell) {
                modelCell.addEventListener('click', () => {
                    loadScript('cam_details.js', () => displayCameraDetails(camera.model));
                });
            }

            // Add click event listener to the image
            const imgCell = row.querySelector('td:nth-child(6) img');
            if (imgCell) {
                imgCell.addEventListener('click', () => zoomImage(camera.image_folder + '/QE_Spec.gif'));
            }
        });

        tableContainer.appendChild(table); // Append the created table to the tableContainer
    })
    .catch(error => console.error('Error loading the camera data:', error));
