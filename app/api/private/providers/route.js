import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { staffSchema, deleteStaffSchema } from "@/lib/validators";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ errors: "Invalid data" }, { status: 422 });
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "No permission" }, { status: 401 });
  }
  const {
    user: { name, email },
  } = session;

  const prisma = new PrismaClient();
  try {
    const data = await staffSchema.validate(body);
    await prisma.companies.update({
      where: {
        email,
      },
      data: {
        staffs: {
          create: data,
        },
      },
    });

    return Response.json({ message: "Create successfully", status: 200 });
  } catch (e) {
    console.log(e);
    if (e.name === "ValidationError") {
      return Response.json(
        { message: e.message, status: 422 },
        { status: 422 }
      );
    }
    return Response.json(
      { message: "Something went wrong :(", status: 500 },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  let page = parseInt(req.nextUrl.searchParams.get("page")) ?? 1;
  let size = parseInt(req.nextUrl.searchParams.get("size")) ?? 10;
  let providerId = req.nextUrl.searchParams.get("id") ?? "";

  if (isNaN(page) || page < 0) {
    page = 1;
  }

  if (isNaN(size) || size < 0) {
    size = 10;
  }
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "No permission" }, { status: 401 });
  }
  const {
    user: { name, email },
  } = session;

  const prisma = new PrismaClient();
  try {
    if (providerId !== "") {
      const data = await prisma.staffs.findUnique({
        where: {
          id: providerId,
        },
        select: {
          id: true,
          name: true,
          companies: {
            select: {
              name: true,
            },
          },
        },
      });
      return Response.json({
        page,
        result: data,
        status: 200,
      });
    } else {
      const data = await prisma.$transaction([
        prisma.staffs.count(),
        prisma.staffs.findMany({
          skip: (page - 1) * size,
          take: size,
          where: {
            companies: {
              email,
            },
          },
          orderBy: {
            name: "desc",
          },
        }),
      ]);
      return Response.json({
        page,
        total: data[0],
        result: data[1],
        status: 200,
      });
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { message: "Something went wrong :(", status: 500 },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ errors: "Invalid data" }, { status: 422 });
  }

  const prisma = new PrismaClient();
  try {
    const data = await deleteStaffSchema.validate(body);
    await prisma.staffs.deleteMany({
      where: {
        id: {
          in: body,
        },
      },
    });
    return Response.json({ message: "Delete successfully", status: 200 });
  } catch (e) {
    console.log(e);
    if (e.name === "ValidationError") {
      return Response.json(
        { message: e.message, status: 422 },
        { status: 422 }
      );
    }
    return Response.json(
      { message: "Something went wrong :(", status: 500 },
      { status: 500 }
    );
  }
}
