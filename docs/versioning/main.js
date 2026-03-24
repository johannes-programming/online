import {
  compile_function,
} from 'https://www.johannes-programming.online/rst-compiler/app.js';

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
    if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
    }
    const rstContent = await response.text();
    const result = compile_function(rstContent);
    wrapper.innerHTML = result.body || '';
}





function wrapBarePreCodeBlocks() {
    const pres = document.querySelectorAll('pre.code');

    for (const pre of pres) {
        if (pre.querySelector('code')) {
            continue;
        }

        const code = document.createElement('code');
        code.innerHTML = pre.innerHTML;
        pre.innerHTML = '';
        pre.appendChild(code);
    }
}



export async function main() {
    setupAllRstVersions();
    await loadAllRstVersions();
    wrapBarePreCodeBlocks();
}

await main();
