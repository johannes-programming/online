const dataList = [
    'datahold', 'datarepr', 'gravy', 'keyalias', 
    'overloadable', 'tomlhold', 'seqpad', 'v440'
];

const baseURL = "https://";
const domain = ".johannes-programming.online";

// Reference to the list element
const listContainer = document.getElementById('dynamicList');

// Generate list dynamically
dataList.forEach(item => {
    const li = document.createElement('li');

    // Create the <b> tag
    const boldText = document.createElement('b');
    boldText.textContent = `${item}: `;

    // Create the <a> tag
    const anchor = document.createElement('a');
    const url = `${baseURL}${item}${domain}`;
    anchor.href = url;
    anchor.textContent = url;

    // Append the elements to the list item
    li.appendChild(boldText);
    li.appendChild(anchor);

    // Append the list item to the container
    listContainer.appendChild(li);
});
