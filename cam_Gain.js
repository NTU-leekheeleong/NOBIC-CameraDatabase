(() => {
const viewToken = window.cameraDbViewToken;
const tableContainer = document.querySelector('#tableContainer');

function addHeader(row, html) {
    const header = document.createElement('th');
    header.innerHTML = html;
    header.style.border = '1px solid var(--table-border)';
    header.style.padding = '10px';
    header.style.textAlign = 'center';
    header.style.backgroundColor = 'var(--table-header-bg)';
    row.appendChild(header);
}

function addTextCell(row, text, width) {
    const cell = row.insertCell();
    cell.textContent = text ?? '';
    if (width) {
        cell.style.width = width;
    }
    return cell;
}

const table = document.createElement('table');
table.id = 'cameraTable';
table.style.width = 'auto';
table.style.borderCollapse = 'collapse';
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');
table.appendChild(tableHead);
table.appendChild(tableBody);

const headerRow = document.createElement('tr');
[
    '#', 'Camera Manufacturer', 'Model No', 'Pixel Format Used for Test',
    'Gain Pixel Image<br>(counts/electron)<br>Gain.tiff'
].forEach(header => addHeader(headerRow, header));
tableHead.appendChild(headerRow);

fetch('NOBIC_CamDatabase_1.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to read NOBIC_CamDatabase_1.json');
        }
        return response.json();
    })
    .then(data => {
        if (!isCurrentCameraDbView(viewToken)) {
            return;
        }

        data.forEach((camera, index) => {
            const row = tableBody.insertRow();
            addTextCell(row, index + 1);
            addTextCell(row, camera.cam_manufacturer);

            const modelCell = addTextCell(row, camera.model);
            modelCell.style.cursor = 'pointer';
            modelCell.style.color = 'var(--link-color)';
            modelCell.style.textDecoration = 'underline';
            modelCell.addEventListener('click', () => fetchCameraDetails(camera.model));

            addTextCell(row, camera.pixelFormat_DC_Test).style.textAlign = 'center';

            const imgCell = row.insertCell();
            imgCell.style.textAlign = 'center';
            const img = document.createElement('img');
            img.src = `./${camera.image_folder}/Gain-raw.gif`;
            img.alt = `Gain Raw of ${camera.model}`;
            img.style.width = '240px';
            img.style.height = 'auto';
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => zoomImage(`${camera.image_folder}/Gain-raw.gif`));
            imgCell.appendChild(img);
        });

        tableContainer.appendChild(table);
    })
    .catch(error => console.error('Error loading the camera data:', error));
})();
