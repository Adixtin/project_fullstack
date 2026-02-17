export interface VariationOptions {
    leet?: boolean;
    capitalize?: boolean;
}

/**
 * Overload for single word
 */
export function generateVariations(word: string): string[];
/**
 * Overload for multiple words
 */
export function generateVariations(words: string[]): string[];
/**
 * Overload for word with options
 */
export function generateVariations(word: string, options: VariationOptions): string[];

/**
 * Implementation of generateVariations
 */
export function generateVariations(
    input: string | string[],
    options?: VariationOptions
): string[] {
    const words = Array.isArray(input) ? input : [input];
    const results = new Set<string>();

    words.forEach((word) => {
        if (!word) return;

        const lower = word.toLowerCase();
        results.add(lower);

        if (options?.capitalize !== false) {
            results.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        }

        results.add(word.toUpperCase());

        if (options?.leet) {
            const leet = lower
                .replace(/a/g, "4")
                .replace(/e/g, "3")
                .replace(/i/g, "1")
                .replace(/o/g, "0")
                .replace(/s/g, "5")
                .replace(/t/g, "7");
            results.add(leet);
        }
    });

    return Array.from(results);
}
