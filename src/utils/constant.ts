const jwtSecret = process.env.JWT_SECRET;
const jwtKey = process.env.JWT_KEY;
const jwtRefresh = process.env.JWT_REFRESH;
const clientUrl = process.env.CLIENT_URL;
const adminAccess: number[] = [+process.env.ADMIN_1, +process.env.ADMIN_2];

export { jwtSecret, jwtKey, jwtRefresh, clientUrl, adminAccess };
