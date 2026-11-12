const MIN_SECRET_LENGTH = 32;

// stops the server from starting if the JWT secret is missing or too short
export function checkJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters long`);
  }
}
