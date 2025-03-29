const VALID_STATE_CODES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'AS', 'GU', 'MP', 'PR', 'VI'
]);

/**
 * Validates a state code and returns the normalized uppercase version
 * @param stateCode The state code to validate
 * @returns The normalized state code
 * @throws Error if the state code is invalid
 */
export function validateStateCode(stateCode: string): string {
  const normalizedCode = stateCode.toUpperCase();

  if (normalizedCode.length !== 2) {
    throw new Error('State code must be exactly 2 characters');
  }

  if (!VALID_STATE_CODES.has(normalizedCode)) {
    throw new Error(`Invalid state code: ${stateCode}`);
  }

  return normalizedCode;
}

/**
 * Validates latitude and longitude coordinates
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @throws Error if coordinates are invalid
 */
export function validateCoordinates(latitude: number, longitude: number): void {
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
}