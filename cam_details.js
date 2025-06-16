// Function to display camera details
function displayCameraDetails(cam_model) {
    fetch('IDMxS_CamDatabase.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to read IDMxS_CamDatabase.json');
            }
            return response.json();
        })
        .then(data => {
            const filteredCamera = data.filter(camera => camera.model === cam_model);
            if (filteredCamera.length > 0) {
                displayselectedCam(filteredCamera[0]);
            } else {
                console.error('Camera not found');
            }
        })
        .catch(error => {
            console.error('Error loading the camera details:', error);
        });
}

function displayselectedCam(selectedCamera) {
    const container = document.getElementById('tableContainer');
    if (!container) {
        console.error('Container element not found');
        return;
    }

    const parameterTable = createParameterTable(selectedCamera);
    const parameterGraph = createParameterGraph(selectedCamera);
    const testResultTable = createTestResultTable(selectedCamera);
    const citationText = createCitationText();

    container.innerHTML = '';
    container.appendChild(parameterTable);
    container.appendChild(document.createElement('hr'));
        container.appendChild(parameterGraph);
    container.appendChild(document.createElement('hr'));
    container.appendChild(citationText);
    container.appendChild(testResultTable);
}

function createParameterTable(selectedCamera) {
    const table = document.createElement('table');
    table.id = 'cameraTable';
    table.style.width = 'auto';
    table.style.borderCollapse = 'collapse';

    const headers = [
        "Photo", "Camera Manufacturer", "Model No", "Pixel Count",
        "Pixel Size", "Sensor Type", "Sensor Manufacturer", "Sensor Model",
        "Mono/Color", "Pixel Format", "Exposure (min)", "Exposure (max)", 
        "Shutter Type", "Lens Mount", "Interface Type", "Manufacturer Spec URL"
    ];

    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.innerHTML = headerText;
        styleHeaderCell(header);
        headerRow.appendChild(header);
    });

    const tableHead = document.createElement('thead');
    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');
    const dataRow = document.createElement('tr');

    // Create the image element for the camera photo
    const img1Element = document.createElement('img');
    img1Element.src = selectedCamera['image_cam'];
    img1Element.alt = selectedCamera['model'];
    img1Element.style.cursor = 'zoom-in'; 
    img1Element.onclick = () => zoomImage(selectedCamera['image_cam']); // Zoom function on click

    const specSheetLink = document.createElement('a');
    specSheetLink.href = selectedCamera['cam_URL'];
    specSheetLink.target = "_blank";
    specSheetLink.textContent = "Spec Sheet";

    const rowData = [
        img1Element,
        selectedCamera['cam_manufacturer'],
        selectedCamera['model'],
        selectedCamera['pixelCount'],
        selectedCamera['pixelSize'],
        selectedCamera['sensorType'],
        selectedCamera['sensorManufacturer'],
        selectedCamera['sensorModel'],
        selectedCamera['color_mono'],
        selectedCamera['pixelFormat'],
        selectedCamera['expo_min'],
        selectedCamera['expo_max'],
        selectedCamera['shutterType'],
        selectedCamera['lensMount'],
        selectedCamera['interfaceType'],
        specSheetLink 
    ];

    rowData.forEach(dataItem => {
        const dataCell = document.createElement('td');
        // Check if dataItem is an HTML element
        if (dataItem instanceof HTMLElement) {
            dataCell.appendChild(dataItem);
        } else {
            // Assume dataItem is a string and set it as textContent
            dataCell.textContent = dataItem;
        }
        styleDataCell(dataCell);
        dataRow.appendChild(dataCell);
    });

    tableBody.appendChild(dataRow);
    table.appendChild(tableBody);
    return table;
}

function createParameterGraph(selectedCamera) {
    const graphTable = document.createElement('table');
    graphTable.id = 'graphTable';
    graphTable.style.width = 'auto';
    graphTable.style.borderCollapse = 'collapse';

    const graphHeaders = [
        "Parameter", "Manufacturer Spec"
    ];

    const graphHeaderRow = document.createElement('tr');
    graphHeaders.forEach(headerText => {
        const graphHeader = document.createElement('th');
        graphHeader.innerHTML = headerText;
        styleHeaderCell(graphHeader);
        graphHeaderRow.appendChild(graphHeader);
    });

    const graphHead = document.createElement('thead');
    graphHead.appendChild(graphHeaderRow);
    graphTable.appendChild(graphHead);

    const graphBody = document.createElement('tbody');
    const graphRow = document.createElement('tr');

    // Create the image element for the camera parameters: QE 
    const img3Element = document.createElement('img');
    img3Element.src = selectedCamera['image_folder'] + '/QE_Spec.gif';
    img3Element.alt = 'QE of ' + selectedCamera['model'];
    img3Element.style.width = '300px';
    img3Element.style.cursor = 'zoom-in'; 
    img3Element.onclick = () => zoomImage(selectedCamera['image_folder'] + '/QE_Spec.gif'); // Zoom function on click

    const rowData = [
        'Quantum Efficiency Spec',
        img3Element
    ];

    rowData.forEach(dataItem => {
        const dataCell = document.createElement('td');
        if (dataItem instanceof HTMLElement) {
            dataCell.appendChild(dataItem);
        } else {
            dataCell.textContent = dataItem;
        }
        styleDataCell(dataCell);
        graphRow.appendChild(dataCell);
    });

    graphBody.appendChild(graphRow);
    graphTable.appendChild(graphBody);
    return graphTable;
}


function createTestResultTable(selectedCamera) {
    const table = document.createElement('table');
    table.id = 'testResultTable';
    table.style.width = '1500px';
    table.style.borderCollapse = 'collapse';

    const headers = ["Parameter", "Measured/Computed Pixel-wise Images", "Remarks"];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.innerHTML = headerText;
        styleHeaderCell(header);
        headerRow.appendChild(header);
    });

    const tableHead = document.createElement('thead');
    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');
    const secondTableData = [
        { parameter: "Mean vs Exposure", imageSrc: selectedCamera['image_folder'] + '/' + selectedCamera['image_meanExpo'], remarks: selectedCamera['remarksMeanExpo'] },
        { parameter: "Gain Estimation (counts/electron)", imageSrc: selectedCamera['image_folder'] + "/Gain.gif", remarks: selectedCamera['remarksGain'] },
        { parameter: "Dark Current Estimation (counts/s)", imageSrc: selectedCamera['image_folder'] + "/DC_per_sec.gif", remarks: selectedCamera['remarksDC'] },
        { parameter: "Thermal Noise Estimation(counts²/s)", imageSrc: selectedCamera['image_folder'] + "/TN_sq_per_sec.gif", remarks: selectedCamera['remarksTN'] },
        { parameter: "Read Noise Estimation (counts²)", imageSrc: selectedCamera['image_folder'] + "/RN_sq.gif", remarks: selectedCamera['remarksRN'] }
    ];

    secondTableData.forEach(data => {
        const dataRow = document.createElement('tr');
        const paramCell = document.createElement('td');
        paramCell.textContent = data.parameter;
        styleDataCell(paramCell);
        dataRow.appendChild(paramCell);

        const imgCell = createImageCell(data.imageSrc, data.parameter);
        dataRow.appendChild(imgCell);

        const remarksCell = document.createElement('td');
        remarksCell.textContent = data.remarks;
        styleRemarksCell(remarksCell);
        dataRow.appendChild(remarksCell);

        tableBody.appendChild(dataRow);
    });

    table.appendChild(tableBody);
    return table;
}

function createCitationText() {
    const citationText = document.createElement('p');
    citationText.innerHTML = `
        Camera Dark Current Characterisation:<br>
        - Characterisation based solely on thermally generated signals<br>
        - Use camera to take significantly large quantity of frames in dark condition, compute individual pixel Mean and Variance, estimate the parameters
    `;
    citationText.style.marginTop = '2px'; 
    return citationText;
}

function createImageCell(imageSrc, altText) {
    const imgCell = document.createElement('td');
    const img2Element = document.createElement('img');
    img2Element.src = imageSrc;
    img2Element.alt = altText;
    img2Element.style.height = '100%';
    img2Element.style.maxHeight = '220px';
    img2Element.style.cursor = 'zoom-in'; 
    img2Element.onclick = () => zoomImage(imageSrc); 

    imgCell.appendChild(img2Element);
    styleDataCell(imgCell);
    return imgCell;
}

function styleHeaderCell(cell) {
    cell.style.border = '1px solid #ddd';
    cell.style.padding = '8px';
    cell.style.textAlign = 'center';
    cell.style.backgroundColor = '#f2f2f2';
}

function styleDataCell(cell) {
    cell.style.border = '1px solid #ddd';
    cell.style.padding = '8px';
    cell.style.textAlign = 'center';
}

function styleRemarksCell(cell) {
    cell.style.border = '1px solid #ddd';
    cell.style.padding = '8px';
    cell.style.textAlign = 'left';
    cell.style.verticalAlign = 'top';
}
