import jwt, { Secret } from "jsonwebtoken";

export default async function handler(req: any, res: any) {
  try {
    const { session }: any = req.cookies;
    const decoded = jwt.verify(session, process.env.SECRET_COOKIE_PASSWORD as Secret);
    res.json(decoded);
  } catch (e) {
    res.json({ error: "Something went wrong" });
  }
}
