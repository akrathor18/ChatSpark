import { User } from "../models/user.model.js";
import { 
    isValidUsername, 
    normalizeUsername, 
    isReservedUsername, 
    isProfane 
} from "../utils/username.js";

export interface ValidationResult {
    valid: boolean;
    available?: boolean;
    message?: string;
    normalized?: string;
}

/**
 * Orchestrates the full username validation and moderation flow.
 */
export const validateUsername = async (username: string, currentUserId?: string): Promise<ValidationResult> => {
    // 1. Format validation
    if (!username || username.length < 3 || username.length > 20) {
        return { valid: false, message: "Username must be 3-20 characters long" };
    }

    if (!isValidUsername(username)) {
        return { valid: false, message: "Username can only contain lowercase letters, numbers, and single underscores (no leading/trailing underscores)" };
    }

    // 2. Normalize
    const normalized = normalizeUsername(username);

    // 3. Profanity check
    if (isProfane(username)) {
        return { valid: false, message: "Username contains restricted language" };
    }

    // 4. Reserved check
    if (isReservedUsername(username)) {
        return { valid: false, message: "This username is reserved" };
    }

    // 5. DB Uniqueness check (against normalizedUsername)
    const existingUser = await User.findOne({ 
        normalizedUsername: normalized,
        _id: { $ne: currentUserId }
    });

    if (existingUser) {
        return { valid: false, available: false, message: "Username is already taken or too similar to an existing user" };
    }

    return { 
        valid: true, 
        available: true, 
        normalized,
        message: "Username is available" 
    };
};
