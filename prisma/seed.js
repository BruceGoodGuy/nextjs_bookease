// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
async function main() {
  const categories = await prisma.categories.createMany({
    data: [
      {
        category: 1,
        label: "Beauty salons",
      },
      {
        category: 1,
        label: "Hair salons",
      },
      {
        category: 1,
        label: "Spa",
      },
      {
        category: 1,
        label: "Yoga",
      },
      {
        category: 2,
        label: "Personal trainers",
      },
      {
        category: 2,
        label: "Gyms",
      },
      {
        category: 2,
        label: "Fitness classes",
      },

      {
        category: 2,
        label: "Golf classes",
      },
      {
        category: 3,
        label: "Consulting",
      },
      {
        category: 3,
        label: "Coaching",
      },
      {
        category: 3,
        label: "Interview",
      },
      {
        category: 3,
        label: "Design consulting",
      },
      {
        category: 3,
        label: "Cleaning",
      },
      {
        category: 3,
        label: "Houshold",
      },
      {
        category: 3,
        label: "Pet services",
      },
      {
        category: 4,
        label: "Universities",
      },
      {
        category: 4,
        label: "Colleges",
      },
      {
        category: 4,
        label: "School",
      },
      {
        category: 4,
        label: "Teaching",
      },
      {
        category: 4,
        label: "Driving school",
      },
      {
        category: 4,
        label: "Services",
      },
      {
        category: 4,
        label: "Other",
      },
    ],
  });
  console.log(categories);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
