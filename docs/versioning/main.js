import {
  compile_function,
} from 'https://www.johannes-programming.online/rst-compiler/app.js';
import {
    setupVersionVisibility,
} from "https://www.johannes-programming.online/versioning/version.js";
import {
    fixContent,
} from "https://www.johannes-programming.online/versioning/fixing.js";




export function setupAllRstVersions() {
    const versionSelect = document.getElementById('version');
    const rstElement = document.getElementById('rst');
    if (!versionSelect) {return;}
    if (!rstElement) {return;}
    if (rstElement.querySelector('.version-wrapper')) { return; }
    for (const option of versionSelect.options) {
        const text = option.text.trim();
        const wrapper = document.createElement('div');
        wrapper.className = 'version-wrapper';
        wrapper.id = `v${text}`;
        wrapper.setAttribute('version', text);
        rstElement.appendChild(wrapper);
    }
}
export async function loadAllRstVersions() {
    const wrappers = document.querySelectorAll('.version-wrapper');
    await Promise.all([...wrappers].map(handleVersionWrapper));
}
async function handleVersionWrapper(wrapper) {
    const filePath = `./${wrapper.id}.rst`;
    const response = await fetch(filePath);
    if (!response.ok) { return; }
    const rstContent = await response.text();
    const result = compile_function(rstContent);
    wrapper.innerHTML = result.body || '';
    fixContent(wrapper);
}








export async function main() {
    setupAllRstVersions();
    fixContent();
    await loadAllRstVersions();
    setupVersionVisibility();
    console.log('main ended');
}

main()
  .then(() => console.log('main succeeded'))
  .catch((error) => {
    console.error('main failed:', error);
  });
