import { Request, Response, NextFunction } from "express";
export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export interface IController {
    [key: string]: AsyncRequestHandler;
}
//# sourceMappingURL=controller.interface.d.ts.map