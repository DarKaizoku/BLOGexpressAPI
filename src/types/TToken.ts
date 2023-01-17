import { JwtPayload } from 'jsonwebtoken';

export interface RequestWithUserRole extends Request {
        user_id?: string | JwtPayload | undefined;
        headers: HeaderWithAuthorization;
}

interface HeaderWithAuthorization extends Headers {
        authorization?: JwtPayload;
}
