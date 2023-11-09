import { PrismaClient } from "@prisma/client";

export async function GET(req) {
  try {
    const prisma = new PrismaClient();
    const url = await prisma.companies.findUnique({
      where: {
        url: req.nextUrl.searchParams.get("companyname").trim().toLowerCase(),
      },
    });
    return Response.json({
      statusCode: 200,
      data: !url,
    });
  } catch (e) {
    return Response.json({ error: "Can't fetch data" }, { status: 500 });
  }
}
