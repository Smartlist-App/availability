import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req: any, res: any) {
  try {
    const { token: accessToken }: any = req.query;
    const { AVAILABILITY_OAUTH_SECRET }: any = process.env;

    const request = await fetch(
      "https://my.smartlist.tech/api/availability-auth/?" +
        new URLSearchParams({
          secret: AVAILABILITY_OAUTH_SECRET,
          accessToken,
        }),
      {
        method: "POST",
      }
    ).then((res) => res.json());

    const encoded = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 * 4 * 12, // 1 year
        ...request,
      },
      process.env.SECRET_COOKIE_PASSWORD
    );
    const now = new Date();
    now.setDate(now.getDate() * 7 * 4);
    res.setHeader(
      "Set-Cookie",
      serialize("session", encoded, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7 * 4, // 1 month
        expires: now,
      })
    );
    res.json({
      success: true,
    });
  } catch (e) {
    res.json({ error: "Something went wrong" });
  }
}
