import { PrismaClient } from "@prisma/client";

export async function GET(request) {
  try {
    const prisma = new PrismaClient();
    const fields = await prisma.categories.findMany({
      select: {
        id: true,
        label: true,
      },
    });
    return Response.json(fields);
  } catch (e) {
    return Response.json({error: "Can't fetch data"}, {status: 500});
  }
}
