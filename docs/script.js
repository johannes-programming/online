// h4
function setupAllHeading4(){
    document.querySelectorAll(".heading4 > dt").forEach(setupOneHeading4);
    document.querySelectorAll(".heading4 > dt > ul > li").forEach(setupOneHeading4);
}
function setupOneHeading4(container){
    if (container.children.length > 0) {return;}
    let text = container.innerHTML;
    text = text.replace(/\s+/g, " ");
    text = formatH4(text);
    text = "<code>" + text + "</code>";
    container.innerHTML = text;
}
function formatH4(text){
    if (text.includes("(") && text.includes(")")) {
        return formatH4Callable(text);
    } else {
        return formatH4NonCallable(text);
    }
}
function formatH4NonCallable(text){
    let ans = formatH4SpecialCharsInPart(text);
    if (ans.includes("=")) {
        return formatH4NonCallableEqual(ans);
    } else {
        return formatH4NonCallableColon(ans);
    }
}
function formatH4NonCallableEqual(text){
    let parts = text.split("=");
    let name = parts.shift();
    name = formatH4Opening(name);
    parts.unshift(name);
    return parts.join(" = ");
}
function formatH4NonCallableColon(text){
    let parts = text.split(":");
    let name = parts.shift();
    name = formatH4Opening(name);
    parts.unshift(name);
    return parts.join(": ");
}
function formatH4Callable(text){
    text = text.trim();
    let i = text.indexOf("(");
    let opening = text.substring(0, i);
    text = text.substring(i + 1);
    i = text.lastIndexOf(")");
    let core = text.substring(0, i);
    let closing = text.substring(i + 1);
    opening = formatH4Opening(opening);
    core = formatH4Core(core);
    closing = formatH4SpecialCharsInPart(closing);
    text = opening;
    text += "<em>(</em>" + core + "<em>)</em>";
    text += " <i>" + closing + "</i>";
    return text;
}
function formatH4Opening(text){
    if (text.endsWith("]")) {
        return formatH4OpeningGeneric(text);
    } else {
        return formatH4OpeningClassical(text);
    }
}
function formatH4OpeningGeneric(text){
    let i = text.indexOf("[");
    let x = text.substring(0, i);
    let y = text.substring(i);
    x = formatH4OpeningClassical(x);
    return x + y;
}
function formatH4OpeningClassical(text){
    let ans = text.trim();
    let parts = ans.split(" ");
    let lastpart = parts.pop();
    parts = parts.map(formatH4OpeningTitle);
    lastpart = formatH4OpeningName(lastpart);
    parts.push(lastpart);
    ans = parts.join(" ");
    return ans;
}
function formatH4OpeningTitle(text){
    let ans = text.trim();
    ans = "<i>" + ans + "</i>";
    return ans;
}
function formatH4OpeningName(text){
    let ans = text.trim();
    let parts = ans.split(".");
    parts = parts.map(part => part.trim());
    let lastpart = parts.pop();
    lastpart = "<b>" + lastpart + "</b>";
    parts.push(lastpart);
    ans = parts.join(".");
    return ans;
}
function formatH4Core(text){
    let parts = text.split(",");
    parts = parts.map(formatH4SpecialCharsInPart);
    parts = parts.map(part => "<i>" + part + "</i>");
    let ans = parts.join(", ");
    return ans
}
function formatH4SpecialCharsInPart(text){
    let ans = text.trim();
    // this works because every interval of whitespace 
    // has been already replaced with single spaces
    ans = ans.replace(" =", "=");
    ans = ans.replace("= ", "=");
    ans = ans.replace(" :", ":");
    ans = ans.replace(": ", ":");
    ans = ans.replace(" ->", "->");
    ans = ans.replace("-> ", "->");
    ans = ans.replace(" -&gt;", "-&gt;");
    ans = ans.replace("-&gt; ", "-&gt;");
    ans = ans.replace("=", " = ");
    ans = ans.replace(":", ": ");
    ans = ans.replace("-&gt;", "-&gt; ");
    ans = ans.trim();
    return ans;
}
function formatH4trim(text){
    return text.trim();
}


// page
function addBody(){
    if (!document.body) {
        const body = document.createElement('body');
        document.documentElement.appendChild(body);
    } 
}
function setup404(){
    document.title = "404";
    addBody();
    document.body.innerHTML = `
<dl class="heading0">
    <dt>404 - Page Not Found</dt>
    <dd>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <p><a href="/">Go Back.</a></p>
        <img src="https://www.johannes-programming.online/icon.svg" alt="johannes">
    </dd>
</dl>`;
    addMetaAndLinkTags();
}
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
    container.innerHTML = `
<div id="impressumParagraphs">
</div>`;
    setupImpressumParagraphs();
    addMetaAndLinkTags();
}
function setupImpressumParagraphs() {
    const container = document.getElementById('impressumParagraphs');
    if(!container){return;}
    container.innerHTML = getImpressumParagraphs();
    addMetaAndLinkTags();
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
    const subdomain = toSubdomain(packageName);
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
        <a href="https://${subdomain}.johannes-programming.online/"></a>
    </li>
</ul>`;
    addMetaAndLinkTags();
}
function setupTestingCorpus(packageName) {
    const seen = new Set(document.querySelectorAll('.testingCorpus'));
    const byId = document.getElementById('testingCorpus');
    if (byId) { seen.add(byId); }
    seen.forEach(x => setupTestingCorpus0(packageName, x));
}
function setupTestingCorpus0(packageName, container) {
    container.innerHTML = `
<p>
    This project can be tested 
    through its <code>test</code> function.
</p>
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
    addMetaAndLinkTags();
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
    addMetaAndLinkTags();
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
    const subdomain = toSubdomain(packageName);
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
                <a href="https://${subdomain}.johannes-programming.online/"></a>
            </li>
        </ul>
    </dd>
</dl>`;
    addMetaAndLinkTags();
}



// impressum and credits
function getImpressumList() {
    const strings = [
            "Name: Johannes",
            "Email: <a href='mailto:johannes.programming@gmail.com'>johannes.programming@gmail.com</a>",
            "Homepage: <a href='https://www.johannes-programming.online/'></a>",
            "Gravatar: <a href='https://www.johannes-programming.fyi/'></a>",
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
        'catchlib',
        'datahold', 
        'datarepr', 
        'dummyfunction',
        'expandpath',
        'expit',
        'filelisting',
        'gravy', 
        'identityfunction',
        'iterflat',
        'iterprod',
        'keyalias', 
        'makeprop',
        'na_quantors',
        'norming',
        'overloadable', 
        'preparse',
        'printtostderr',
        'raisefunction',
        'scaevola', 
        'seqpad',
        'setdoc', 
        'staticclasses',
        'texthold',
        'tofunc',
        'tomlhold', 
        'upcounting',
        'v440',
    ];

    const urlStart = "https://";
    const urlEnd = ".johannes-programming.online/";

    // Reference to the list element
    const listContainer = document.getElementById('dynamicList');

    // Generate list dynamically
    dataList.forEach(name => {
        const listItem = document.createElement('li');

        // Create the <b> tag
        const boldText = document.createElement('b');
        boldText.textContent = `${name}: `;

        // Create the <a> tag
        const subdomain = toSubdomain(name);
        const anchor = document.createElement('a');
        const url = `${urlStart}${subdomain}${urlEnd}`;
        anchor.href = url;
        anchor.textContent = url;

        // Append the elements to the list item
        listItem.appendChild(boldText);
        listItem.appendChild(anchor);

        // Append the list item to the container
        listContainer.appendChild(listItem);
    });

}

























// basics


function toSubdomain(pkg) {
    let ans = pkg.replace("_", "-");
    ans = ans.toLowerCase();
    return ans;
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

function addMetaAndLinkTags() {
    addBody();
    addLang();
    addMetaTag();
    addViewport();
    addStylesheet();
    addIcon();
    modifyEmptyLinks();
    modifyLinksWithoutHref();
    setupAllHeading4();
    setupVersionVisibility();
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
function addIcon() {
    const existing = document.querySelector('link[rel="icon"]');
    if(existing){return;}
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = "image/svg+xml";
    link.href = "https://www.johannes-programming.online/icon.svg";
    document.head.appendChild(link);
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



// Version Visibility

function getVersionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('version');
}

function setVersionInUrl(version) {
    const params = new URLSearchParams(window.location.search);
    params.set('version', version);
    const newUrl = window.location.pathname + '?' + params.toString();
    history.replaceState(null, '', newUrl);
}

function updateVersionVisibilityElement(el) {
    const select = document.getElementById('version');
    if (select === null){return;}
    const currentVersion = select.value;
    const versionsAttr = el.getAttribute('version') || '';
    const versions = versionsAttr.split(/\s+/).filter(Boolean);
    const shouldShow = versions.includes(currentVersion);

    if (shouldShow) {el.classList.remove('hidden');} 
    else {el.classList.add('hidden');}
}

function updateVersionVisibility() {
    const versionedElements = document.querySelectorAll('[version]');
    versionedElements.forEach(updateVersionVisibilityElement);
}

function updateVersionVisibilityLoad() {
    const select = document.getElementById('version');
    if (select === null) { return; }

    // Initialize from URL if possible
    const urlVersion = getVersionFromUrl();
    if (urlVersion) {
        const optionExists = Array.from(select.options)
            .some(opt => opt.value === urlVersion);
        if (optionExists) {
            select.value = urlVersion;
        }
    } else {
        setVersionInUrl(select.value);
    }

    // On change, update URL and visibility
    select.addEventListener('change', function () {
        setVersionInUrl(select.value);
        updateVersionVisibility();
    });

    updateVersionVisibility();
}

function setupVersionVisibility() {
    document.addEventListener('DOMContentLoaded', updateVersionVisibilityLoad);
    updateVersionVisibilityLoad();
}













// main

function main() {
    addMetaAndLinkTags();
}
main();
