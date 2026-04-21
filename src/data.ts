export const adminMenu = [
  "Tables",
  "Menu",
  "Waiters"
];

type JwtPayload = {
    exp?: number;
    role?: string;
    [key: string]: unknown;
};

export function isTokenExpired(token: string): boolean {
    try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const payload: JwtPayload = JSON.parse(payloadJson);

        if (!payload.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);

        return payload.exp < currentTime;
    } catch {
        return true;
    }
}