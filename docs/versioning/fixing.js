export function fixContent(realm = document.body) {
    fixCodeOnlyHeadings(realm);
    fixAllDetails(realm);
    fixPreCode(realm);
}
function fixPreCode(realm) {
    const pres = realm.querySelectorAll('pre.code');
    for (const pre of pres) {
        if (pre.querySelector('code')) {
            continue;
        }
        const code = document.createElement('code');
        code.textContent = pre.textContent;
        pre.textContent = '';
        pre.appendChild(code);
    }
}
function fixCodeOnlyHeadings(realm = document.body) {
    const headings = realm.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
        fixCodeOnlyHeading(heading);
    }
}
function fixCodeOnlyHeading(heading) {
    if (heading.classList.contains('signature')) {
        return;
    }
    for (const node of heading.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim() !== '') {
                return;
            }
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() !== 'code') {
                return;
            }
        }
    }
    heading.classList.add('signature');
}




function fixAllDetails(realm) {
    console.log(realm.innerHTML);
    const descendants = [...realm.querySelectorAll("*")];
    for (const descendant of descendants) {
        for (let i = 1; i <= 6; i++) {
            fixElementDetails(descendant, i);
        }
    }
}
function fixElementDetails(element, number) {
    console.log(number, element.innerHTML);
    const className = `detail${number}`;
    const tagName = `h${number}`;
    const oldChildren = Array.from(element.childNodes);
    let wrapper = null;
    let kind = "naive";
    for (const oldChild of oldChildren) {
        if (oldChild.nodeType === Node.ELEMENT_NODE && oldChild.tagName.toLowerCase() === tagName) {
            wrapper = null;
            if (oldChild.classList.contains("signature")) {
                kind = "signature";
            } else {
                kind = "heading";
            }
            continue;
        }
        if (kind === "naive") {
            continue;
        }
        if (![Node.ELEMENT_NODE, Node.TEXT_NODE, Node.COMMENT_NODE].includes(oldChild.nodeType)) {
            wrapper = null;
            continue;   
        }
        if (oldChild.nodeType === Node.ELEMENT_NODE && oldChild.classList.contains(className)) {
            wrapper = null;
            continue;
        }
        if (wrapper === null) {
            wrapper = document.createElement("div");
            if (kind === "signature") {
                wrapper.classList.add("description");
            }
            wrapper.classList.add(className);
            element.insertBefore(wrapper, oldChild);
        }
        wrapper.appendChild(oldChild);
    }
}




