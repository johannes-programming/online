

function setupTopBlock(packageName) {
    const container = document.getElementById('top');
    const htmlContent = `<h1>${packageName}</h1>`;
    container.innerHTML = htmlContent;
}

function setupLicenseCorpus(packageName) {
    const container = document.getElementById('licenseCorpus');
    const htmlContent = `<p>This project is licensed under the MIT License.</p>`;
    container.innerHTML = htmlContent;
}
function setupLicenseBlock(packageName) {
    const container = document.getElementById('license');
    const htmlContent = `
        <h2>License</h2>
        <div id="licenseCorpus"></div>`;
    container.innerHTML = htmlContent;
    setupLicenseCorpus(packageName);
}
function setupLicenseArticle(packageName) {
    const container = document.getElementById('licenseArticle');
    const htmlContent = `
        <header id="top">
            <h1>License of <a>${packageName}</a></h1>
        </header>
        <div id="licenseCorpus"></div>`;
    container.innerHTML = htmlContent;
    setupLicenseCorpus(packageName);
}

function setupInstallCorpus(packageName) {
    const container = document.getElementById('installCorpus');
    const htmlContent = `
        <p>
            To install <a>${packageName}</a>, 
            you can use <code>pip</code>. 
            Open your terminal and run:
        </p>
        <pre><code class="language-bash">
pip install ${packageName}
        </code></pre>`;
    container.innerHTML = htmlContent;
}
function setupInstallBlock(packageName) {
    const container = document.getElementById('install');
    const htmlContent = `
        <h2>Installation</h2>
        <div id="installCorpus"></div>`;
    container.innerHTML = htmlContent;
    setupInstallCorpus(packageName);
}

function setupLinksBlock(packageName) {
    const container = document.getElementById('links');
    const htmlContent = `
        <h2>Links</h2>
        <ul>
            <li>
                Download:
                <a href="https://pypi.org/project/${packageName}/#files"></a>
            </li>
            <li>
                Index:
                <a href="https://pypi.org/project/${packageName}/"></a>
            </li>
            <li>
                Source:
                <a href="https://github.com/johannes-programming/${packageName}"></a>
            </li>
            <li>
                Website:
                <a href="https://${packageName}.johannes-programming.online"></a>
            </li>
        </ul>`;
    container.innerHTML = htmlContent;
    modifyLinks();
}

function setupCreditsBlock(packageName) {
    const container = document.getElementById('credits');
    const htmlContent = `
        <h2>Credits</h2>
        <ul>
            <li>
                Author: 
                <a href="https://www.johannes-programming.online">
                Johannes
                </a>
            </li>
            <li>
                Email: 
                <a href="mailto:johannes-programming@mailfence.com">
                    johannes-programming@mailfence.com
                </a>
            </li>
            <li>Homepage: <a href="https://www.johannes-programming.online"></a></li>
        </ul>
        <p>Thank you for using <a>${packageName}</a>!</p>`;
    container.innerHTML = htmlContent;
    modifyLinks();
}
function setupImpressumArticle() {
    const container = document.getElementById('impressumArticle');
    const htmlContent = `
        <header>
            <h1>Impressum</h1>
        </header>
        <b>Johannes Programming</b>
        <div class="content">
            <p>Name: Johannes</p>
            <p>Email: <a href="mailto:johannes-programming@mailfence.com">johannes-programming@mailfence.com</a>
            </p>
            <p>Homepage: <a href="https://www.johannes-programming.online">https://www.johannes-programming.online</a>
            </p>
        </div>`;
    container.innerHTML = htmlContent;
}


function setupBasicProject(packageName) {
    setupTopBlock(packageName);
    setupLicenseBlock(packageName);
    setupInstallBlock(packageName);
    setupLinksBlock(packageName);
    setupCreditsBlock(packageName);
}



function modifyEmptyLinks() {
    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Loop through each link
    links.forEach(link => {
        // Check if the link's text content is empty or contains only whitespace
        if (!link.textContent.trim()) {
            // Set the text content to the URL in the href attribute
            link.textContent = link.href;
        }
    });
}
function modifyLinksWithoutHref() {
    // Get all anchor elements on the page
    const links = document.querySelectorAll('a');

    // Loop through each link
    links.forEach(link => {
        // Check if the href attribute is missing or empty
        if (!link.getAttribute('href')) {
            // Strip the whitespace from the link's text
            const linkText = link.textContent.trim();
            if (true) {
                // Construct the new URL using the link's text
                const newUrl = `https://${linkText}.johannes-programming.online/`;

                // Set the href attribute with the new URL
                link.setAttribute('href', newUrl);

                // Wrap the text content in a <code> tag
                link.innerHTML = `<code>${linkText}</code>`;

            }
        }
    });
}

function modifyLinks() {
    modifyEmptyLinks();
    modifyLinksWithoutHref();
}

function main() {
    modifyLinks();
}
main();
