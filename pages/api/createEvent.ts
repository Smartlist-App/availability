import prisma from "../../prisma/prisma";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const data = await prisma.event.create({
    data: {
      name: req.body.name,
      description: req.body.description ?? "",
      location: req.body.location ?? "",
      noEarlierThan: req.body.noEarlierThan ?? "",
      noLaterThan: req.body.noLaterThan ?? "",
    },
  });
  res.json({ message: "Coming soon" });
}
