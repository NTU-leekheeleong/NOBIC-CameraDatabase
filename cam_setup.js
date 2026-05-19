(() => {
const viewToken = window.cameraDbViewToken;
const tableContainer = document.querySelector('#tableContainer');

if (!isCurrentCameraDbView(viewToken)) {
    return;
}

function appendLine(parent, text, indent = 0) {
    const line = document.createElement('span');
    line.textContent = text;
    if (indent) {
        line.style.marginLeft = `${indent}px`;
        line.style.display = 'inline-block';
    }
    parent.appendChild(line);
    parent.appendChild(document.createElement('br'));
}

tableContainer.appendChild(document.createElement('hr'));

const setupText = document.createElement('p');
setupText.textContent = 'Dark Current Characterization';
setupText.style.fontWeight = 'bold';
setupText.style.fontSize = '30px';
setupText.style.marginTop = '10px';
setupText.style.marginBottom = '1px';
tableContainer.appendChild(setupText);

const citationText = document.createElement('p');
appendLine(citationText, '- Nature Communications, Journal');
const articleLine = document.createElement('span');
articleLine.style.marginLeft = '24px';
articleLine.style.display = 'inline-block';
articleLine.textContent = 'Photon-free (s)CMOS camera characterization for artifact reduction in high- and super-resolution microscopy ';
const articleLink = document.createElement('a');
articleLink.href = 'https://www.nature.com/articles/s41467-022-30907-2';
articleLink.target = '_blank';
articleLink.rel = 'noopener noreferrer';
articleLink.textContent = '(URL)';
articleLine.appendChild(articleLink);
citationText.appendChild(articleLine);
citationText.appendChild(document.createElement('br'));
appendLine(citationText, '- Characterization based solely on thermally generated signals.');
appendLine(citationText, '- This approach characterises the noise behaviour of imaging sensors, especially in low-light conditions or long exposures where readout and dark current noise are significant');
citationText.style.marginTop = '2px';
tableContainer.appendChild(citationText);

const setupImage = document.createElement('img');
setupImage.src = './image/Dark_Current_Setup.png';
setupImage.alt = 'Dark Current Setup';
setupImage.style.width = '65%';
setupImage.style.height = 'auto';
tableContainer.appendChild(setupImage);

const assumptionsText = document.createElement('p');
appendLine(assumptionsText, 'Assumptions made in the Journal "Photon-free (s)CMOS camera characterization for artifact reduction in high- and super-resolution microscopy"');
appendLine(assumptionsText, '* Statistical Approximation:');
appendLine(assumptionsText, '- thermally excited electrons follow Poisson statistics just as photoelectrons', 24);
appendLine(assumptionsText, '- The study approximates the normally distributed readout noise with a Poisson distribution.', 24);
appendLine(assumptionsText, '- It assumes that the sum of dark current and readout noise can be approximated as a Poisson distribution, considering the thermal noise and exposure time', 24);
appendLine(assumptionsText, '- The Gain estimation on the single pixel level is not very precise as the test approach operates in the very low signal regime of a few electrons only.', 24);
appendLine(assumptionsText, 'Median of all single pixel gain values is therefore used as one global Gain value.', 48);
appendLine(assumptionsText, '* Thermal Equilibrium:');
appendLine(assumptionsText, "Before measurement, it's assumed that the camera detector reaches thermal equilibrium, either at the targeted cooling temperature", 24);
appendLine(assumptionsText, 'or the operating temperature for uncooled cameras. This is crucial for accurate characterization (for uncooled camera, a few degree C of temperature', 24);
appendLine(assumptionsText, 'fluctuation (< 5 C) is observed when running the test)', 24);
appendLine(assumptionsText, '* Methodology for Data Analysis:');
appendLine(assumptionsText, 'The process assumes that analysing the mean value and standard deviation for each pixel at different exposure times can accurately determine the', 24);
appendLine(assumptionsText, 'camera characteristics. Linear regression is used to fit these values against exposure time, which implies an assumption about the linearity of these relationships', 24);
assumptionsText.style.marginTop = '2px';
tableContainer.appendChild(assumptionsText);

const pixelMeanVarImage = document.createElement('img');
pixelMeanVarImage.src = './image/Pixel_Mean-vs-Variance_Article.png';
pixelMeanVarImage.alt = 'Pixel-wise Mean vs Variance';
pixelMeanVarImage.style.width = '45%';
pixelMeanVarImage.style.height = 'auto';
tableContainer.appendChild(pixelMeanVarImage);
})();
