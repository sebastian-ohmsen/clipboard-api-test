//@ts-check

import Browser from './lib/browser';
import StateIndicator from './lib/stateIndicators';

/**
 * Removes parts of a text.
 *
 * @param {string} text
 *      The source text
 * @param {number} start
 *      Start position of the part that should be deleted
 * @param {number} end
 *      End position of the part that should be deleted
 * @returns
 *      The text without the deleted part or the original text if start or end
 *      values are invalid.
 */
const deleteTextPart = (text, start, end) => {
    if (
        start === end ||
        end < start ||
        start < 0 ||
        start >= text.length ||
        end < 0 ||
        end > text.length
    )
        return text;

    return text.substring(0, start) + text.substring(end, text.length);
};

/**
 * Handler for actions to write to or read from the local clipboard.
 *
 * @param {HTMLDivElement} copyIndicator
 *      DIV element that indicates whether the copy function is available
 * @param {HTMLDivElement} pasteIndicator
 *      DIV element that indicates whether the paste function is available
 * @param {HTMLTextAreaElement} ioElement
 *      Element to display the clipboard content or select text that should be
 *      transferred to the clipboard
 */
function ClipboardHandler(copyIndicator, pasteIndicator, ioElement) {
    let browser = new Browser();
    let copyState = new StateIndicator(copyIndicator);
    let pasteState = new StateIndicator(pasteIndicator);

    /**
     * Inserts the given text value into the value of the ioElement at
     * the current cursor position.
     *
     * @param {String} value
     *      The text to append to the IOElement
     */
    function insertIntoIOElement(value) {
        if (ioElement) {
            var oldValue = deleteTextPart(
                ioElement.value,
                ioElement.selectionStart,
                ioElement.selectionEnd
            );
            var newText = oldValue.substring(0, ioElement.selectionStart);
            newText += value;
            newText += oldValue.substring(
                ioElement.selectionStart,
                oldValue.length
            );
            ioElement.value = newText;

            ioElement.selectionStart = ioElement.selectionStart + value.length;
            ioElement.selectionEnd = ioElement.selectionStart + value.length;
        }
    }

    /* We only use the permission API if Blink engine is used */
    if (browser.isBlink) {
        // @ts-ignore - non standard / experimental
        navigator.permissions
            .query({ name: 'clipboard-read' })
            .then((result) => {
                if (result.state === 'granted') {
                    pasteState.setActive();
                } else if (result.state === 'prompt') {
                    navigator.clipboard
                        .readText()
                        .then(() => {
                            pasteState.setActive();
                        })
                        .catch((reason) => {
                            pasteState.setInactive();
                            console.error(reason);
                        });
                } else {
                    pasteState.setInactive();
                }
            })
            .catch((reason) => {
                console.error(reason);
                pasteState.setInactive();
            });

        // @ts-ignore - non standard / experimental
        navigator.permissions
            .query({ name: 'clipboard-write' })
            .then((result) => {
                if (result.state === 'granted') {
                    copyState.setActive();
                } else if (result.state === 'prompt') {
                    navigator.clipboard
                        .writeText('')
                        .then(() => {
                            copyState.setActive();
                        })
                        .catch((reason) => {
                            console.error(reason);
                            copyState.setInactive();
                        });
                } else {
                    copyState.setInactive();
                }
            })
            .catch((reason) => {
                console.error(reason);
                copyState.setInactive();
            });
    }

    /* Gecko engine does not support permissions to read from the clipboard */
    if (browser.isGecko) {
        pasteState.setInactive();
        console.log('Paste is disabled for Gecko browsers');
    }

    let copySelectedText = () => {
        if (ioElement) {
            let start = ioElement.selectionStart;
            let end = ioElement.selectionEnd;
            navigator.clipboard
                .writeText(ioElement.value.substring(start, end))
                .catch((err) => console.error(err));
        }
    };

    let pasteClipboardContent = () => {
        if (ioElement) {
            navigator.clipboard
                .readText()
                .then((result) => {
                    insertIntoIOElement(result);
                })
                .catch((reason) => {
                    console.error(reason);
                });
        }
    };

    /**
     * Handler for key-down events. Reacts to shortcuts for copy and paste.
     *
     * @param {KeyboardEvent} event
     *      Incoming keyboard event
     */
    this.keyDownHandler = (event) => {
        if (event.altKey && event.ctrlKey && event.shiftKey) {
            switch (event.key.toLocaleLowerCase()) {
                case 'c':
                    copySelectedText();
                    event.stopPropagation();
                    event.preventDefault();
                    break;
                case 'v':
                case 'insert':
                    if (!browser.isGecko) {
                        pasteClipboardContent();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    break;
            }
        }
    };
}

export default ClipboardHandler;
