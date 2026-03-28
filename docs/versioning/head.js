export function setupHead() {
    setupLanguage();
    setupIcon();
    setupStyle();
    setupCharset();
    setupScale();
    setupTitle();
}

function setupLanguage() {
    if (document.documentElement.lang) {return;}
    document.documentElement.lang = 'en';
}

function setupIcon() {
    if (document.head.querySelector('link[rel="icon"]')) { return; }
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = 'https://www.johannes-programming.online/icon.svg';
    document.head.appendChild(link);
}

function setupStyle() {
    if (document.styleSheets.length > 0) { return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.johannes-programming.online/versioning/styles.css';
    document.head.appendChild(link);
}

function setupCharset() {
    if (document.head.querySelector('meta[charset]')) { return; }
    const meta = document.createElement('meta');
    meta.charset = 'UTF-8';
    document.head.appendChild(meta);
}

function setupScale() {
    if (document.head.querySelector('meta[name="viewport"]')) { return; }
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);
}

function setupTitle() {
    if (document.title) { return; }
    const firstHeaderLink = document.querySelector('header a');
    document.title = firstHeaderLink.textContent;
}
