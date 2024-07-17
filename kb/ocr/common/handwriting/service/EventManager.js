export class EventManager {
    static addEventHandler(eventName, element, eventExecutor) {
        const handlers = [];
        if (element !== undefined && element !== null) {
            const bindees = element instanceof NodeList ? Array.from(element)
                : Array.isArray(element) ? element : [element];
            bindees.forEach((bindee) => {
                const shouldAddEventExecutor = (e) => eventExecutor(e, bindee);
                bindee.addEventListener(eventName, shouldAddEventExecutor);
                handlers.push(shouldAddEventExecutor);
            });
        }
        return handlers;
    }
    static removeEventHandler(eventName, element, eventExecutor) {
        if (element !== undefined && element !== null) {
            const bindees = element instanceof NodeList ? Array.from(element)
                : Array.isArray(element) ? element : [element];
            bindees.forEach((bindee) => bindee.removeEventListener(eventName, eventExecutor));
        }
    }
}
