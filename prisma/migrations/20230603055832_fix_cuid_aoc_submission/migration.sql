/*
  Warnings:

  - The primary key for the `AocChallengeSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AocChallengeSubmission" DROP CONSTRAINT "AocChallengeSubmission_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "accepted" DROP NOT NULL,
ADD CONSTRAINT "AocChallengeSubmission_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AocChallengeSubmission_id_seq";
