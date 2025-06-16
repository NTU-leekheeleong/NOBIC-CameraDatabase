// Assuming tableContainer is cleared before this script is loaded
const tableContainer = document.querySelector('#tableContainer');

const table = document.createElement('table');
table.id = 'cameraTable';
table.style.width = '1400px';
table.style.borderCollapse = 'collapse';

const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');

table.appendChild(tableHead);
table.appendChild(tableBody);

const headerRow = document.createElement('tr');
const headers = [
    "#", "Camera Manufacturer", "Model No", "Sensor Manufacturer", "Sensor Model",
    "Dark Current Spec (e<sup>-</sup>/s)", "Pixel Format Dark Current Test", "Dark Current Measured<br>(Normalised)",
    "Dark Current Pixel Image<br>(counts/s)", "Mean vs Exposure", "Remarks"
];

headers.forEach(headerText => {
    const header = document.createElement('th');
    header.innerHTML = headerText;
    header.style.border = '1px solid #ddd';
    header.style.padding = '2px';
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

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${camera.cam_manufacturer}</td>
                <td class="clickable-model">${camera.model}</td>
                <td>${camera.sensorManufacturer}</td>
                <td>${camera.sensorModel}</td>
                <td>${camera.darkCurrent_spec}</td>
                <td style="width: 100px; text-align: center;">${camera.pixelFormat_DC_Test}</td>
                <td style="width: 15%; text-align: center;">
                    ${
                        camera.darkCurrent_normalised !== ""
                            ? `<div style="width: 100%; height: 20px; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 3px; overflow: hidden;">
                                <div style="height: 100%; width: ${camera.darkCurrent_normalised / 255 * 100}%; 
                                    background: linear-gradient(to right, #6ecf83, #6ecf83); transition: width 0.5s;">
                                </div>
                            </div>`
                            : `<span style="color: gray; font-weight: bold;">TBA</span>`
                    }
                </td>
                <td style="width: 15%; text-align: center;">
                    <img src="./${camera.image_folder}/DC_per_sec.gif" alt="Dark Current per sec of ${camera.model}" style="width: 100%; height: 100%; cursor: zoom-in;">
                </td>
                <td style="width: 15%; text-align: center;">
                    <img src="./${camera.image_folder}/${camera.image_meanExpo}" alt="Mean-vs-Exposure of ${camera.model}" style="width: 100%; height: 100%; cursor: zoom-in;">
                </td>
                <td style="width: auto; text-align: left;">${camera.remarksMeanExpo}</td>
            `;

            // Add click event listener to the model cell
            const modelCell = row.querySelector('.clickable-model');
            modelCell.style.cursor = 'pointer';
            modelCell.style.color = 'blue';
            modelCell.style.textDecoration = 'underline';
            modelCell.addEventListener('click', () => {
                loadScript('cam_details.js', () => displayCameraDetails(camera.model));
            });

            // Add click event listener to the image
            const img1Element = row.cells[8].querySelector('img');
            img1Element.addEventListener('click', () => zoomImage(camera.image_folder + '/DC_per_sec.gif'));
            const img2Element = row.cells[9].querySelector('img');
            img2Element.addEventListener('click', () => zoomImage(camera.image_folder + '/' + camera.image_meanExpo));
        });

        tableContainer.appendChild(table);

        const setupText = document.createElement('p');
        setupText.textContent = "Dark Current Characterization";
        setupText.style.fontWeight = 'bold';
        setupText.style.fontSize = '30px';
        setupText.style.marginTop = '30px';
        setupText.style.marginBottom = '1px';
        tableContainer.appendChild(setupText);

        const citationText = document.createElement('p');
        citationText.innerHTML = `
            - Characterisation based solely on thermally generated signals<br>
            - Use camera to take significantly large quantity of frames in dark condition, compute individual pixel Mean and Variance, estimate the parameters
        `;
        citationText.style.marginTop = '2px'; 
        tableContainer.appendChild(citationText);
    })
    .catch(error => console.error('Error loading the camera data:', error));
