/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `SkullMessage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AocChallenge" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "assigned" TIMESTAMP(3) NOT NULL,
    "released" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AocChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AocChallengeSubmission" (
    "id" SERIAL NOT NULL,
    "submission" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted" BOOLEAN NOT NULL,
    "feedback" TEXT,
    "mem_usage" INTEGER,
    "runtime" INTEGER,
    "userId" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,

    CONSTRAINT "AocChallengeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AocChallenge_id_key" ON "AocChallenge"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AocChallengeSubmission_id_key" ON "AocChallengeSubmission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SkullMessage_id_key" ON "SkullMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "AocChallengeSubmission" ADD CONSTRAINT "AocChallengeSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AocChallengeSubmission" ADD CONSTRAINT "AocChallengeSubmission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "AocChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
