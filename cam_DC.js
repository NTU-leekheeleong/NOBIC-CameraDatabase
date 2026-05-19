(() => {
const viewToken = window.cameraDbViewToken;
const tableContainer = document.querySelector('#tableContainer');

function addHeader(row, html) {
    const header = document.createElement('th');
    header.innerHTML = html;
    header.style.border = '1px solid var(--table-border)';
    header.style.padding = '2px';
    header.style.textAlign = 'center';
    header.style.backgroundColor = 'var(--table-header-bg)';
    row.appendChild(header);
}

function addTextCell(row, text, width, align = 'center') {
    const cell = row.insertCell();
    cell.textContent = text ?? '';
    if (width) {
        cell.style.width = width;
    }
    cell.style.textAlign = align;
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

function addImageCell(row, src, alt) {
    const cell = row.insertCell();
    cell.style.textAlign = 'center';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.width = '240px';
    img.style.height = 'auto';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => zoomImage(src.replace(/^\.\//, '')));
    cell.appendChild(img);
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
    '#', 'Camera Manufacturer', 'Model No', 'Sensor Manufacturer', 'Sensor Model',
    'Dark Current Spec (e<sup>-</sup>/s)', 'Pixel Format Dark Current Test',
    'Dark Current Measured<br>(Normalised)', 'Dark Current Pixel Image<br>(counts/s)',
    'Mean vs Exposure', 'Remarks'
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

            addTextCell(row, camera.sensorManufacturer);
            addTextCell(row, camera.sensorModel);
            addTextCell(row, camera.darkCurrent_spec);
            addTextCell(row, camera.pixelFormat_DC_Test, '100px');
            addNormalisedBar(row, camera.darkCurrent_normalised);
            addImageCell(row, `./${camera.image_folder}/DC_per_sec.gif`, `Dark Current per sec of ${camera.model}`);
            addImageCell(row, `./${camera.image_folder}/${camera.image_meanExpo}`, `Mean-vs-Exposure of ${camera.model}`);
            addTextCell(row, camera.remarksMeanExpo, '200px', 'left');
        });

        tableContainer.appendChild(table);

        const setupText = document.createElement('p');
        setupText.textContent = 'Dark Current Characterization';
        setupText.style.fontWeight = 'bold';
        setupText.style.fontSize = '30px';
        setupText.style.marginTop = '30px';
        setupText.style.marginBottom = '1px';
        tableContainer.appendChild(setupText);

        const citationText = document.createElement('p');
        citationText.append(
            '- Characterisation based solely on thermally generated signals',
            document.createElement('br'),
            '- Use camera to take significantly large quantity of frames in dark condition, compute individual pixel Mean and Variance, estimate the parameters'
        );
        citationText.style.marginTop = '2px';
        tableContainer.appendChild(citationText);
    })
    .catch(error => console.error('Error loading the camera data:', error));
})();
