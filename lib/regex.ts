/**
 * Regular expression for validating usernames.
 *
 * Rules:
 * - Must only contain lowercase letters (a-z), numbers (0-9), underscores (_), or dots (.).
 * - Must contain at least one letter (a-z).
 * - Cannot start with a dot (.).
 * - Cannot end with a dot (.).
 * - Cannot contain consecutive dots (e.g., "..").
 * - Can start or end with an underscore (_).
 * - Cannot be only numbers.
 * - Must be between 3 and 30 characters long when used with additional length validation.
 *
 * Example Valid Usernames:
 * - "username"
 * - "_user.name"
 * - "user_name123"
 * - "user.name_"
 * - "user.name._"
 * - "user123"
 *
 * Example Invalid Usernames:
 * - "12345" (contains only numbers)
 * - ".username" (starts with a dot)
 * - "username." (ends with a dot)
 * - "user..name" (contains consecutive dots)
 * - "12.34" (no letters present)
 */
export const USERNAME_REGEX =
  /^(?!.*\.\.)(?!.*\.$)(?=.*[a-z])[a-z0-9_]+(?:\.[a-z0-9_]+)*$/;

export const USERNAME_DISALLOWED_CHARS_REGEX = /[^a-z0-9_.]/g;
