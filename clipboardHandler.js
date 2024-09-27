//@ts-check

/**
 * Handler for actions to write to or read from the local clipboard.
 * 
 * @param {HTMLButtonElement} copyBtn 
 *      Button to initiate copy command
 * @param {HTMLButtonElement} pasteBtn
 *      Button that initates the paste command
 * @param {HTMLTextAreaElement} ioElement
 *      Element to display the clipboard content or select text that should be
 *      transfered to the clipboard 
 */
function ClipboardHandler(copyBtn, pasteBtn, ioElement) {

    /**
     * Enables or disables the button to copy selected text from the
     * ioElement
     * 
     * @param {Boolean} enable
     *      True to enable the button, false to disable 
     */
    let enableCopyButton = enable => {
        if (copyBtn) copyBtn.disabled = enable;
    };

    /**
     * Enables or disables the button to paste clipboard value to 
     * ioElement
     * 
     * @param {Boolean} enable 
     *      True to enable the button, false to disable 
     */
    let enablePasteButton = enable => {
        if (pasteBtn) pasteBtn.disabled = enable;
    };
    
    /**
     * Appends the given text value to the ioElement
     * 
     * @param {String} value
     *      The text to append to the IOElement 
     */
    function appendToIo(value) {
        if (ioElement) {
            ioElement.value += `\n${value}`;
        }
    };
    
    // @ts-ignore - non standard / experimental 
    navigator.permissions.query({ name: 'clipboard-read' })
        .then(result => {
            appendToIo(`clipboard-read: ${result.state}`);
            if (result.state === 'granted') {
                enablePasteButton(true);
            }
            else if (result.state === 'prompt') {
                navigator.clipboard.readText()
                    .then(() => {
                        enablePasteButton(true);
                        appendToIo('clipboard-read: granted');

                    })
                    .catch(reason => {
                        enablePasteButton(false);
                        appendToIo(reason);
                    });
            }
               else {
                enablePasteButton(false);
            }

        })
        .catch(reason => {
            appendToIo(`unable to query permission for {name: clipboard-read}: \n${reason}`);
            enablePasteButton(false);
        });

    // @ts-ignore - non standard / experimental
    navigator.permissions.query({ name: 'clipboard-write' })
        .then(result => {
            appendToIo(`clipboard-write: ${result.state}`);
            if (result.state === 'granted') {
                enableCopyButton(true);
            }
            else if (result.state === 'prompt') {
                navigator.clipboard.writeText('')
                    .then(() => {
                        enableCopyButton(true);
                    })
                    .catch(reasons => {
                        enableCopyButton(false);
                        appendToIo(`prompting to allow write to clipboard failed: ${reasons}`);
                    });
            }
            else {
                enableCopyButton(false);
            }
            
        })
        .catch(reason => {
            appendToIo(`unable to query permission for {name: clipboard-write}: \n${reason}`);
            enableCopyButton(false);
        });

    let copySelectedText = () => {
        if (ioElement && ioElement.selectionStart) {
            let start = ioElement.selectionStart;
            let end = ioElement.selectionEnd;
            navigator.clipboard
                .writeText(ioElement.value.substring(start, end));
        }
    };

    let pasteClipboardContent = () => {
        if (ioElement) {
            navigator.clipboard.readText()
                .then(result => {
                    appendToIo(result);
                })
                .catch(reason => {
                    appendToIo(`failed to read from clipboard: ${reason}`);
                });
        }
    };
    
    copyBtn.addEventListener('click', copySelectedText);
    pasteBtn.addEventListener('click', pasteClipboardContent);

    /**
     * Handler for key-down events
     * 
     * @param {KeyboardEvent} event 
     *      Incoming keyboard event
     */
    this.keyDownHandler = (event) => {
        console.log('incoming keydown event');
        console.log(event);

        if (event.altKey && event.ctrlKey && event.shiftKey) {
            switch (event.key.toLocaleLowerCase()) {
                case 'c':
                    copySelectedText();
                    event.stopPropagation();
                    event.preventDefault();
                    break;
                case 'v':
                    pasteClipboardContent();
                    event.stopPropagation();
                    event.preventDefault();
                    break;
            }
        }
    };
}

export default ClipboardHandler;