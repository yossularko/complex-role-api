-- CreateTable
CREATE TABLE "TemplateMenu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateAccsMenu" (
    "id" SERIAL NOT NULL,
    "actions" TEXT[],
    "menuSlug" TEXT,
    "tempId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateAccsMenu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateAccsMenu" ADD CONSTRAINT "TemplateAccsMenu_menuSlug_fkey" FOREIGN KEY ("menuSlug") REFERENCES "Menu"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateAccsMenu" ADD CONSTRAINT "TemplateAccsMenu_tempId_fkey" FOREIGN KEY ("tempId") REFERENCES "TemplateMenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
