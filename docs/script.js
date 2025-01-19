// head
function addMetaAndLinkTags() {
    addLang();
    addMetaTag();
    addViewport();
    addStylesheet();
    modifyLinks();
}
function addLang(){
    document.documentElement.lang = 'en';
}
function addMetaTag() {
    const existing = document.querySelector('meta[charset="UTF-8"]');
    if(existing){return;}
    const metaTag = document.createElement("meta"); // Create a new meta element
    metaTag.setAttribute("charset", "UTF-8"); // Set its charset attribute
    document.head.appendChild(metaTag); // Append it to the head
}
function addViewport(){
    const existing = document.querySelector('meta[name="viewport"]');
    if(existing){return;}
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(meta);
}
function addStylesheet() {
    const existing = document.querySelector('link[rel="stylesheet"]');
    if(existing){return;}
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.johannes-programming.online/styles.css';
    document.head.appendChild(link);
}

// h4
function setupAllH4(){
    document.querySelectorAll('h4').forEach(setupOneH4);
}
function setupOneH4(container){
    if (container.children.length > 0) {return;} 
    return;
    container.innerHTML = formatH4(container.innerHTML);
    container.innerHTML = `<code>${container.innerHTML}</code>`;
}
function formatH4(text){
    text = text.trim();
    const openingI = text.indexOf("(");
    const closingI = text.lastIndexOf(")");
    if (openingI == -1){return `<b>${text}</b>`;}
    if (closingI == -1){return `<b>${text}</b>`;}
    const opening = formatH4Opening(text.substring(0, openingI));
    const core = formatH4Core(text.substring(openingI + 1, closingI));
    const closing = formatH4Closing(text.substring(closingI + 1));
    const ans = `${opening}<b>(</b>${core}<b>)</b>${closing}`;
    return ans;
}
function formatH4Opening(text){
    text = text.trim();
    const spaceI = text.indexOf(" ");
    if (spaceI == -1){return formatH4Name(text);}
    if (spaceI == -1){return formatH4Name(text);}
    const title = text.substring(0, spaceI);
    const name = text.substring(spaceI + 1);
    const fTitle = formatH4Title(title);
    const fName = formatH4Name(name);
    const ans = fTitle + " " + fName;
    return ans;
}
function formatH4Title(text){
    text = text.trim();
    return "<i>" + text + "</i>";
}
function formatH4Name(text){
    text = text.trim();
    const dotI = text.lastIndexOf(".");
    const partA = text.substring(0, dotI + 1);
    const partB = text.substring(dotI + 1);
    const ansB = "<b>" + partB + "</b>";
    return partA + ansB;
}
function formatH4Closing(text){
    return text;
}


// page
function setupUsefulPage(packageName){
    addMetaAndLinkTags();
    const content = document.body.innerHTML;
    document.body.innerHTML = `
<div id="usefulArticle">
    ${content}
</div>
<nav>
    <ul>
        <li>
        </li>
        <li>
            <a href="/install.html">
                <div class="rightaligned">Next &rarr;</div>
                <div class="rightaligned">Installation</div>
            </a>
        </li>
    </ul>
</nav>`;
    setupUsefulArticle(packageName);
}
function setupInstallPage(packageName){
    addMetaAndLinkTags();
    document.body.innerHTML = `
<div id="installArticle"></div>
<nav>
    <ul>
        <li>
            <a href="/">
                <div class="leftaligned">&larr; Previous</div>
                <div class="leftaligned">The <code>${packageName}</code> project homepage</div>
            </a>
        </li>
        <li>
            <a href="/intro.html">
                <div class="rightaligned">Next &rarr;</div>
                <div class="rightaligned">Introduction to <code>${packageName}</code></div>
            </a>
        </li>
    </ul>
</nav>`;
    setupInstallArticle(packageName);
}
function setupIntroPage(packageName){
    addMetaAndLinkTags();
    document.title = `Introduction to ${packageName}`;
    const content = document.body.innerHTML;
    document.body.innerHTML = `
<dl class="heading0">
    <dt id="header">Introduction to <a>${packageName}</a></dt>
    <dd>${content}</dd>
</dl>
<nav>
    <ul>
        <li>
            <a href="/install.html">
                <div class="leftaligned">&larr; Previous</div>
                <div class="leftaligned">Installing <code>tomlhold</code></div>
            </a>
        </li>
        <li>
            <a href="/features.html">
                <div class="rightaligned">Next &rarr;</div>
                <div class="rightaligned">Features of <code>tomlhold</code></div>
            </a>
        </li>
    </ul>
</nav>`;
    addMetaAndLinkTags();
}
function setupFeaturesPage(packageName){
    addMetaAndLinkTags();
    document.title = `Features of ${packageName}`;
    const content = document.body.innerHTML;
    document.body.innerHTML = `
<dl class="heading0">
    <dt id="header">Features of <a>${packageName}</a></dt>
    <dd>
${content}
    </dd>
</dl>
<nav>
    <ul>
        <li>
            <a href="/intro.html">
                <div class="leftaligned">&larr; Previous</div>
                <div class="leftaligned">Introduction to <code>${packageName}</code></div>
            </a>
        </li>
        <li>
            <a href="/testing.html">
                <div class="rightaligned">Next &rarr;</div>
                <div class="rightaligned">Testing of <code>${packageName}</code></div>
            </a>
        </li>
    </ul>
</nav>`;
    addMetaAndLinkTags();
    modifyLinks();
}
function setupTestingPage(packageName){
    addMetaAndLinkTags();
    document.body.innerHTML = `
<div id="testingArticle"></div>
<nav>
    <ul>
        <li>
            <a href="/features.html">
                <div class="leftaligned">&larr; Previous</div>
                <div class="leftaligned">Features of <code>${packageName}</code></div>
            </a>
        </li>
        <li>
            <a href="/license.html">
                <div class="rightaligned">Next &rarr;</div>
                <div class="rightaligned">License of <code>${packageName}</code></div>
            </a>
        </li>
    </ul>
</nav>`;
    setupTestingArticle(packageName);
}
function setupLicensePage(packageName){
    addMetaAndLinkTags();
    document.body.innerHTML = `
<div id="licenseArticle"></div>
<footer>
    <nav>
        <ul>
            <li>
                <a href="/testing.html">
                    <div class="leftaligned">&larr; Previous</div>
                    <div class="leftaligned">Testing of <code>${packageName}</code></div>
                </a>
            </li>
            <li>
                <a href="/impressum.html">
                    <div class="rightaligned">Next &rarr;</div>
                    <div class="rightaligned">Impressum</div>
                </a>
            </li>
        </ul>
    </nav>
</footer>`;
    setupLicenseArticle(packageName);
}
function setupImpressumPage(packageName){
    addMetaAndLinkTags();
    document.title = "Impressum";
    document.body.innerHTML = `
<div id="impressumArticle"></div>
<nav>
    <ul>
        <li>
            <a href="/license.html">
                <div class="leftaligned">&larr; Previous</div>
                <div class="leftaligned">License of <code>${packageName}</code></div>
            </a>
        </li>
        <li></li>
    </ul>
</nav>`;
    setupImpressumArticle(packageName);
}

// articles
function setupUsefulArticle(packageName){
    const container = document.getElementById('usefulArticle');
    if(!container){return;}
    if(container.querySelector('dl') !== null){return;}
    document.title = `The ${packageName} Project Documentation`;
    container.innerHTML = `
<dl class="heading0">
    <dt>The <a>${packageName}</a> Project Documentation</dt>
    <dd>
        ${container.innerHTML}
        <div id="useful"></div>
    </dd>
</dl>`;
    setupUsefulCorpus(packageName);
    addMetaAndLinkTags();
}
function setupInstallArticle(packageName) {
    const container = document.getElementById('installArticle');
    if(!container){return;}
    document.title = `Installing ${packageName}`
    container.innerHTML = `
        <dl class="heading0">
            <dt id="header">Installing <a>${packageName}</a></dt>
            <dd id="installCorpus"></dd>
        </dl>`;
    setupInstallCorpus(packageName);
    addMetaAndLinkTags();
}
function setupTestingArticle(packageName) {
    const container = document.getElementById('testingArticle');
    if(!container){return;}
    document.title = `Testing of ${packageName}`;
    addMetaAndLinkTags();
    container.innerHTML = `
        <dl id="top" class="heading0">
            <dt>Testing of <a>${packageName}</a></dt>
            <dd id="testingCorpus"></dd>
        </dl>`;
    setupTestingCorpus(packageName);
    addMetaAndLinkTags();
}
function setupLicenseArticle(packageName) {
    const container = document.getElementById('licenseArticle');
    if(!container){return;}
    addMetaAndLinkTags();
    document.title = `License of ${packageName}`;
    container.innerHTML = `
        <dl id="top" class="heading0">
            <dt>License of <a>${packageName}</a></dt>
            <dd id="licenseCorpus"></dd>
        </dl>`;
    setupLicenseCorpus(packageName);
    addMetaAndLinkTags();
}
function setupImpressumArticle(packageName) {
    const container = document.getElementById('impressumArticle');
    if(!container){return;}
    document.title = "Impressum";
    const htmlContent = `
        <dl class="heading0">
            <dt>Impressum</dt>
            <dd id="impressumCorpus"></dd>
        </dl>`;
    container.innerHTML = htmlContent;
    setupImpressumCorpus(packageName);
}




// basis
function setupImpressumBasis(packageName) {
    const container = document.getElementById('impressumBasis');
    if(!container){return;}
    container.innerHTML = getImpressumParagraphs();
    modifyLinks();
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
        <dl class="heading2">
            <dt>Installation</dt>
            <dd id="installCorpus"></dd>
        </dl>`;
    setupInstallCorpus(document.title);
    addMetaAndLinkTags();
}
function setupLicenseBlock() {
    const container = document.getElementById('license');
    if(!container){return;}
    container.innerHTML = `
        <dl class="heading2">
            <dt>License</dt>
            <dd id="licenseCorpus"></dd>
        </dl>`;
    setupLicenseCorpus(document.title);
}
function setupTestingBlock() {
    const container = document.getElementById("testing");
    if (!container) {return;}
    container.innerHTML = `
        <dl class="heading2">
            <dt>Testing</dt>
            <dd id="testingCorpus"></dd>
        </dl>`;
    setupTestingCorpus(document.title);
}
function setupLinksBlock() {
    const container = document.getElementById('links');
    if(!container){return;}
    container.innerHTML = `
        <dl class="heading2">
            <dt>Links</dt>
            <dd id="linksCorpus"></dd>
        </dl>`;
    setupLinksCorpus(document.title);
    addMetaAndLinkTags();
}
function setupCreditsBlock() {
    const container = document.getElementById('credits');
    if(!container){return;}
    container.innerHTML = `
        <dl class="heading2">
            <dt>Credits</dt>
            <dd>
                <ul id='creditsCorpus'></ul>
                <p>Thank you for using <a>${document.title}</a>!</p>
            </dd>
        </dl>`;
    setupCreditsCorpus(document.title);
    addMetaAndLinkTags();
}


// corpus
function setupLinksCorpus(packageName) {
    const container = document.getElementById('linksCorpus');
    if(!container){return;}
    const replaced = packageName.replace("_", "-");
    container.innerHTML = `
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
        <a href="https://github.com/johannes-programming/${packageName}/"></a>
    </li>
    <li>
        Website:
        <a href="https://${replaced}.johannes-programming.online/"></a>
    </li>
</ul>`;
    addMetaAndLinkTags();
}
function setupTestingCorpus(packageName) {
    const container = document.getElementById('testingCorpus');
    if(!container){return;}
    container.innerHTML = `
<p>This project can be tested 
through its <code>test</code> function.</p>
<pre class="block"><code>import ${packageName}
${packageName}.test()</code></pre>`;
}
function setupLicenseCorpus(packageName) {
    const container = document.getElementById('licenseCorpus');
    if(!container){return;}
    container.innerHTML = "<p>This project is licensed under the MIT License.</p>";
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
    container.innerHTML = `
<dl class="impressum">
    <dt>Johannes Programming</dt>
    <dd id='impressumBasis'></dd>
</dl>`;
    setupImpressumBasis(packageName);
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
        <pre class="block"><code>pip install ${packageName}</code></pre>`;
}
function setupUsefulCorpus(packageName){
    const container = document.getElementById('useful');
    if(!container){return;}
    const replaced = packageName.replace('_', '-');
    container.innerHTML = `
<dl class="heading2">
    <dt>Useful Links:</dt>
    <dd id="usefulCorpus">
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
                <a href="https://github.com/johannes-programming/${packageName}/"></a>
            </li>
            <li>
                Website: 
                <a href="https://${replaced}.johannes-programming.online/"></a>
            </li>
        </ul>
        <p>Thank you for using <a>${packageName}</a>!</p>
    </dd>
</dl>`;
    modifyLinks();
}



// impressum and credits
function getImpressumList() {
    const strings = [
            "Name: Johannes",
            "Email: <a href='mailto:johannes-programming@mailfence.com'>johannes-programming@mailfence.com</a>",
            "Homepage: <a href='https://www.johannes-programming.online/'></a>",
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
        'argshold',
        'assertfunction',
        'datahold', 
        'datarepr', 
        'dispatchly',
        'dummyfunction',
        'expit',
        'filelisting',
        'getoptify',
        'gravy', 
        'identityfunction',
        'keyalias', 
        'makefunc',
        'makeprop',
        'overloadable', 
        'preparse',
        'raisefunction',
        'tomlhold', 
        'scaevola', 
        'seqpad', 
        'setdoc', 
        'v440',
    ];

    const baseURL = "https://";
    const domain = ".johannes-programming.online/";

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
        if (link.getAttribute('href')) {return;}
        
        // Strip the whitespace from the link's text
        const linkText = link.textContent.trim();
    
        // Construct the new URL using the link's text
        const newUrl = `https://${linkText}.johannes-programming.online/`;

        // Set the href attribute with the new URL
        link.setAttribute('href', newUrl);

        // Wrap the text content in a <code> tag
        link.innerHTML = `<code>${linkText}</code>`;
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

function main() {
    addMetaAndLinkTags();
    modifyLinks();
}
main();
