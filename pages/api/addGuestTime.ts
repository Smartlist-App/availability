import prisma from "../../prisma/prisma";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  //   console.log(req.body);
  const body = req.body;
  //   console.log(body);

  const data = await prisma.guestTime.create({
    data: {
      name: body.name ?? "Anonymous",
      times: body.userAvailableTimes,
      event: {
        connect: {
          id: body.eventId,
        },
      },
    },
  });
  res.json(data);
}
