import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validators";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        let { email, password } = credentials;
        const prisma = new PrismaClient();
        try {
          const validateData = await loginSchema.validate({ email, password });
          const company = await prisma.companies.findUnique({
            where: {
              email: validateData.email.toLowerCase(),
            },
            select: {
              email: true,
              location: true,
              password: true,
              name: true,
              phone: true,
            },
          });

          if (
            !company ||
            !bcrypt.compareSync(validateData.password, company.password)
          ) {
            throw new Error("Invalid credential");
          }

          return {
            email: company.email,
            location: company.location,
            name: company.name,
            phone: company.phone,
          };
        } catch (error) {
          if (error.name === "ValidationError") {
            const errorObj = {
              error: { [error.path]: error.errors.pop() },
              isGood: false,
            };
            throw new Error(JSON.stringify(errorObj));
          }
          console.log(error);
          throw new Error(
            JSON.stringify({
              error: { email: "", password: "Invalid credential" },
              isGood: false,
            })
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // session: async (session, user) => {
    //     if (session?.user !== undefined) {
    //         session.user.username = "khoa deptrai";
    //     }
    // //   session.user.username = "khoa deptrai";
    //   return Promise.resolve(session);
    // },
  },
};

export { authOptions };
