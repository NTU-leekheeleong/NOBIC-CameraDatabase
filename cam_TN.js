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

function addNormalisedBar(row, value) {
    const cell = row.insertCell();
    cell.style.textAlign = 'center';

    if (value === '') {
        const tba = document.createElement('span');
        tba.textContent = 'TBA';
        tba.style.color = 'var(--muted-text-color)';
        tba.style.fontWeight = 'bold';
        cell.appendChild(tba);
        return cell;
    }

    const track = document.createElement('div');
    track.style.width = '180px';
    track.style.height = '20px';
    track.style.backgroundColor = 'var(--bar-track-bg)';
    track.style.border = '1px solid var(--table-border)';
    track.style.borderRadius = '3px';
    track.style.overflow = 'hidden';

    const fill = document.createElement('div');
    const percent = Math.max(0, Math.min(100, Number(value) / 255 * 100));
    fill.style.height = '100%';
    fill.style.width = `${percent}%`;
    fill.style.background = 'var(--bar-fill-bg)';
    fill.style.transition = 'width 0.5s';
    track.appendChild(fill);
    cell.appendChild(track);
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
    'Thermal Noise<br>(Normalised)', 'Thermal Noise Pixel Image<br>(count<sup>2</sup>/s)'
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
            addNormalisedBar(row, camera.TN_normalised);

            const imgCell = row.insertCell();
            imgCell.style.textAlign = 'center';
            const img = document.createElement('img');
            img.src = `./${camera.image_folder}/TN_sq_per_sec.gif`;
            img.alt = `Thermal Noise of ${camera.model}`;
            img.style.width = '200px';
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => zoomImage(`${camera.image_folder}/TN_sq_per_sec.gif`));
            imgCell.appendChild(img);
        });

        tableContainer.appendChild(table);
    })
    .catch(error => console.error('Error loading the camera data:', error));
})();
