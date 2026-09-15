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
  console.log("🌱 Starting database seed...");

  // ============================================================
  // CLEAN DATABASE
  // ============================================================

  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.borrowing.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.borrowRequest.deleteMany();
  await prisma.resourceImage.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleaned");

  // ============================================================
  // USERS
  // ============================================================

  const ahmad = await prisma.user.create({
    data: {
      name: "Ahmad Abdallah",
      email: "ahmad@example.com",
      passwordHash: "hashed_password_ahmad",
      phone: "+96170123456",
      bio: "Computer Science student and resource sharing platform user",
    },
  });

  const john = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "john@example.com",
      passwordHash: "hashed_password_john",
      phone: "+96171123456",
      bio: "I enjoy sharing technology and books.",
    },
  });

  const sara = await prisma.user.create({
    data: {
      name: "Sara Johnson",
      email: "sara@example.com",
      passwordHash: "hashed_password_sara",
      phone: "+96176123456",
      bio: "Tools and sports equipment enthusiast.",
    },
  });

  const michael = await prisma.user.create({
    data: {
      name: "Michael Brown",
      email: "michael@example.com",
      passwordHash: "hashed_password_michael",
      phone: "+96181123456",
      bio: "Community member and frequent borrower.",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@example.com",
      passwordHash: "hashed_password_admin",
      role: "ADMIN",
    },
  });

  console.log("👤 Users created");

  // ============================================================
  // CATEGORIES
  // ============================================================

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Computers, cameras, and electronic devices",
    },
  });

  const tools = await prisma.category.create({
    data: {
      name: "Tools",
      description: "Tools and equipment for work and home projects",
    },
  });

  const books = await prisma.category.create({
    data: {
      name: "Books",
      description: "Educational and recreational books",
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: "Sports",
      description: "Sports and fitness equipment",
    },
  });

  const homeGarden = await prisma.category.create({
    data: {
      name: "Home & Garden",
      description: "Items for home and garden use",
    },
  });

  console.log("📂 Categories created");

  // ============================================================
  // RESOURCES
  // ============================================================

  const laptop = await prisma.resource.create({
    data: {
      title: "MacBook Pro",
      description:
        "Laptop available for short-term development and study projects.",
      condition: "LIKE_NEW",
      status: "AVAILABLE",
      location: "Beirut",
      city: "Beirut",
      ownerId: ahmad.id,
      categoryId: electronics.id,
    },
  });

  const camera = await prisma.resource.create({
    data: {
      title: "Canon Camera",
      description: "Digital camera for photography projects and events.",
      condition: "GOOD",
      status: "AVAILABLE",
      location: "Tripoli",
      city: "Tripoli",
      ownerId: john.id,
      categoryId: electronics.id,
    },
  });

  const drill = await prisma.resource.create({
    data: {
      title: "Power Drill",
      description: "Electric drill suitable for small home projects.",
      condition: "GOOD",
      status: "AVAILABLE",
      location: "Beirut",
      city: "Beirut",
      ownerId: sara.id,
      categoryId: tools.id,
    },
  });

  const programmingBook = await prisma.resource.create({
    data: {
      title: "The Pragmatic Programmer",
      description: "Programming and software development book.",
      condition: "LIKE_NEW",
      status: "AVAILABLE",
      location: "Tripoli",
      city: "Tripoli",
      ownerId: ahmad.id,
      categoryId: books.id,
    },
  });

  const football = await prisma.resource.create({
    data: {
      title: "Football",
      description: "Professional football available for community use.",
      condition: "GOOD",
      status: "AVAILABLE",
      location: "Beirut",
      city: "Beirut",
      ownerId: michael.id,
      categoryId: sports.id,
    },
  });

  const ladder = await prisma.resource.create({
    data: {
      title: "Extension Ladder",
      description: "Ladder for temporary home maintenance.",
      condition: "FAIR",
      status: "AVAILABLE",
      location: "Akkar",
      city: "Akkar",
      ownerId: john.id,
      categoryId: homeGarden.id,
    },
  });

  console.log("📦 Resources created");

  // ============================================================
  // RESOURCE IMAGES
  // ============================================================

  await prisma.resourceImage.createMany({
    data: [
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
        resourceId: laptop.id,
      },
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        resourceId: camera.id,
      },
      {
        url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
        resourceId: drill.id,
      },
      {
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
        resourceId: programmingBook.id,
      },
      {
        url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
        resourceId: football.id,
      },
      {
        url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
        resourceId: ladder.id,
      },
    ],
  });

  console.log("🖼 Resource images created");

  // ============================================================
  // BORROW REQUEST
  // ============================================================

  const borrowRequest = await prisma.borrowRequest.create({
    data: {
      resourceId: camera.id,
      requesterId: ahmad.id,
      message: "Hi John, can I borrow the camera for a university project?",
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-18"),
      status: "APPROVED",
      respondedAt: new Date(),
    },
  });

  const pendingRequest = await prisma.borrowRequest.create({
    data: {
      resourceId: drill.id,
      requesterId: michael.id,
      message: "I need the drill for a small home project.",
      startDate: new Date("2026-09-20"),
      endDate: new Date("2026-09-22"),
      status: "PENDING",
    },
  });

  console.log("📨 Borrow requests created");

  // ============================================================
  // RESERVATION
  // ============================================================

  const reservation = await prisma.reservation.create({
    data: {
      resourceId: camera.id,
      userId: ahmad.id,
      borrowRequestId: borrowRequest.id,
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-18"),
      status: "CONFIRMED",
    },
  });

  const secondReservation = await prisma.reservation.create({
    data: {
      resourceId: laptop.id,
      userId: john.id,
      startDate: new Date("2026-09-25"),
      endDate: new Date("2026-09-27"),
      status: "PENDING",
    },
  });

  console.log("📅 Reservations created");

  // ============================================================
  // BORROWING
  // ============================================================

  const borrowing = await prisma.borrowing.create({
    data: {
      resourceId: camera.id,
      borrowerId: ahmad.id,
      reservationId: reservation.id,
      borrowedAt: new Date("2026-09-15"),
      dueDate: new Date("2026-09-18"),
      returnedAt: new Date("2026-09-18"),
      status: "RETURNED",
    },
  });

  const activeBorrowing = await prisma.borrowing.create({
    data: {
      resourceId: programmingBook.id,
      borrowerId: sara.id,
      borrowedAt: new Date("2026-09-05"),
      dueDate: new Date("2026-09-20"),
      status: "ACTIVE",
    },
  });

  console.log("🤝 Borrowings created");

  // ============================================================
  // REVIEW
  // ============================================================

  await prisma.review.create({
    data: {
      reviewerId: ahmad.id,
      revieweeId: john.id,
      borrowingId: borrowing.id,
      rating: 5,
      comment: "Great experience. The resource was exactly as described.",
    },
  });

  console.log("⭐ Review created");

  // ============================================================
  // CONVERSATION
  // ============================================================

  const conversation = await prisma.conversation.create({
    data: {
      resourceId: camera.id,
    },
  });

  // ============================================================
  // CONVERSATION PARTICIPANTS
  // ============================================================

  await prisma.conversationParticipant.createMany({
    data: [
      {
        conversationId: conversation.id,
        userId: ahmad.id,
      },
      {
        conversationId: conversation.id,
        userId: john.id,
      },
    ],
  });

  console.log("💬 Conversation participants created");

  // ============================================================
  // MESSAGES
  // ============================================================

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: ahmad.id,
        content: "Hello John, is the camera still available?",
      },
      {
        conversationId: conversation.id,
        senderId: john.id,
        content: "Yes, it is available. You can send a borrow request.",
      },
      {
        conversationId: conversation.id,
        senderId: ahmad.id,
        content: "Perfect, thank you!",
      },
    ],
  });

  console.log("✉️ Messages created");

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  await prisma.notification.createMany({
    data: [
      {
        userId: john.id,
        type: "BORROW_REQUEST",
        title: "New Borrow Request",
        message: "Ahmad sent you a request to borrow your camera.",
        isRead: false,
      },
      {
        userId: ahmad.id,
        type: "REQUEST_APPROVED",
        title: "Request Approved",
        message: "Your request to borrow the Canon Camera was approved.",
        isRead: false,
      },
      {
        userId: john.id,
        type: "NEW_MESSAGE",
        title: "New Message",
        message: "You received a new message from Ahmad.",
        isRead: true,
      },
    ],
  });

  console.log("🔔 Notifications created");

  // ============================================================
  // REPORTS
  // ============================================================

  await prisma.report.create({
    data: {
      reporterId: sara.id,
      resourceId: ladder.id,
      reason: "Incorrect resource information",
      description:
        "The description should be updated because the ladder has visible damage.",
      status: "PENDING",
    },
  });

  await prisma.report.create({
    data: {
      reporterId: michael.id,
      reportedUserId: john.id,
      reason: "Inappropriate behavior",
      description: "This is example test data for the reporting system.",
      status: "REVIEWING",
      adminNote: "Admin is reviewing the report.",
    },
  });

  console.log("🚨 Reports created");

  console.log("✅ Database seeding completed successfully!");

  console.log({
    users: {
      ahmad: ahmad.email,
      john: john.email,
      sara: sara.email,
      michael: michael.email,
      admin: admin.email,
    },
    resources: {
      laptop: laptop.title,
      camera: camera.title,
      drill: drill.title,
    },
    borrowRequests: {
      approved: borrowRequest.id,
      pending: pendingRequest.id,
    },
    reservations: {
      confirmed: reservation.id,
      pending: secondReservation.id,
    },
    borrowings: {
      returned: borrowing.id,
      active: activeBorrowing.id,
    },
  });
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
