// Function to handle camera link click and display camera details
function fetchCameraDetails(cam_model) {
    // Clear the existing table
    tableContainer.innerHTML = '';

    // Dynamically load cam_details.js
    const script = document.createElement('script');
    script.src = 'cam_details.js';
    script.onload = () => {
        // Call the displayCameraDetails function from cam_details.js with cam_model
        displayCameraDetails(cam_model);
    };
    document.head.appendChild(script);
}

function loadScript(scriptName, callback) {
    fetch(scriptName)
        .then(response => response.text())
        .then(scriptText => {
            eval(scriptText); // Execute the script text
            if (callback) {
                callback();
            }
        })
        .catch(error => console.error(`Error loading ${scriptName}:`, error));
}

function zoomImage(src) {
    document.getElementById('modalContent').src = src;
    document.getElementById('imageModal').style.display = "block";
}

function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}
