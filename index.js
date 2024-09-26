import './index.scss';

document.addEventListener('DOMContentLoaded', ()=> {

    const clipboardContentElem = 
        document.getElementById('clipboardContent');
    const copyBtn = document.getElementById('copyBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    
    let enableCopyButton = enable => {
        if (copyBtn) copyBtn.disabled = enable;
    };
    let enablePasteButton = enable => {
        if (pasteBtn) pasteBtn.disabled = enable;
    };
    
    function writeToLog(text) {
        if (clipboardContentElem) {
            clipboardContentElem.value += `\n${text}`;
        }
    };
    
    navigator.permissions.query({ name: 'clipboard-read' })
        .then(result => {
            writeToLog(`clipboard-read: ${result.state}`);
            if (result.state === 'granted') {
                enablePasteButton(true);
            }
            else if (result.state === 'prompt') {
                navigator.clipboard.readText()
                    .then(() => {
                        enablePasteButton(true);
                        writeToLog('clipboard-read: granted');

                    })
                    .catch(reasons => {
                        enablePasteButton(false);
                        writeToLog(`prompting to allow read failed: ${reasons}`);
                    });
            }
            else {
                enablePasteButton(false);
            }

        })
        .catch(reason => {
            writeToLog(`unable to query permission for {name: clipboard-read}: \n${reason}`);
            enablePasteButton(false);
        });

    navigator.permissions.query({ name: 'clipboard-write' })
        .then(result => {
            writeToLog(`clipboard-write: ${result.state}`);
            if (result.state === 'granted') {
                enableCopyButton(true);
            }
            else if (result.state === 'prompt') {
                navigator.clipboard.writeText()
                    .then(() => {
                        enableCopyButton(true);
                    })
                    .catch(reasons => {
                        enableCopyButton(false);
                        writeToLog(`prompting to allow write to clipboard failed: ${reasons}`);
                    });
            }
            else {
                enableCopyButton(false);
            }
            
        })
        .catch(reason => {
            writeToLog(`unable to query permission for {name: clipboard-write}: \n${reason}`);
            enableCopyButton(false);
        });

    document.getElementById('copyBtn').addEventListener('click', () => {
        if (clipboardContentElem && clipboardContentElem.selectionStart) {
            let start = clipboardContentElem.selectionStart;
            let end = clipboardContentElem.selectionEnd;
            navigator.clipboard
                .writeText(clipboardContentElem.value.substring(start, end));
        }
    });

    document.getElementById('pasteBtn').addEventListener('click', () => {
        if (clipboardContentElem) {
            navigator.clipboard.readText()
                .then(result => {
                    writeToLog(result);
                })
                .catch(reason => {
                    writeToLog(`failed to read from clipboard: ${reason}`);
                });
        }
    });
});