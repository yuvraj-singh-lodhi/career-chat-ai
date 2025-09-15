import bcrypt from "bcryptjs";

/**
 * Hash a plain text password before saving
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10); // cost factor = 10
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed one
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
