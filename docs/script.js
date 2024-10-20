

function setupTopBlock(packageName) {
    const container = document.getElementById('top');
    const htmlContent = `<h1>${packageName}</h1>`;
    container.innerHTML = htmlContent;
}

function setupLicenseCorpus() {
    const container = document.getElementById('licenseCorpus');
    const htmlContent = `<p>This project is licensed under the MIT License.</p>`;
    container.innerHTML = htmlContent;
}
function setupLicenseBlock() {
    const container = document.getElementById('license');
    const htmlContent = `
        <h2>License</h2>
        <div id="licenseCorpus"></div>`;
    container.innerHTML = htmlContent;
    setupLicenseCorpus();
}

function setupInstallCorpus(packageName) {
    const container = document.getElementById('installCorpus');
    const htmlContent = `
        <p>To install <code>${packageName}</code>, you can use <code>pip</code>. Open your terminal and run:</p>
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
            <li><a href="https://pypi.org/project/${packageName}/#files">Download</a></li>
            <li><a href="https://pypi.org/project/${packageName}/">Index</a></li>
            <li><a href="https://github.com/johannes-programming/${packageName}">Source</a></li>
            <li><a href="https://${packageName}.johannes-programming.online">Website</a></li>
        </ul>`;
    container.innerHTML = htmlContent;
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
        </ul>
        <p>Thank you for using <code>${packageName}</code>!</p>`;
    container.innerHTML = htmlContent;
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
    setupLicenseBlock();
    setupInstallBlock(packageName);
    setupLinksBlock(packageName);
    setupCreditsBlock(packageName);
}
