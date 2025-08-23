import { prisma } from "../lib/prisma";
import argon2 from "argon2";
import { faker } from "@faker-js/faker";

async function main() {
  // Create random landlords (5-10)
  const landlordCount = faker.number.int({ min: 5, max: 10 });
  const landlords = [];
  for (let i = 0; i < landlordCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = await argon2.hash(faker.internet.password());
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name: `${firstName} ${lastName}`,
        role: "LANDLORD",
      },
    });
    const landlord = await prisma.landlord.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        email,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        verified: faker.datatype.boolean(),
        companyName: faker.company.name(),
        companyRegNo: faker.string.alphanumeric(8),
        bankAccount: faker.finance.accountNumber(),
        taxId: faker.string.alphanumeric(10),
      },
    });
    landlords.push({ user, landlord });
  }

  // Create random tenants (30-50)
  const tenantCount = faker.number.int({ min: 30, max: 50 });
  const tenants = [];
  for (let i = 0; i < tenantCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = await argon2.hash(faker.internet.password());
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name: `${firstName} ${lastName}`,
        role: "TENANT",
      },
    });
    const tenant = await prisma.tenant.create({
      data: {
        userId: user.id,
        fullName: `${firstName} ${lastName}`,
        email,
        phone: faker.phone.number(),
      },
    });
    tenants.push({ user, tenant });
  }

  // Create 20 apartments
  for (let i = 0; i < 20; i++) {
    const landlordIdx = faker.number.int({ min: 0, max: landlords.length - 1 });
    const { user: landlordUser, landlord } = landlords[landlordIdx];
    const apartment = await prisma.apartment.create({
      data: {
        apartment_key: `APT-${faker.string.alphanumeric(5).toUpperCase()}`,
        name: faker.company.name() + " Apartments",
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        numberOfRooms: faker.number.int({ min: 2, max: 8 }),
        amenities: faker.helpers.arrayElements(
          ["Pool", "Gym", "Parking", "Laundry", "WiFi", "Garden"],
          faker.number.int({ min: 2, max: 5 })
        ),
        landlordId: landlord.id,
        createdById: landlordUser.id,
      },
    });

    // Create 8-12 rooms for each apartment
    const roomCount = faker.number.int({ min: 8, max: 12 });
    for (let r = 0; r < roomCount; r++) {
      await prisma.room.create({
        data: {
          apartmentId: apartment.id,
          name: `Room ${r + 1}`,
          type: faker.helpers.arrayElement([
            "STUDIO",
            "ONE_BEDROOM",
            "TWO_BEDROOM",
            "THREE_BEDROOM",
          ]),
          sizeSqFt: faker.number.int({ min: 200, max: 1200 }),
          floor: faker.number.int({ min: 1, max: 3 }),
          occupancy: faker.number.int({ min: 1, max: 4 }),
          hasWindow: faker.datatype.boolean(),
          createdById: landlordUser.id,
        },
      });
    }

    // 12-18 sets of Leases, Billings, Payments, Maintenance Requests, Chats, Messages
    const dataSetCount = faker.number.int({ min: 12, max: 18 });
    for (let d = 0; d < dataSetCount; d++) {
      // Assign a random tenant to the apartment
      const tenantIdx = faker.number.int({ min: 0, max: tenants.length - 1 });
      const { user: tenantUser, tenant } = tenants[tenantIdx];

      // Create a lease
      const lease = await prisma.lease.create({
        data: {
          userId: tenantUser.id,
          tenantId: tenant.id,
          apartmentId: apartment.id,
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          rentAmount: faker.number.int({ min: 800, max: 3000 }),
          status: "ACTIVE",
          createdById: landlordUser.id,
        },
      });

      // Create a billing
      const billing = await prisma.billing.create({
        data: {
          billingNumber: `BILL-${faker.string.alphanumeric(8).toUpperCase()}`,
          leaseId: lease.id,
          description: "Monthly Rent",
          amount: lease.rentAmount,
          dueDate: faker.date.future(),
          status: "PENDING",
          createdById: landlordUser.id,
        },
      });

      // Create a payment
      await prisma.payment.create({
        data: {
          referenceNumber: `PAY-${faker.string.alphanumeric(5).toUpperCase()}`,
          leaseId: lease.id,
          billingId: billing.id,
          amount: billing.amount,
          paidAt: faker.date.recent(),
          method: faker.helpers.arrayElement([
            "CASH",
            "CREDIT_CARD",
            "BANK_TRANSFER",
            "ONLINE",
          ]),
          status: "COMPLETED",
          createdById: tenantUser.id,
        },
      });

      // Create a maintenance request
      await prisma.maintenanceRequest.create({
        data: {
          apartmentId: apartment.id,
          userId: tenantUser.id,
          title: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          status: "PENDING",
          createdById: tenantUser.id,
        },
      });

      // Create a chat and a message
      const chat = await prisma.chat.create({
        data: {
          users: { connect: [{ id: landlordUser.id }, { id: tenantUser.id }] },
          createdById: landlordUser.id,
        },
      });
      await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: landlordUser.id,
          content: "Welcome to your new apartment!",
          read: false,
          createdById: landlordUser.id,
        },
      });
    }
  }

  console.log(
    "Seeded 20 apartments with random landlords, tenants, and related data."
  );
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
