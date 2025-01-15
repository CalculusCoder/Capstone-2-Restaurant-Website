export const checkIfUserExists = `
SELECT user_id FROM users WHERE email = $1;
`;

export const regusterUser = `
INSERT INTO users (first_name, last_name, email, password)
VALUES ($1, $2, $3, $4)
RETURNING user_id;
`;
