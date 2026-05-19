// Function to handle camera link click and display camera details
function fetchCameraDetails(cam_model) {
    const token = beginCameraDbView();
    displayCameraDetails(cam_model, token);
}

function loadScript(scriptName, callback) {
    const token = beginCameraDbView();
    document.querySelectorAll('script[data-dynamic-camera-db="true"]').forEach(script => script.remove());

    const script = document.createElement('script');
    script.src = `${scriptName}?view=${encodeURIComponent(token)}`;
    script.dataset.dynamicCameraDb = 'true';
    script.onload = () => {
        if (callback && isCurrentCameraDbView(token)) {
            callback(token);
        }
    };
    script.onerror = () => console.error(`Error loading ${scriptName}`);
    document.head.appendChild(script);
    return token;
}

function beginCameraDbView() {
    window.cameraDbViewToken = (window.cameraDbViewToken || 0) + 1;
    const container = document.getElementById('tableContainer');
    if (container) {
        container.textContent = '';
    }
    return window.cameraDbViewToken;
}

function isCurrentCameraDbView(token) {
    return token === window.cameraDbViewToken;
}

function zoomImage(src) {
    document.getElementById('modalContent').src = src;
    document.getElementById('imageModal').style.display = "block";
}

function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}
