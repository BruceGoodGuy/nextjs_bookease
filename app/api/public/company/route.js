import { PrismaClient } from "@prisma/client";
import { companySchema } from "@/lib/validators";
import bcrypt from "bcrypt";

export async function POST(request) {
  let res;
  try {
    res = await request.json();
  } catch (e) {
    return Response.json({ errors: "Invalid data" }, { status: 422 });
  }
  const prisma = new PrismaClient();
  const validateData = await validate(res);
  if (!validateData.isGood) {
    return Response.json({ ...validateData, status: 422 }, { status: 422 });
  }

  const cleanData = validateData.data;

  // const categories = await prisma.categories.findMany({
  //   where: {
  //     label: {
  //       in: res.fields,
  //     },
  //   },
  // });

  const categoriesData = cleanData.fields.map((id) => {
    return {
      categories: {
        connect: {
          id,
        },
      },
    };
  });

  const data = await prisma.companies.create({
    data: {
      name: cleanData.companyname,
      url: cleanData.companyurl.toLowerCase(),
      email: cleanData.email.toLowerCase(),
      password: bcrypt.hashSync(cleanData.password, 10),
      phone: cleanData.workphone,
      location: {
        create: {
          country: cleanData.country,
          countryCode: cleanData.countrycode,
          state: cleanData.state,
          city: cleanData.city,
          zip: cleanData.zip,
          street: cleanData.street,
          lat: String(cleanData.lat),
          long: String(cleanData.long),
        },
      },
      categories: {
        create: categoriesData,
      },
    },
    // include: {
    //   categories: true, // Include all categories in the returned object
    // },
  });
  // const invokeData = await prisma.companies.findMany({
  //   include: {
  //     location: true,
  //     categories: { include: { categories: true } },
  //   },
  // });
  return Response.json({ message: "Create successfully", status: 200});
}

const validate = async (data) => {
  try {
    const validateData = await companySchema.validate(data);
    const { email, companyurl, fields } = data;
    const prisma = new PrismaClient();
    const promise = [
      prisma.companies.findUnique({
        where: {
          email,
        },
      }),
      prisma.companies.findUnique({
        where: {
          url: companyurl.trim().toLowerCase(),
        },
      }),
      prisma.categories.findMany({
        where: {
          id: {
            in: fields,
          },
        },
      }),
    ];

    const response = await Promise.all(promise);
    if (response[0]) {
      return {
        fields: "email",
        message:
          "Oh Snap! This email is already taken, please choose another one",
      };
    }

    if (response[1]) {
      return {
        fields: "companyurl",
        message:
          "Oh Snap! This login name is already taken, please choose another one",
      };
    }
    if (response[2].length !== fields.length) {
      return {
        fields: "fields",
        message: "Invalid fields",
      };
    }
    return { isGood: true, data: validateData };
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return { fields: [error.path], message: error.errors };
    }
    return { fields: "", message: "Something went wrong" };
  }
};
