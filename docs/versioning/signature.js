export function fixAllSignatures(realm = document.body){
    realm.querySelectorAll(".signature > code").forEach(fixSignatureCode);
}
function fixSignatureCode(container){
    if (container.children.length > 0) {return;}
    let text = container.innerHTML;
    text = text.replace(/\s+/g, " ");
    text = formatH4(text);
    container.innerHTML = text;
}
function formatH4(text){
    let parts = text.split("(");
    if (text.includes("(")) {
        if (parts[0].includes("=")) {
            return formatH4NonCallable(text);
        }
        if (text.includes(")")) {
            return formatH4Callable(text);
        }
    }
    return formatH4NonCallable(text);
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
    text += "<span class='signature-bracket'>(</span>";
    text += core;
    text += "<span class='signature-bracket'>)</span>";
    text += " ";
    text += "<span class='signature-parameter'>";
    text += closing;
    text += "</span>";
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
    let ans = "<span class='signature-parameter'>";
    ans += text.trim();
    ans += "</span>";
    return ans;
}
function formatH4OpeningName(text){
    let ans = text.trim();
    let parts = ans.split(".");
    parts = parts.map(part => part.trim());
    let lastpart = parts.pop();
    lastpart = "<span class='signature-name'>" + lastpart + "</span>";
    parts.push(lastpart);
    ans = parts.join(".");
    return ans;
}
function formatH4Core(text){
    let parts = text.split(",");
    parts = parts.map(formatH4SpecialCharsInPart);
    parts = parts.map(part => "<span class='signature-parameter'>" + part + "</span>");
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

