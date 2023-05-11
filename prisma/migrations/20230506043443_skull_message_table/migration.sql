-- CreateTable
CREATE TABLE "SkullMessage" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkullMessage_pkey" PRIMARY KEY ("id")
);
