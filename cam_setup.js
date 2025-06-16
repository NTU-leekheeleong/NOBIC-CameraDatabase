// "Dark Current Setup section"
const lineBreak = document.createElement('hr');
tableContainer.appendChild(lineBreak);

const setupText = document.createElement('p');
setupText.textContent = "Dark Current Characterization";
setupText.style.fontWeight = 'bold';
setupText.style.fontSize = '30px';
setupText.style.marginTop = '10px';
setupText.style.marginBottom = '1px';
tableContainer.appendChild(setupText);

const citationText = document.createElement('p');
citationText.innerHTML = `
    - Nature Communications, Journal<br>
    &nbsp;&nbsp;Photon-free (s)CMOS camera characterization for artifact reduction in high- and super-resolution microscopy 
    <a href="https://www.nature.com/articles/s41467-022-30907-2" target="_blank">(URL)</a><br>
    - Characterization based solely on thermally generated signals.<br>
    - This approach characterises the noise behaviour of imaging sensors, especially in low-light conditions or long exposures where readout and dark current noise are significant
`;
citationText.style.marginTop = '2px'; 
tableContainer.appendChild(citationText);

// Add image "./image/Dark_Current_Setup.png"
const setupImage = document.createElement('img');
setupImage.src = "./image/Dark_Current_Setup.png";
setupImage.alt = "Dark Current Setup";
setupImage.style.width = '65%'; 
setupImage.style.height = 'auto';
tableContainer.appendChild(setupImage);

const citationText2 = document.createElement('p');
citationText2.innerHTML = `
Assumptions made in the Journal “Photon-free (s)CMOS camera characterization for artifact reduction in high- and super-resolution microscopy”<br>
• Statistical Approximation:<br>
&nbsp;&nbsp;- thermally excited electrons follow Poisson statistics just as photoelectrons<br>
&nbsp;&nbsp;- The study approximates the normally distributed readout noise with a Poisson distribution.<br>
&nbsp;&nbsp;- It assumes that the sum of dark current and readout noise can be approximated as a Poisson distribution, considering the thermal noise and exposure time<br>
&nbsp;&nbsp;- The Gain estimation on the single pixel level is not very precise as the test approach operates in the very low signal regime of a few electrons only.<br>
&nbsp;&nbsp;&nbsp;&nbsp;Median of all single pixel gain values is therefore used as one global Gain value.<br>
• Thermal Equilibrium:<br>
&nbsp;&nbsp;Before measurement, it's assumed that the camera detector reaches thermal equilibrium, either at the targeted cooling temperature<br>
&nbsp;&nbsp;or the operating temperature for uncooled cameras. This is crucial for accurate characterization (for uncooled camera, a few degree C of temperature <br>
&nbsp;&nbsp;fluctuation (<5°C) is observed when running the test)<br>
• Methodology for Data Analysis:<br>
&nbsp;&nbsp;The process assumes that analysing the mean value and standard deviation for each pixel at different exposure times can accurately determine the<br>
&nbsp;&nbsp;camera characteristics. Linear regression is used to fit these values against exposure time, which implies an assumption about the linearity of these relationships
`;
citationText.style.marginTop = '2px'; 
tableContainer.appendChild(citationText2);

const pixelMeanVarImage = document.createElement('img');
pixelMeanVarImage.src = "./image/Pixel_Mean-vs-Variance_Article.png";
pixelMeanVarImage.alt = "Pixel-wise Mean vs Variance";
pixelMeanVarImage.style.width = '45%'; 
pixelMeanVarImage.style.height = 'auto';
tableContainer.appendChild(pixelMeanVarImage);
