import './index.scss';

document.addEventListener('DOMContentLoaded', ()=> {

    const clipboardContentElem = 
        document.getElementById('clipboardContent');

    document.getElementById('copyBtn').addEventListener('click', ()=> {
        clipboardContentElem.value += `\ncopyBtn pressed`;
    });

    document.getElementById('pasteBtn').addEventListener('click', ()=> {
        clipboardContentElem.value += `\npaseteBtn pressed`;
    });
});