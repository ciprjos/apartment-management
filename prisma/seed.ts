import { prisma } from "../lib/prisma";
import argon2 from "argon2";

async function main() {
  // Create a landlord user
  const landlordPassword = await argon2.hash("landlordpass");
  const landlord = await prisma.user.create({
    data: {
      email: "landlord@example.com",
      password: landlordPassword,
      name: "Landlord Owner",
      role: "LANDLORD",
    },
  });

  // Create a tenant user
  const tenantPassword = await argon2.hash("tenantpass");
  const tenantUser = await prisma.user.create({
    data: {
      email: "tenant@example.com",
      password: tenantPassword,
      name: "Tenant User",
      role: "TENANT",
    },
  });

  // Create an apartment
  const apartment = await prisma.apartment.create({
    data: {
      apartment_key: "APT-001",
      name: "Sunset Apartments",
      address: "123 Main St",
      city: "Metropolis",
      state: "CA",
      postalCode: "90001",
      country: "USA",
      numberOfRooms: 3,
      amenities: ["Pool", "Gym", "Parking"],
      createdById: landlord.id,
    },
  });

  // Create rooms
  await prisma.room.createMany({
    data: [
      {
        apartmentId: apartment.id,
        name: "Room 1",
        type: "ONE_BEDROOM",
        sizeSqFt: 500,
        floor: 1,
        occupancy: 2,
        hasWindow: true,
        createdById: landlord.id,
      },
      {
        apartmentId: apartment.id,
        name: "Room 2",
        type: "TWO_BEDROOM",
        sizeSqFt: 700,
        floor: 1,
        occupancy: 3,
        hasWindow: true,
        createdById: landlord.id,
      },
      {
        apartmentId: apartment.id,
        name: "Room 3",
        type: "STUDIO",
        sizeSqFt: 350,
        floor: 2,
        occupancy: 1,
        hasWindow: false,
        createdById: landlord.id,
      },
    ],
  });

  // Create a tenant
  const tenant = await prisma.tenant.create({
    data: {
      userId: tenantUser.id,
      fullName: "Tenant User",
      email: "tenant@example.com",
      phone: "555-1234",
      createdById: landlord.id,
    },
  });

  // Create a lease
  const lease = await prisma.lease.create({
    data: {
      userId: tenantUser.id,
      tenantId: tenant.id,
      apartmentId: apartment.id,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: 1200,
      status: "ACTIVE",
      createdById: landlord.id,
    },
  });

  // Create a billing
  const billing = await prisma.billing.create({
    data: {
      leaseId: lease.id,
      description: "Monthly Rent",
      amount: 1200,
      dueDate: new Date(),
      status: "PENDING",
      createdById: landlord.id,
    },
  });

  // Create a payment
  await prisma.payment.create({
    data: {
      referenceNumber: "PAY-001",
      leaseId: lease.id,
      billingId: billing.id,
      amount: 1200,
      paidAt: new Date(),
      method: "BANK_TRANSFER",
      status: "COMPLETED",
      createdById: tenantUser.id,
    },
  });

  // Create a maintenance request
  await prisma.maintenanceRequest.create({
    data: {
      apartmentId: apartment.id,
      userId: tenantUser.id,
      title: "Leaky faucet",
      description: "The kitchen faucet is leaking.",
      status: "PENDING",
      createdById: tenantUser.id,
    },
  });

  // Create a chat and a message
  const chat = await prisma.chat.create({
    data: {
      users: { connect: [{ id: landlord.id }, { id: tenantUser.id }] },
      createdById: landlord.id,
    },
  });
  await prisma.message.create({
    data: {
      chatId: chat.id,
      senderId: landlord.id,
      content: "Welcome to your new apartment!",
      read: false,
      createdById: landlord.id,
    },
  });

  console.log("Seed data created successfully.");
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
