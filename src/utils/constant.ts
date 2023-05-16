const jwtSecret = process.env.JWT_SECRET;
const jwtKey = process.env.JWT_KEY;
const clientUrl = process.env.CLIENT_URL;
const adminAccess: number[] = [+process.env.ADMIN_1, +process.env.ADMIN_2];

export { jwtSecret, jwtKey, clientUrl, adminAccess };
