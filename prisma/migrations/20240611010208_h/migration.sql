-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billboard" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "label_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Billboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursesCategory" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "price_egp" DECIMAL(65,30) NOT NULL,
    "price_uae" DECIMAL(65,30) NOT NULL,
    "price_ksa" DECIMAL(65,30) NOT NULL,
    "price_usd" DECIMAL(65,30) NOT NULL,
    "intro" TEXT NOT NULL,
    "intro_ar" TEXT NOT NULL,
    "short_intro" TEXT NOT NULL,
    "short_intro_ar" TEXT NOT NULL,
    "duaration" TEXT NOT NULL,
    "duration_ar" TEXT NOT NULL,
    "who_sh_att" TEXT NOT NULL,
    "who_sh_att_ar" TEXT NOT NULL,
    "c_obje" TEXT NOT NULL,
    "c_obje_ar" TEXT NOT NULL,
    "c_obje_list" TEXT NOT NULL,
    "c_obje_list_ar" TEXT NOT NULL,
    "c_content" TEXT NOT NULL,
    "c_content_ar" TEXT NOT NULL,
    "wh_we_bnfi" TEXT NOT NULL,
    "wh_we_bnfi_ar" TEXT NOT NULL,
    "c_in_house" TEXT NOT NULL,
    "c_in_house_ar" TEXT NOT NULL,
    "delv_and_leaders" TEXT NOT NULL,
    "delv_and_leaders_ar" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "certification_ar" TEXT NOT NULL,
    "course_type" TEXT NOT NULL,
    "course_type_ar" TEXT NOT NULL,
    "course_date" TEXT NOT NULL,
    "course_date_ar" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryCategory" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesCategory" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "brief_1" TEXT NOT NULL,
    "brief_2" TEXT NOT NULL,
    "brief_3" TEXT NOT NULL,
    "brief_1_ar" TEXT NOT NULL,
    "brief_2_ar" TEXT NOT NULL,
    "brief_3_ar" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expert" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "bio_ar" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDesc" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc_1" TEXT NOT NULL,
    "desc_2" TEXT NOT NULL,

    CONSTRAINT "ServiceDesc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDescAr" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "desc_1_ar" TEXT NOT NULL,
    "desc_2_ar" TEXT NOT NULL,

    CONSTRAINT "ServiceDescAr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "title_1" TEXT NOT NULL,
    "explanation_1" TEXT NOT NULL,
    "title_2" TEXT NOT NULL,
    "explanation_2" TEXT NOT NULL,
    "title_3" TEXT NOT NULL,
    "explanation_3" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "sub_title_ar" TEXT NOT NULL,
    "onerole_1" TEXT NOT NULL,
    "onerole_2" TEXT NOT NULL,
    "onerole_3" TEXT NOT NULL,
    "onerole_1_ar" TEXT NOT NULL,
    "onerole_2_ar" TEXT NOT NULL,
    "onerole_3_ar" TEXT NOT NULL,
    "result_1" TEXT NOT NULL,
    "result_2" TEXT NOT NULL,
    "result_3" TEXT NOT NULL,
    "result_4" TEXT NOT NULL,
    "result_1_ar" TEXT NOT NULL,
    "result_2_ar" TEXT NOT NULL,
    "result_3_ar" TEXT NOT NULL,
    "result_4_ar" TEXT NOT NULL,
    "brief_1" TEXT NOT NULL,
    "brief_2" TEXT NOT NULL,
    "brief_1_ar" TEXT NOT NULL,
    "brief_2_ar" TEXT NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image2" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image3" (
    "id" TEXT NOT NULL,
    "casestudyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image4" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image5" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image6" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image7" (
    "id" TEXT NOT NULL,
    "teammemberId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image7_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paragrph_news" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "paragrph_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paragrph_news_ar" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "paragrph_news_ar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsCategory" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_of_news" TEXT NOT NULL,
    "date_of_news_ar" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paragrph_event" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "paragrph_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paragrph_event_ar" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "paragrph_event_ar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_of_event" TEXT NOT NULL,
    "date_of_event_ar" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryDetailes" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "point_ar" TEXT NOT NULL,

    CONSTRAINT "IndustryDetailes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExpertToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Billboard_storeId_idx" ON "Billboard"("storeId");

-- CreateIndex
CREATE INDEX "CoursesCategory_storeId_idx" ON "CoursesCategory"("storeId");

-- CreateIndex
CREATE INDEX "CoursesCategory_billboardId_idx" ON "CoursesCategory"("billboardId");

-- CreateIndex
CREATE INDEX "Course_storeId_idx" ON "Course"("storeId");

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- CreateIndex
CREATE INDEX "Team_storeId_idx" ON "Team"("storeId");

-- CreateIndex
CREATE INDEX "Team_billboardId_idx" ON "Team"("billboardId");

-- CreateIndex
CREATE INDEX "IndustryCategory_storeId_idx" ON "IndustryCategory"("storeId");

-- CreateIndex
CREATE INDEX "IndustryCategory_billboardId_idx" ON "IndustryCategory"("billboardId");

-- CreateIndex
CREATE INDEX "ServicesCategory_storeId_idx" ON "ServicesCategory"("storeId");

-- CreateIndex
CREATE INDEX "ServicesCategory_billboardId_idx" ON "ServicesCategory"("billboardId");

-- CreateIndex
CREATE INDEX "TeamMember_storeId_idx" ON "TeamMember"("storeId");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE INDEX "Service_storeId_idx" ON "Service"("storeId");

-- CreateIndex
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");

-- CreateIndex
CREATE INDEX "Expert_storeId_idx" ON "Expert"("storeId");

-- CreateIndex
CREATE INDEX "Expert_serviceId_idx" ON "Expert"("serviceId");

-- CreateIndex
CREATE INDEX "Expert_industryId_idx" ON "Expert"("industryId");

-- CreateIndex
CREATE INDEX "ServiceDesc_storeId_idx" ON "ServiceDesc"("storeId");

-- CreateIndex
CREATE INDEX "ServiceDesc_serviceId_idx" ON "ServiceDesc"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceDescAr_storeId_idx" ON "ServiceDescAr"("storeId");

-- CreateIndex
CREATE INDEX "ServiceDescAr_serviceId_idx" ON "ServiceDescAr"("serviceId");

-- CreateIndex
CREATE INDEX "Industry_storeId_idx" ON "Industry"("storeId");

-- CreateIndex
CREATE INDEX "Industry_categoryId_idx" ON "Industry"("categoryId");

-- CreateIndex
CREATE INDEX "CaseStudy_storeId_idx" ON "CaseStudy"("storeId");

-- CreateIndex
CREATE INDEX "CaseStudy_industryId_idx" ON "CaseStudy"("industryId");

-- CreateIndex
CREATE INDEX "Image_courseId_idx" ON "Image"("courseId");

-- CreateIndex
CREATE INDEX "Image2_expertId_idx" ON "Image2"("expertId");

-- CreateIndex
CREATE INDEX "Image3_casestudyId_idx" ON "Image3"("casestudyId");

-- CreateIndex
CREATE INDEX "Image4_teamId_idx" ON "Image4"("teamId");

-- CreateIndex
CREATE INDEX "Image5_newsId_idx" ON "Image5"("newsId");

-- CreateIndex
CREATE INDEX "Image6_eventId_idx" ON "Image6"("eventId");

-- CreateIndex
CREATE INDEX "Image7_teammemberId_idx" ON "Image7"("teammemberId");

-- CreateIndex
CREATE INDEX "paragrph_news_newsId_idx" ON "paragrph_news"("newsId");

-- CreateIndex
CREATE INDEX "paragrph_news_ar_newsId_idx" ON "paragrph_news_ar"("newsId");

-- CreateIndex
CREATE INDEX "NewsCategory_storeId_idx" ON "NewsCategory"("storeId");

-- CreateIndex
CREATE INDEX "NewsCategory_billboardId_idx" ON "NewsCategory"("billboardId");

-- CreateIndex
CREATE INDEX "News_storeId_idx" ON "News"("storeId");

-- CreateIndex
CREATE INDEX "News_categoryId_idx" ON "News"("categoryId");

-- CreateIndex
CREATE INDEX "paragrph_event_eventId_idx" ON "paragrph_event"("eventId");

-- CreateIndex
CREATE INDEX "paragrph_event_ar_eventId_idx" ON "paragrph_event_ar"("eventId");

-- CreateIndex
CREATE INDEX "Event_storeId_idx" ON "Event"("storeId");

-- CreateIndex
CREATE INDEX "Event_categoryId_idx" ON "Event"("categoryId");

-- CreateIndex
CREATE INDEX "IndustryDetailes_storeId_idx" ON "IndustryDetailes"("storeId");

-- CreateIndex
CREATE INDEX "IndustryDetailes_industryId_idx" ON "IndustryDetailes"("industryId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExpertToService_AB_unique" ON "_ExpertToService"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpertToService_B_index" ON "_ExpertToService"("B");
