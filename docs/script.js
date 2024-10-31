// articles
function setupUsefulArticle(packageName){
    const container = document.getElementById('usefulArticle');
    if(!container){return;}
    if(container.querySelector('header') !== null){return;}
    document.title = `The ${packageName} Project Documentation`;
    container.innerHTML = `
<header id="${packageName}">
    <h1>The <a>${packageName}</a> Project Documentation</h1>
</header>
${container.innerHTML}
<div id="useful"></div>`;
    setupUsefulCorpus(packageName);
    modifyLinks();
}
function setupTestingArticle(packageName) {
    const container = document.getElementById('testingArticle');
    if(!container){return;}
    document.title = `Testing of ${packageName}`
    container.innerHTML = `
        <header id="top">
            <h1>Testing of <a>${packageName}</a></h1>
        </header>
        <div id="testingCorpus"></div>`;
    setupTestingCorpus(packageName);
    modifyLinks();
}
function setupLicenseArticle(packageName) {
    const container = document.getElementById('licenseArticle');
    if(!container){return;}
    document.title = `License of ${packageName}`;
    container.innerHTML = `
        <header id="top">
            <h1>License of <a>${packageName}</a></h1>
        </header>
        <div id="licenseCorpus"></div>`;
    setupLicenseCorpus(packageName);
    modifyLinks();
}
function setupImpressumArticle(packageName) {
    const container = document.getElementById('impressumArticle');
    if(!container){return;}
    document.title = "Impressum";
    const htmlContent = `
        <header><h1>Impressum</h1></header>
        <b>Johannes Programming</b>
        <section id='impressumCorpus'></section>`;
    container.innerHTML = htmlContent;
    setupImpressumCorpus(packageName);
}









// blocks
function setupTopBlock() {
    const container = document.getElementById('top');
    if(!container){return;}
    container.innerHTML = `<h1>${document.title}</h1>`;
}
function setupInstallBlock() {
    const container = document.getElementById('install');
    if(!container){return;}
    container.innerHTML = `
        <h2>Installation</h2>
        <div id="installCorpus"></div>`;
    setupInstallCorpus(document.title);
}
function setupLicenseBlock() {
    const container = document.getElementById('license');
    if(!container){return;}
    container.innerHTML = `
        <h2>License</h2>
        <div id="licenseCorpus"></div>`;
    setupLicenseCorpus(document.title);
}
function setupTestingBlock() {
    const container = document.getElementById("testing");
    if (!container) {return;}
    container.innerHTML = `
    <h2>Testing</h2>
    <div id="testingCorpus"></div>`;
    setupTestingCorpus(document.title);
}
function setupLinksBlock() {
    const container = document.getElementById('links');
    if(!container){return;}
    container.innerHTML = `
        <h2>Links</h2>
        <ul>
            <li>
                Download:
                <a href="https://pypi.org/project/${document.title}/#files"></a>
            </li>
            <li>
                Index:
                <a href="https://pypi.org/project/${document.title}/"></a>
            </li>
            <li>
                Source:
                <a href="https://github.com/johannes-programming/${document.title}"></a>
            </li>
            <li>
                Website:
                <a href="https://${document.title}.johannes-programming.online"></a>
            </li>
        </ul>`;
    modifyLinks();
}
function setupCreditsBlock() {
    const container = document.getElementById('credits');
    if(!container){return;}
    container.innerHTML = `
        <h2>Credits</h2>
        <ul id='creditsCorpus'></ul>
        <p>Thank you for using <a>${document.title}</a>!</p>`;
    setupCreditsCorpus(document.title);
    modifyLinks();
}


// corpus
function setupTestingCorpus(packageName) {
    const container = document.getElementById('testingCorpus');
    if(!container){return;}
    container.innerHTML = `
    <p>This project can be tested 
    through its <code>test</code> function.</p>
    <pre><code>
import ${packageName}
${packageName}.test()

</code></pre>`;
}
function setupLicenseCorpus(packageName) {
    const container = document.getElementById('licenseCorpus');
    if(!container){return;}
    container.innerHTML = `<p>This project is licensed under the MIT License.</p>`;
}
function setupCreditsCorpus(packageName) {
    const container = document.getElementById('creditsCorpus');
    if(!container){return;}
    container.innerHTML = getImpressumBullets();
    modifyLinks();
}
function setupImpressumCorpus(packageName) {
    const container = document.getElementById('impressumCorpus');
    if(!container){return;}
    container.innerHTML = getImpressumParagraphs();
    modifyLinks();
}
function setupInstallCorpus(packageName) {
    const container = document.getElementById('installCorpus');
    if(!container){return;}
    container.innerHTML = `
        <p>
            To install <a>${packageName}</a>, 
            you can use <code>pip</code>. 
            Open your terminal and run:
        </p>
        <pre><code>
pip install ${packageName}
        </code></pre>`;
}
function setupUsefulCorpus(packageName){
    const container = document.getElementById('useful');
    if(!container){return;}
    container.innerHTML = `
<h2>Useful Links:</h2>
<div id="usefulCorpus">
    <ul>
        <li>
            Download: 
            <a href="https://pypi.org/project/${packageName}/#files"></a>
        </li>
        <li>
            Impressum: 
            <a href="https://${packageName}.johannes-programming.online/impressum.html"></a>
        </li>
        <li>
            Index: 
            <a href="https://pypi.org/project/${packageName}/"></a>
        </li>
        <li>
            Installation: 
            <a href="https://${packageName}.johannes-programming.online/install.html"></a>
        </li>
        <li>
            Source: 
            <a href="https://github.com/johannes-programming/${packageName}"></a>
        </li>
        <li>
            Website: 
            <a href="https://${packageName}.johannes-programming.online/"></a>
        </li>
    </ul>
</div>
<p>Thank you for using <a>${packageName}</a>!</p>`;
    modifyLinks();
}



// impressum and credits
function getImpressumList() {
    const strings = [
            "Name: Johannes",
            "Email: <a href='mailto:johannes-programming@mailfence.com'>johannes-programming@mailfence.com</a>",
            "Homepage: <a href='https://www.johannes-programming.online'></a>",
    ];
    return strings;
}
function getImpressumParagraphs() {
    const strings = getImpressumList();  
    let result = "";
    strings.forEach(str => {
        result += `<p>${str}</p>`;
    });
    return result;
}
function getImpressumBullets() {
    const strings = getImpressumList();  
    let result = "";
    strings.forEach(str => {
        result += `<li>${str}</li>`;
    });
    return result;
}











// projects
function setupProjectsList() {
    const dataList = [
        'datahold', 
        'datarepr', 
        'expit',
        'getoptify',
        'gravy', 
        'keyalias', 
        'makefunc',
        'makeprop',
        'overloadable', 
        'preparse',
        'tomlhold', 
        'scaevola', 
        'seqpad', 
        'v440',
    ];

    const baseURL = "https://";
    const domain = ".johannes-programming.online";

    // Reference to the list element
    const listContainer = document.getElementById('dynamicList');

    // Generate list dynamically
    dataList.forEach(item => {
        const li = document.createElement('li');

        // Create the <b> tag
        const boldText = document.createElement('b');
        boldText.textContent = `${item}: `;

        // Create the <a> tag
        const anchor = document.createElement('a');
        const url = `${baseURL}${item}${domain}`;
        anchor.href = url;
        anchor.textContent = url;

        // Append the elements to the list item
        li.appendChild(boldText);
        li.appendChild(anchor);

        // Append the list item to the container
        listContainer.appendChild(li);
    });

}

























// basics





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



function setupBasicProject() {
    addMetaAndLinkTags();

    setupTopBlock();
    setupLicenseBlock();
    setupTestingBlock();
    setupInstallBlock();
    setupLinksBlock();
    setupCreditsBlock();
}

function addMetaAndLinkTags() {
    
    const head = document.head;

    // Create and append charset meta tag
    const charsetMeta = document.createElement('meta');
    charsetMeta.setAttribute('charset', 'UTF-8');
    head.appendChild(charsetMeta);

    // Create and append viewport meta tag
    const viewportMeta = document.createElement('meta');
    viewportMeta.setAttribute('name', 'viewport');
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    head.appendChild(viewportMeta);

    // Create and append stylesheet link
    const stylesheetLink = document.createElement('link');
    stylesheetLink.setAttribute('rel', 'stylesheet');
    stylesheetLink.setAttribute('href', 'https://www.johannes-programming.online/styles.css');
    head.appendChild(stylesheetLink);
}

function main() {
    modifyLinks();
}
main();
