import {
  compile_function,
} from 'https://www.johannes-programming.online/rst-compiler/app.js';
import {
    fixContent,
} from "https://www.johannes-programming.online/versioning/fixing.js";



export function setupVersioning() {
    const select = document.getElementById("version");
    select.addEventListener("change", syncUrl);
    window.addEventListener("popstate", syncHtml);
    syncHtml();
}

function syncUrl(event) {
    const url = new URL(window.location.href);
    url.searchParams.set("version", event.target.value);
    window.history.replaceState(null, "", url);
    loadVersion();
}

function syncHtml() {
    const select = document.getElementById("version");
    const url = new URL(window.location.href);
    const version = url.searchParams.get("version");
    const option = [...select.options].find(o => o.value === version) ?? null;
    if (option === null) {
        url.searchParams.set("version", select.value);
        window.history.replaceState(null, "", url);
    } else {
        select.value = version;
    }
    loadVersion();
}
async function loadVersion() {
    const select = document.getElementById("version");
    const rstElement = document.getElementById('rst');
    rstElement.innerHTML = "";
    const filePath = `./v${select.value}.rst`;
    const response = await fetch(filePath);
    if (!response.ok) { return; }
    const rstContent = await response.text();
    const result = compile_function(rstContent);
    rstElement.innerHTML = result.body || '';
    fixContent(rstElement);
}