export function debounce(func: (...args: unknown[]) => void, delay: number): (...args: unknown[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (...args: unknown[]) {
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
