
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

export function setupVersionVisibility() {
    document.addEventListener('DOMContentLoaded', updateVersionVisibilityLoad);
    updateVersionVisibilityLoad();
}


