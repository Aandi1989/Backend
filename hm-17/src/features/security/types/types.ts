export type sessionType = {
    userId: string
    deviceId: string
    iat: string
    deviceName: string
    ip: string
    exp: string
}

export class SessionSQL {
    id: string
    userId: string
    deviceId: string
    deviceName: string
    iat: string
    exp: string
    ip: string
}