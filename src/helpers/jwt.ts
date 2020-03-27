export interface DecodedJWT {
    header: { [key: string]: string };
    payload: { [key: string]: string };
}

// Decode JWT
export const decodeJWT: ((jwt: string) => DecodedJWT) = (jwt: string): DecodedJWT => {
    const jwtExplode: string[] = jwt.split('.');

    return {
        header: <{ [key: string]: string }>JSON.parse(atob(jwtExplode[0])),
        payload: <{ [key: string]: string }>JSON.parse(atob(jwtExplode[1])),
    };
};
