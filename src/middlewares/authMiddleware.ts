import jwt from "jsonwebtoken";
import { User } from "../Models/User";
export const authMiddleware = async (req: any, res: any, next: any) => {
  const {token}=req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, "JWT_SECRET_KEY");
        const { id } = decoded as any;
        const user=await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

}