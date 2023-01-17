import { JwtPayload } from 'jsonwebtoken';

export interface RequestWithUserRole extends Request {
    body: any;
    user_id?: string | JwtPayload | undefined;
    headers: HeaderWithAuthorization;
}

interface HeaderWithAuthorization extends Headers {
    authorization?: JwtPayload;
}
