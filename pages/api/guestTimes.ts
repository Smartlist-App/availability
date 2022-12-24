import prisma from "../../prisma/prisma";

export default async function handler(req: any, res: any) {
  const { id } = req.query;
  const data = await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      defaultDates: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });
  const guestTimes = await prisma.guestTime.findMany({
    where: {
      eventId: id,
    },
  });

  res.json({
    event: data,
    guestTimes: guestTimes,
  });
}
