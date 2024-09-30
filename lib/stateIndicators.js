//@ts-check

/**
 * CSS classes used to display the states.
 */
const CssClasses = Object.freeze({
    state: 'cb_state',
    active: 'cb_state-active',
    inactive: 'cb_state-inactive',
    unknown: 'cb_state-unknown'
});

/**
 * Indicator that uses a HTMLDivElement to show different states by adding 
 * the approprite CSS classes.
 * 
 * @param {HTMLDivElement} element 
 *      Element used as indicator
 * @class
 */
function StateIndicator(element) {
    if (!element) {
        throw new Error('Element is required');
    }

    if (!element.classList.contains(CssClasses.state)) {
        element.classList.add(CssClasses.state);
    }

    let clearAllInciators = () => {
        for (let cssClass in CssClasses) {
            if (element.classList.contains(CssClasses[cssClass])) {
                element.classList.remove(CssClasses[cssClass]);
            }
            element.classList.add(CssClasses.state);
        }
    };

    /**
     * Set the state to active and removes all previosly set states.
     */
    this.setActive = () => {
        clearAllInciators();
        element.classList.add(CssClasses.active);
    };

    /**
     * Set the state to inactive and removes all previosly set states.
     */
    this.setInactive = () => {
        clearAllInciators();
        element.classList.add(CssClasses.inactive);
    };

    /**
     * Set the state to unknown and removes all previosly set states.
     */
    this.setToUnknown = () => {
        clearAllInciators();
        element.classList.add(CssClasses.unknown);
    };

    this.setToUnknown();
}

export default StateIndicator;