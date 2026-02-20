
// h4
export function setupAllHeading4(){
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

