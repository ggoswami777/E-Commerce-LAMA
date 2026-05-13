import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import {CustomJwtSessionClaims} from "@repo/types"
declare global{
    namespace Express{
        interface Request{
            userId?:string;
        }
    }
}

export const shouldBeUser = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
        return res.status(401).json({ message: "You are not logged in" });
    }
    req.userId = userId;
    return next();
};
export const shouldBeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
        return res.status(401).json({ message: "You are not logged in" });
    }
    const claims = auth.sessionClaims as any;
    console.log("Auth User ID:", userId);
    console.log("Session Claims:", JSON.stringify(claims, null, 2));

    const role = claims.metadata?.role || claims.role;

    if (role !== "admin") {
        return res.status(403).send({ 
            message: "Unauthorized! Admin role required.",
            detectedRole: role || "none"
        });
    }
    req.userId = userId;
    return next();
};
