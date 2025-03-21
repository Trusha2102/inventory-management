import request from "supertest";
import app from "../server"; // Ensure server.ts exports app
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Product API Tests", () => {
  let token: string;

  beforeAll(async () => {
    // 🔹 Ensure test database is clean
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();

    // 🔹 Hash password before storing
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 🔹 Create an admin user with hashed password
    await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "admin@test.com",
        password: hashedPassword, // ✅ Storing hashed password
        role: "admin",
      },
    });

    const category = await prisma.category.create({
      data: { name: "Test Category" },
    });
    const categoryId = category.id; // ✅ Use this in the product creation test

    // 🔹 Log in to get JWT token
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123", // ✅ This must match the plaintext password before hashing
    });

    token = res.body.token;
    console.log("Admin Token:", token); // ✅ Debugging token
  });

  afterAll(async () => {
    await prisma.product.deleteMany(); // Cleanup test data
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

 test("🔹 Should create a product (Admin only)", async () => {
   const res = await request(app)
     .post("/api/products")
     .set("Authorization", `Bearer ${token}`)
     .send({
       name: "Test Product",
       description: "A sample product",
       price: 100,
       quantity: 10,
       categoryId: "test-category-id", // ✅ Ensure required fields are provided
       supplierInfo: "Test Supplier", // ✅ Optional field added for safety
     });

   console.log("Create Product Response:", res.body); // ✅ Debugging response

   expect(res.status).toBe(201);
   expect(res.body.name).toBe("Test Product");
 });


  test("🔹 Should fetch all products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    console.log("Get Products Response:", res.body); // ✅ Debugging response

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

test("🔹 Should return 403 for non-admin trying to create a product", async () => {
  const userRes = await request(app).post("/api/auth/register").send({
    name: "Regular User",
    email: "user@test.com",
    password: "user123",
  });

  console.log("Register Response:", userRes.body); // ✅ Debugging response

  const userToken = userRes.body.token; // ✅ Ensure we extract the token

  const res = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      name: "Unauthorized Product",
      description: "Should not be created",
      price: 50,
      quantity: 5,
      categoryId: "test-category-id",
    });

  console.log("Unauthorized Create Response:", res.body); // ✅ Debugging response

  expect(res.status).toBe(403);
});

});
