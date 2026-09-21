import "dotenv/config";

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Adding test data...");

  // ============================================================
  // FIND EXISTING USERS
  // ============================================================

  const ahmad = await prisma.user.findUnique({
    where: {
      email: "ahmad@example.com",
    },
  });

  const john = await prisma.user.findUnique({
    where: {
      email: "john@example.com",
    },
  });

  const sara = await prisma.user.findUnique({
    where: {
      email: "sara@example.com",
    },
  });

  const michael = await prisma.user.findUnique({
    where: {
      email: "michael@example.com",
    },
  });

  if (!ahmad || !john || !sara || !michael) {
    throw new Error("❌ One or more users were not found.");
  }

  console.log("👤 Users found");

  // ============================================================
  // FIND FOOTBALL RESOURCE
  // ============================================================

  const football = await prisma.resource.findFirst({
    where: {
      title: "Football",
    },
  });

  if (!football) {
    throw new Error("❌ Football resource was not found.");
  }

  console.log("⚽ Football resource found");

  // ============================================================
  // CREATE THIRD BORROWING
  // ============================================================

  const existingFootballBorrowing = await prisma.borrowing.findFirst({
    where: {
      resourceId: football.id,
      borrowerId: john.id,
    },
  });

  let thirdBorrowing;

  if (existingFootballBorrowing) {
    console.log("ℹ️ Football borrowing already exists.");

    thirdBorrowing = existingFootballBorrowing;
  } else {
    thirdBorrowing = await prisma.borrowing.create({
      data: {
        resourceId: football.id,
        borrowerId: john.id,
        borrowedAt: new Date("2026-09-10"),
        dueDate: new Date("2026-09-15"),
        returnedAt: new Date("2026-09-15"),
        status: "RETURNED",
      },
    });

    console.log("🤝 Third borrowing created:", thirdBorrowing.id);
  }

  // ============================================================
  // FIND EXISTING BORROWINGS
  // ============================================================

  const borrowing1 = await prisma.borrowing.findFirst({
    where: {
      borrowerId: ahmad.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const borrowing2 = await prisma.borrowing.findFirst({
    where: {
      borrowerId: sara.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!borrowing1 || !borrowing2) {
    throw new Error("❌ Required borrowings were not found.");
  }

  // ============================================================
  // RATINGS
  // ============================================================

  const existingRating1 = await prisma.rating.findUnique({
    where: {
      borrowingId: borrowing1.id,
    },
  });

  if (!existingRating1) {
    await prisma.rating.create({
      data: {
        borrowingId: borrowing1.id,
        raterId: ahmad.id,
        ratedUserId: john.id,
        rating: 5,
        comment:
          "Great experience. John was very helpful and the camera was in excellent condition.",
      },
    });

    console.log("⭐ Rating 1 created");
  } else {
    console.log("ℹ️ Rating 1 already exists");
  }

  const existingRating2 = await prisma.rating.findUnique({
    where: {
      borrowingId: borrowing2.id,
    },
  });

  if (!existingRating2) {
    await prisma.rating.create({
      data: {
        borrowingId: borrowing2.id,
        raterId: sara.id,
        ratedUserId: ahmad.id,
        rating: 4,
        comment:
          "Good experience. The book was in very good condition and Ahmad was helpful.",
      },
    });

    console.log("⭐ Rating 2 created");
  } else {
    console.log("ℹ️ Rating 2 already exists");
  }

  const existingRating3 = await prisma.rating.findUnique({
    where: {
      borrowingId: thirdBorrowing.id,
    },
  });

  if (!existingRating3) {
    await prisma.rating.create({
      data: {
        borrowingId: thirdBorrowing.id,
        raterId: john.id,
        ratedUserId: michael.id,
        rating: 5,
        comment:
          "Excellent experience. Michael was friendly and the football was in great condition.",
      },
    });

    console.log("⭐ Rating 3 created");
  } else {
    console.log("ℹ️ Rating 3 already exists");
  }

  // ============================================================
  // ACTIVITIES
  // ============================================================

  await prisma.activity.createMany({
    data: [
      {
        userId: ahmad.id,
        action: "BORROW_REQUEST_CREATED",
        entityType: "BORROW_REQUEST",
        entityId: borrowing1.id,
        description: "Ahmad created a borrow request for the Canon Camera.",
      },
      {
        userId: john.id,
        action: "BORROW_REQUEST_APPROVED",
        entityType: "BORROW_REQUEST",
        entityId: borrowing1.id,
        description:
          "John approved Ahmad's borrow request for the Canon Camera.",
      },
      {
        userId: ahmad.id,
        action: "BORROWING_STARTED",
        entityType: "BORROWING",
        entityId: borrowing1.id,
        description: "Ahmad started borrowing the Canon Camera.",
      },
      {
        userId: ahmad.id,
        action: "RESOURCE_RETURNED",
        entityType: "BORROWING",
        entityId: borrowing1.id,
        description: "Ahmad returned the Canon Camera.",
      },
      {
        userId: sara.id,
        action: "BORROWING_STARTED",
        entityType: "BORROWING",
        entityId: borrowing2.id,
        description: "Sara started borrowing The Pragmatic Programmer.",
      },
      {
        userId: john.id,
        action: "BORROWING_STARTED",
        entityType: "BORROWING",
        entityId: thirdBorrowing.id,
        description: "John started borrowing the Football.",
      },
      {
        userId: john.id,
        action: "RESOURCE_RETURNED",
        entityType: "BORROWING",
        entityId: thirdBorrowing.id,
        description: "John returned the Football.",
      },
    ],
  });

  console.log("📊 Activities created");

  console.log("✅ Test data added successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Failed to add test data:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
