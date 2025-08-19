-- CreateTable
CREATE TABLE "public"."Insult" (
    "id" TEXT NOT NULL,
    "author" VARCHAR(50) NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Insult_content_key" ON "public"."Insult"("content");
