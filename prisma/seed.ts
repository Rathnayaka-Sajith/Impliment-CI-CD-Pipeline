import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SQLite database...");

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  // Create sample projects
  const fullstackProject = await prisma.project.create({
    data: {
      name: "3-Tier Architecture Practice",
      description: "Mastering Frontend UI, Backend Service APIs, and Database ORM layers.",
      color: "#059669",
    },
  });

  const designSystemProject = await prisma.project.create({
    data: {
      name: "Emerald UI Design System",
      description: "Clean white & green dashboard components and responsive layouts.",
      color: "#10b981",
    },
  });

  const devopsProject = await prisma.project.create({
    data: {
      name: "Deployment & Testing Pipeline",
      description: "Setting up automated integration tests, Docker, and cloud hosting.",
      color: "#047857",
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Design Prisma Schema for Projects & Tasks",
        description: "Define 1-to-many relational models in schema.prisma with cascade delete.",
        status: "COMPLETED",
        priority: "HIGH",
        projectId: fullstackProject.id,
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        title: "Implement Tier 2 Business Logic Services",
        description: "Separate validation and business rules into src/services/ before hitting the DB.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: fullstackProject.id,
        dueDate: new Date(Date.now() + 2 * 86400000),
      },
      {
        title: "Build RESTful Next.js API Route Handlers",
        description: "Create GET, POST, PATCH, and DELETE endpoints under src/app/api/.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        projectId: fullstackProject.id,
        dueDate: new Date(Date.now() + 3 * 86400000),
      },
      {
        title: "Craft White & Emerald Green Dashboard Theme",
        description: "Configure Tailwind palette with crisp white cards, subtle borders, and emerald accents.",
        status: "COMPLETED",
        priority: "MEDIUM",
        projectId: designSystemProject.id,
        dueDate: new Date(Date.now() - 86400000),
      },
      {
        title: "Add Interactive Kanban & List View Switcher",
        description: "Allow instant status updates across TODO, IN_PROGRESS, and COMPLETED columns.",
        status: "TODO",
        priority: "MEDIUM",
        projectId: designSystemProject.id,
        dueDate: new Date(Date.now() + 4 * 86400000),
      },
      {
        title: "Practice Writing Custom SQL / Prisma Queries",
        description: "Experiment with filtering, sorting, and aggregations in taskService.ts.",
        status: "TODO",
        priority: "LOW",
        projectId: devopsProject.id,
        dueDate: new Date(Date.now() + 5 * 86400000),
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
