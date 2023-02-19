-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "currency" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
