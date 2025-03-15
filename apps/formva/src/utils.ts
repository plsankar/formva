export function debounce(func: Function, delay: number): Function {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (...args: any[]) {
        // Clear the existing timeout to reset the debounce
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set a new timeout to execute the function after the delay
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
