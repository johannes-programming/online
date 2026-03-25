export function fixAllSignatures(realm = document.body){
    realm.querySelectorAll(".signature > code").forEach(fixSignatureCode);
}
function fixSignatureCode(container){
    if (container.children.length > 0) {return;}
    const text = container.textContent;
    container.textContent = "";
    const children = spansSignatureCodeText(text);
    for (const child of children) {
        container.appendChild(child);
    }
}
function spansSignatureCodeText(text) {
    const reduced = text.replaceAll(/\s+/g, " ");
    const iOpen = reduced.indexOf("(");
    const iClose = reduced.indexOf(")");
    const iEqual = reduced.indexOf("=");
    if (-1 < iEqual && iEqual < iOpen) {
        return spansH4Variable(reduced);
    }
    if (-1 < iOpen && iOpen < iClose) {
        return spansH4Callable(reduced);
    }
    return spansH4NonCallableColon(reduced);
}
function spansH4Variable(text){
    const text_ = formatH4SpecialCharsInPart(text);
    const textparts = text_.split("=");
    const textname = textparts.shift();
    const ans = spansH4Opening(textname);
    for (const textpart of textparts) {
        const spanequal = span(" = ", "signature-separator");
        ans.push(spanequal);
        const spanpart = span(textpart, "signature-plain");
        ans.push(spanpart);
    }
    return ans;
}
function spansH4NonCallableColon(text){
    const text_ = formatH4SpecialCharsInPart(text);
    const textparts = text_.split(":");
    const firstpart = textparts.shift();
    const ans = spansH4Opening(firstpart);
    for (const textpart of textparts) {
        const spanequal = span(": ", "signature-separator");
        ans.push(spanequal);
        const spanpart = span(textpart, "signature-plain");
        ans.push(spanpart);
    }
    return ans;
}
function spansH4Callable(text){
    const trimmedtext = text.trim();

    const iOpen = trimmedtext.indexOf("(");
    const textopening = trimmedtext.substring(0, iOpen);
    const openedtext = trimmedtext.substring(iOpen + 1);

    const iClose = openedtext.lastIndexOf(")");
    const textcore = openedtext.substring(0, iClose);
    const textclosing = openedtext.substring(iClose + 1);

    const ans = spansH4Opening(textopening);
    ans.push(span("(", "signature-bracket"));
    const spanscore = spansH4Core(textcore);
    for (const spancore of spanscore) {
        ans.push(spancore);
    }
    ans.push(span(")", "signature-bracket"));
    const spansclosing = spansH4Closing(textclosing);
    for (const spanclosing of spansclosing) {
        ans.push(spanclosing);
    }
    return ans;
}
function spansH4Closing(text){
    const formattedClosing = formatH4SpecialCharsInPart(text);
    const ans = [];
    if (formattedClosing === "") {return ans;}
    if (formattedClosing.startsWith("->")) {
        ans.push(span(" -> ", "signature-separator"));
        ans.push(span(formattedClosing.substring(2), "signature-parameter"));
        return ans;
    }
    ans.push(span(formattedClosing, 'signature-parameter'));
    return ans;
}
function spansH4Opening(text){
    if (text.endsWith("]")) {
        return spansH4OpeningGeneric(text);
    } else {
        return spansH4OpeningClassical(text);
    }
}
function spansH4OpeningGeneric(text){
    const iOpen = text.indexOf("[");
    const textclassical = text.substring(0, iOpen);
    const textbracketed = text.substring(iOpen);
    let ans = spansH4OpeningClassical(textclassical);
    ans.push(span(textbracketed, "signature-plain"));
    return ans;
}
function spansH4OpeningClassical(text){
    const parts = text.trim().split(" ");
    const lastpart = parts.pop();
    const titlespans = [];
    for (const textpart of parts) {
        titlespans.push(span(textpart.trim(), "signature-title"));
        titlespans.push(span(" ", "signature-separator"));
    }
    const namespans = spansH4OpeningName(lastpart);
    return titlespans.concat(namespans);
}
function spansH4OpeningName(text){
    const trimmedtext = text.trim();
    let parts = trimmedtext.split(".");
    parts = parts.map(part => part.trim());
    const lastpart = parts.pop();
    let ans = [];
    for (const textpart of parts) {
        ans.push(span(textpart, "signature-plain"));
        ans.push(span(".", "signature-separator"));
    }
    ans.push(span(lastpart, "signature-name"));
    return ans;
}
function spansH4Core(text){
    let parts = text.split(",");
    parts = parts.map(formatH4SpecialCharsInPart);
    const lastpart = parts.pop();
    const ans = [];
    for (const textpart of parts) {
        ans.push(span(textpart, "signature-parameter"));
        ans.push(span(", ", "signature-separator"));
    }
    ans.push(span(lastpart, "signature-parameter"));
    return ans;
}
function formatH4SpecialCharsInPart(text){
    let ans = text.trim();
    // this works because every interval of whitespace 
    // has been already replaced with single spaces
    ans = ans.replaceAll(" =", "=");
    ans = ans.replaceAll("= ", "=");
    ans = ans.replaceAll(" :", ":");
    ans = ans.replaceAll(": ", ":");
    ans = ans.replaceAll(" ->", "->");
    ans = ans.replaceAll("-> ", "->");
    ans = ans.replaceAll(" -&gt;", "-&gt;");
    ans = ans.replaceAll("-&gt; ", "-&gt;");
    ans = ans.replaceAll("=", " = ");
    ans = ans.replaceAll(":", ": ");
    ans = ans.replaceAll("-&gt;", "-&gt; ");
    ans = ans.trim();
    return ans;
}







function span(text, kind) {
    const ans = document.createElement("span");
    ans.classList.add(kind);
    ans.textContent = text;
    return ans;
}