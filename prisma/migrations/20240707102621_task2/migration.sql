-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "OrganisationsOnUsers" (
    "userId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,

    CONSTRAINT "OrganisationsOnUsers_pkey" PRIMARY KEY ("userId","organisationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OrganisationsOnUsers" ADD CONSTRAINT "OrganisationsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationsOnUsers" ADD CONSTRAINT "OrganisationsOnUsers_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
