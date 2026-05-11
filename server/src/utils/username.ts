/**
 * Validates the basic format of a username.
 * - 3-20 characters
 * - lowercase letters, numbers, underscore
 * - Cannot start or end with underscore
 * - No consecutive underscores
 */
export const isValidUsername = (username: string): boolean => {
    // Regex breakdown:
    // ^[a-z0-9]        - starts with letter or number
    // (?!.*__)         - no consecutive underscores
    // [a-z0-9_]{1,18}  - middle chars (total 2-19)
    // [a-z0-9]$        - ends with letter or number
    const regex = /^[a-z0-9](?!.*__)[a-z0-9_]{1,18}[a-z0-9]$/;
    return regex.test(username);
};

/**
 * Normalizes a username for comparison and moderation.
 * - Lowercase
 * - Remove spaces and special symbols
 * - Leetspeak conversion
 */
export const normalizeUsername = (username: string): string => {
    let normalized = username.trim().toLowerCase();

    // Leetspeak map for common substitutions
    const leetMap: Record<string, string> = {
        '0': 'o',
        '1': 'i',
        '3': 'e',
        '4': 'a',
        '5': 's',
        '7': 't',
        '8': 'b',
        'v': 'u',
        '@': 'a',
        '!': 'i',
        '$': 's',
        '(': 'c',
        '[': 'c',
        '|': 'i',
    };

    // Replace leetspeak characters
    let result = '';
    for (const char of normalized) {
        result += leetMap[char] || char;
    }

    // Remove non-alphanumeric chars for "deep" normalization
    return result.replace(/[^a-z0-9]/g, '');
};

/**
 * Checks if the username is in the reserved list.
 */
export const isReservedUsername = (username: string): boolean => {
    const reserved = [
        "admin", "administrator", "support", "official", "system", 
        "moderator", "mod", "chatspark", "help", "staff", "root",
        "security", "privacy", "guest"
    ];
    
    const normalized = normalizeUsername(username);
    return reserved.some(r => normalized === r || normalized.includes(r));
};

/**
 * Checks for offensive content.
 * A production app would use a library or a much larger list.
 */
export const isProfane = (username: string): boolean => {
    const badWords = [
        "fuck", "fuk", "fck", "fock", "sh1t", "shit", "shat", "ass", "bitch", "btch", "cunt", "dick", "pussy", 
        "nigger", "faggot", "retard", "slut", "whore", "bastard",
        "porn", "sexy", "abuse", "hate", "kill", "death"
    ];
    
    const normalized = normalizeUsername(username);
    // Check if the normalized string contains any bad word, 
    // or if the bad word is contained within the string
    return badWords.some(word => normalized.includes(word));
};

/**
 * Similarity check for impersonation.
 * Simple implementation checking if two strings are almost identical.
 */
export const isTooSimilar = (username: string, existingNames: string[]): boolean => {
    const norm1 = normalizeUsername(username);
    
    for (const existing of existingNames) {
        const norm2 = normalizeUsername(existing);
        if (norm1 === norm2) return true;
        
        // Also check if one contains the other (e.g. admin vs admin1)
        if (norm1.includes(norm2) || norm2.includes(norm1)) {
             // If the base name is short (like admin), avoid simple appendings
             if (norm2.length <= 5 && norm1.length > norm2.length) return true;
        }
    }
    
    return false;
};