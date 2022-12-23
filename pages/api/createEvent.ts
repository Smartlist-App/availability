import prisma from "../../prisma/prisma";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const body = JSON.parse(req.body);
  console.log(body);

  const data = await prisma.event.create({
    data: {
      name: body.name ?? "Meeting",
      description: body.description ?? "",
      location: body.location ?? "",
      noEarlierThan: body.noEarlierThan ?? "",
      noLaterThan: body.noLaterThan ?? "",
    },
  });
  await prisma.defaultDate.createMany({
    data: JSON.parse(body.defaultDates).map((date: string) => {
      return {
        date: new Date(date),
        eventId: data.id,
      };
    }),
  });

  res.json(data);
}
