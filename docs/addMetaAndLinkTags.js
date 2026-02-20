import { setupAllHeading4 } from "./h4.js";
import { setupVersionVisibility } from "./version.js";

export function addMetaAndLinkTags() {
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