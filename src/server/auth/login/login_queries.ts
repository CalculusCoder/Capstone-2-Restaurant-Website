export const getUserPassword = `
SELECT password, user_id
FROM users
WHERE email = $1;
`;
