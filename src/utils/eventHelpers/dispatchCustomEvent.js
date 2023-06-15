/**
 * Convenient method to create and dispatch a {@link CustomEvent}.  
 * The event will be dispatched from given "this", or from "document" if "this" is undefined.  
 *     event.bubbles == true &&  event.composed == true  
 * @param eventName the name of the event (  === event.type)
 * @param detailObject object to attach to event.detail
 * @returns the created event object
 */
export function dispatchBubbelingCustomEvent(eventName, detailObject) {
    const customEvent = new CustomEvent(eventName, {bubbles: true, composed: true, detail: detailObject});
    if (this) {
        this.dispatchEvent(customEvent);
    } else {
        document.dispatchEvent(customEvent);
    }
    return customEvent;
}