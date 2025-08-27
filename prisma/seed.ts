import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('Starting database seeding...');

	try {
		// Create Course Categories
		const courseCategories = await Promise.all([
			prisma.coursesCategory.create({
				data: {
					name: 'Business Management',
					name_ar: 'إدارة الأعمال',
				},
			}),
			prisma.coursesCategory.create({
				data: {
					name: 'Technology & IT',
					name_ar: 'التكنولوجيا وتقنية المعلومات',
				},
			}),
			prisma.coursesCategory.create({
				data: {
					name: 'Finance & Accounting',
					name_ar: 'المالية والمحاسبة',
				},
			}),
		]);
		console.log(' Course categories created');

		// Create Course Types
		const courseTypes = await Promise.all([
			prisma.courseType.create({
				data: {
					name: 'Professional Certificate',
					name_ar: 'شهادة مهنية',
				},
			}),
			prisma.courseType.create({
				data: {
					name: 'Executive Program',
					name_ar: 'برنامج تنفيذي',
				},
			}),
			prisma.courseType.create({
				data: {
					name: 'Intensive Workshop',
					name_ar: 'ورشة عمل مكثفة',
				},
			}),
		]);
		console.log(' Course types created');

		// Create News Categories
		const newsCategories = await Promise.all([
			prisma.newsCategory.create({
				data: {
					name: 'Company News',
					name_ar: 'أخبار الشركة',
				},
			}),
			prisma.newsCategory.create({
				data: {
					name: 'Industry Updates',
					name_ar: 'تحديثات الصناعة',
				},
			}),
			prisma.newsCategory.create({
				data: {
					name: 'Training Announcements',
					name_ar: 'إعلانات التدريب',
				},
			}),
		]);
		console.log(' News categories created');

		// Create Industries
		const industries = await Promise.all([
			prisma.industry.create({
				data: {
					name: 'Banking & Finance',
					name_ar: 'البنوك والمالية',
				},
			}),
			prisma.industry.create({
				data: {
					name: 'Healthcare',
					name_ar: 'الرعاية الصحية',
				},
			}),
			prisma.industry.create({
				data: {
					name: 'Manufacturing',
					name_ar: 'التصنيع',
				},
			}),
		]);
		console.log(' Industries created');

		// Create Services
		const services = await Promise.all([
			prisma.service.create({
				data: {
					name: 'Strategic Consulting',
					name_ar: 'الاستشارات الاستراتيجية',
				},
			}),
			prisma.service.create({
				data: {
					name: 'Digital Transformation',
					name_ar: 'التحول الرقمي',
				},
			}),
			prisma.service.create({
				data: {
					name: 'Leadership Development',
					name_ar: 'تطوير القيادة',
				},
			}),
		]);
		console.log(' Services created');

		// Create Teams
		const teams = await Promise.all([
			prisma.team.create({
				data: {
					name: 'Executive Team',
					name_ar: 'الفريق التنفيذي',
					address: '123 Business District, Cairo, Egypt',
					address_ar: '123 الحي التجاري، القاهرة، مصر',
					linkedin: 'https://linkedin.com/company/casco-executive',
					phone: '+20-2-1234-5678',
					imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
				},
			}),
			prisma.team.create({
				data: {
					name: 'Training Team',
					name_ar: 'فريق التدريب',
					address: '456 Training Center, Cairo, Egypt',
					address_ar: '456 مركز التدريب، القاهرة، مصر',
					linkedin: 'https://linkedin.com/company/casco-training',
					phone: '+20-2-1234-5679',
					imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
				},
			}),
		]);
		console.log(' Teams created');

		// Create Courses with related data
		const course1 = await prisma.course.create({
			data: {
				categoryId: courseCategories[0].id,
				coursetypeId: courseTypes[0].id,
				c_title: 'Advanced Project Management',
				c_title_ar: 'إدارة المشاريع المتقدمة',
				price_egp: 15000,
				price_ksa: 4000,
				price_uae: 4500,
				price_usd: 1200,
				c_short_intro_en:
					'Master the art of project management with advanced techniques and methodologies.',
				c_short_intro_ar:
					'أتقن فن إدارة المشاريع بالتقنيات والمنهجيات المتقدمة.',
				c_duration_en: '5 Days Intensive Training',
				c_duration_ar: 'تدريب مكثف لمدة 5 أيام',
				c_in_house_en:
					'Available for in-house training',
				c_in_house_ar: 'متاح للتدريب الداخلي',
				c_delv_and_leaders_en:
					'Delivered by certified PMP instructors',
				c_delv_and_leaders_ar:
					'يقدمه مدربون معتمدون في PMP',
				imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
				c_intro_en: {
					create: [
						{
							text: 'This comprehensive course covers advanced project management principles and practices.',
						},
						{
							text: 'Participants will learn to handle complex projects with confidence and efficiency.',
						},
						{
							text: 'The course includes real-world case studies and practical exercises.',
						},
					],
				},
				c_intro_ar: {
					create: [
						{
							text: 'تغطي هذه الدورة الشاملة مبادئ وممارسات إدارة المشاريع المتقدمة.',
						},
						{
							text: 'سيتعلم المشاركون التعامل مع المشاريع المعقدة بثقة وكفاءة.',
						},
						{
							text: 'تتضمن الدورة دراسات حالة من العالم الحقيقي وتمارين عملية.',
						},
					],
				},
				c_who_should_en: {
					create: [
						{
							text: 'Project managers with 2+ years of experience',
						},
						{
							text: 'Team leaders looking to advance their skills',
						},
						{
							text: 'Senior executives involved in project oversight',
						},
					],
				},
				c_who_should_ar: {
					create: [
						{
							text: 'مديري المشاريع مع خبرة تزيد عن سنتين',
						},
						{
							text: 'قادة الفرق الذين يسعون لتطوير مهاراتهم',
						},
						{
							text: 'المديرين التنفيذيين المشاركين في إشراف المشاريع',
						},
					],
				},
				c_objective_en: {
					create: [
						{
							text: 'Master advanced project planning and execution techniques',
						},
						{
							text: 'Develop risk management and mitigation strategies',
						},
						{
							text: 'Learn stakeholder management and communication skills',
						},
					],
				},
				c_objective_ar: {
					create: [
						{
							text: 'إتقان تقنيات التخطيط والتنفيذ المتقدمة للمشاريع',
						},
						{
							text: 'تطوير استراتيجيات إدارة المخاطر والتخفيف منها',
						},
						{
							text: 'تعلم مهارات إدارة أصحاب المصلحة والتواصل',
						},
					],
				},
				c_content_en: {
					create: [
						{
							text: 'Module 1: Advanced Project Planning Methodologies',
						},
						{
							text: 'Module 2: Risk Assessment and Management',
						},
						{
							text: 'Module 3: Resource Optimization Strategies',
						},
						{
							text: 'Module 4: Quality Management Systems',
						},
					],
				},
				c_content_ar: {
					create: [
						{
							text: 'الوحدة 1: منهجيات التخطيط المتقدمة للمشاريع',
						},
						{
							text: 'الوحدة 2: تقييم وإدارة المخاطر',
						},
						{
							text: 'الوحدة 3: استراتيجيات تحسين الموارد',
						},
						{
							text: 'الوحدة 4: أنظمة إدارة الجودة',
						},
					],
				},
				c_benefit_en: {
					create: [
						{
							text: 'Increase project success rate by 40%',
						},
						{
							text: 'Reduce project costs through efficient resource management',
						},
						{
							text: 'Enhance team productivity and collaboration',
						},
					],
				},
				c_benefit_ar: {
					create: [
						{
							text: 'زيادة معدل نجاح المشاريع بنسبة 40%',
						},
						{
							text: 'تقليل تكاليف المشاريع من خلال الإدارة الفعالة للموارد',
						},
						{
							text: 'تعزيز إنتاجية الفريق والتعاون',
						},
					],
				},
				c_content2_en: {
					create: [
						{
							text: 'Day 1-2: Foundation and Planning',
						},
						{
							text: 'Day 3-4: Execution and Monitoring',
						},
						{
							text: 'Day 5: Closing and Lessons Learned',
						},
					],
				},
				c_content2_ar: {
					create: [
						{
							text: 'اليوم 1-2: الأساسيات والتخطيط',
						},
						{
							text: 'اليوم 3-4: التنفيذ والمراقبة',
						},
						{
							text: 'اليوم 5: الإغلاق والدروس المستفادة',
						},
					],
				},
				c_date_en: {
					create: [
						{ text: 'March 15-19, 2025' },
						{ text: 'June 10-14, 2025' },
						{
							text: 'September 20-24, 2025',
						},
					],
				},
				c_date_ar: {
					create: [
						{ text: '15-19 مارس 2025' },
						{ text: '10-14 يونيو 2025' },
						{ text: '20-24 سبتمبر 2025' },
					],
				},
			},
		});

		const course2 = await prisma.course.create({
			data: {
				categoryId: courseCategories[1].id,
				coursetypeId: courseTypes[1].id,
				c_title: 'Digital Transformation Leadership',
				c_title_ar: 'قيادة التحول الرقمي',
				price_egp: 20000,
				price_ksa: 5500,
				price_uae: 6000,
				price_usd: 1600,
				c_short_intro_en:
					'Lead your organization through successful digital transformation initiatives.',
				c_short_intro_ar:
					'قد مؤسستك من خلال مبادرات التحول الرقمي الناجحة.',
				c_duration_en: '3 Days Executive Program',
				c_duration_ar: 'برنامج تنفيذي لمدة 3 أيام',
				c_in_house_en:
					'Customizable for enterprise clients',
				c_in_house_ar: 'قابل للتخصيص لعملاء المؤسسات',
				c_delv_and_leaders_en:
					'Led by digital transformation experts',
				c_delv_and_leaders_ar:
					'يقوده خبراء التحول الرقمي',
				imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
				c_intro_en: {
					create: [
						{
							text: "Navigate the complexities of digital transformation in today's business environment.",
						},
						{
							text: 'Learn proven strategies for implementing digital solutions across your organization.',
						},
					],
				},
				c_intro_ar: {
					create: [
						{
							text: 'تنقل في تعقيدات التحول الرقمي في بيئة الأعمال اليوم.',
						},
						{
							text: 'تعلم الاستراتيجيات المجربة لتنفيذ الحلول الرقمية عبر مؤسستك.',
						},
					],
				},
				c_who_should_en: {
					create: [
						{
							text: 'C-level executives and senior managers',
						},
						{
							text: 'IT directors and digital transformation leads',
						},
					],
				},
				c_who_should_ar: {
					create: [
						{
							text: 'المديرين التنفيذيين والمديرين الأقدم',
						},
						{
							text: 'مديري تقنية المعلومات وقادة التحول الرقمي',
						},
					],
				},
				c_objective_en: {
					create: [
						{
							text: 'Develop a comprehensive digital transformation strategy',
						},
						{
							text: 'Build change management capabilities',
						},
					],
				},
				c_objective_ar: {
					create: [
						{
							text: 'تطوير استراتيجية شاملة للتحول الرقمي',
						},
						{
							text: 'بناء قدرات إدارة التغيير',
						},
					],
				},
				c_content_en: {
					create: [
						{
							text: 'Digital Strategy Development',
						},
						{
							text: 'Technology Implementation',
						},
					],
				},
				c_content_ar: {
					create: [
						{
							text: 'تطوير الاستراتيجية الرقمية',
						},
						{ text: 'تنفيذ التكنولوجيا' },
					],
				},
				c_benefit_en: {
					create: [
						{
							text: 'Accelerate digital adoption across your organization',
						},
						{
							text: 'Improve operational efficiency by 30%',
						},
					],
				},
				c_benefit_ar: {
					create: [
						{
							text: 'تسريع اعتماد التقنيات الرقمية عبر مؤسستك',
						},
						{
							text: 'تحسين الكفاءة التشغيلية بنسبة 30%',
						},
					],
				},
				c_content2_en: {
					create: [
						{
							text: 'Day 1: Strategy and Planning',
						},
						{
							text: 'Day 2: Implementation and Technology',
						},
						{
							text: 'Day 3: Change Management and Sustainability',
						},
					],
				},
				c_content2_ar: {
					create: [
						{
							text: 'اليوم 1: الاستراتيجية والتخطيط',
						},
						{
							text: 'اليوم 2: التنفيذ والتكنولوجيا',
						},
						{
							text: 'اليوم 3: إدارة التغيير والاستدامة',
						},
					],
				},
				c_date_en: {
					create: [
						{ text: 'April 22-24, 2025' },
						{ text: 'July 15-17, 2025' },
					],
				},
				c_date_ar: {
					create: [
						{ text: '22-24 أبريل 2025' },
						{ text: '15-17 يوليو 2025' },
					],
				},
			},
		});
		console.log(' Courses created with related data');

		// Create Team Members
		await Promise.all([
			prisma.teamMember.create({
				data: {
					teamId: teams[0].id,
					name: 'Ahmed Hassan',
					name_ar: 'أحمد حسن',
					title: 'Chief Executive Officer',
					title_ar: 'الرئيس التنفيذي',
					brief_1: 'Over 15 years of experience in strategic consulting',
					brief_2: 'Led digital transformation initiatives for Fortune 500 companies',
					brief_3: 'MBA from Cairo University, PMP certified',
					brief_1_ar: 'أكثر من 15 عامًا من الخبرة في الاستشارات الاستراتيجية',
					brief_2_ar: 'قاد مبادرات التحول الرقمي لشركات فورتشن 500',
					brief_3_ar: 'ماجستير إدارة أعمال من جامعة القاهرة، معتمد PMP',
					imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
				},
			}),
			prisma.teamMember.create({
				data: {
					teamId: teams[1].id,
					name: 'Fatima Al-Zahra',
					name_ar: 'فاطمة الزهراء',
					title: 'Head of Training',
					title_ar: 'رئيس التدريب',
					brief_1: 'Certified master trainer with international experience',
					brief_2: 'Specialized in leadership development and corporate training',
					brief_3: 'PhD in Organizational Psychology',
					brief_1_ar: 'مدربة رئيسية معتمدة مع خبرة دولية',
					brief_2_ar: 'متخصصة في تطوير القيادة والتدريب المؤسسي',
					brief_3_ar: 'دكتوراه في علم النفس التنظيمي',
					imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b820?w=400',
				},
			}),
		]);
		console.log(' Team members created');

		// Create Expert Services
		await Promise.all([
			prisma.expertService.create({
				data: {
					serviceId: services[0].id,
					expert_name: 'Dr. Mohamed Elkady',
					expert_name_ar: 'د. محمد القاضي',
					expert_title:
						'Senior Strategy Consultant',
					expert_title_ar: 'مستشار استراتيجي أول',
					expert_mail: 'mohamed.elkady@casco.com',
					expert_phone: '+20-2-1234-5680',
					imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
				},
			}),
			prisma.expertService.create({
				data: {
					serviceId: services[1].id,
					expert_name: 'Sarah Johnson',
					expert_name_ar: 'سارة جونسون',
					expert_title:
						'Digital Transformation Lead',
					expert_title_ar: 'قائد التحول الرقمي',
					expert_mail: 'sarah.johnson@casco.com',
					expert_phone: '+20-2-1234-5681',
					imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
				},
			}),
		]);
		console.log(' Expert services created');

		// Create Service Descriptions
		await Promise.all([
			prisma.serviceDesc.create({
				data: {
					serviceId: services[0].id,
					title: 'Comprehensive Strategic Planning',
					desc_1: 'We help organizations develop long-term strategic plans that align with their vision and market opportunities.',
					desc_2: 'Our approach combines industry best practices with innovative thinking to create actionable roadmaps for success.',
				},
			}),
			prisma.serviceDescAr.create({
				data: {
					serviceId: services[0].id,
					desc_1_ar: 'نساعد المؤسسات على تطوير خطط استراتيجية طويلة المدى تتماشى مع رؤيتها وفرص السوق.',
					desc_2_ar: 'يجمع نهجنا بين أفضل الممارسات الصناعية والتفكير المبتكر لإنشاء خرائط طريق قابلة للتنفيذ للنجاح.',
				},
			}),
		]);
		console.log(' Service descriptions created');

		// Create Industry Details
		const industryDetails = await prisma.industryDetailes.create({
			data: {
				industryId: industries[0].id,
				title: 'Banking Digital Innovation',
				title_ar: 'الابتكار الرقمي في البنوك',
				industryDetailesPoint: {
					create: [
						{
							text: 'Mobile banking solutions development',
						},
						{
							text: 'AI-powered customer service implementation',
						},
						{
							text: 'Blockchain technology integration',
						},
					],
				},
				industryDetailesPointAr: {
					create: [
						{
							text: 'تطوير حلول البنكية المحمولة',
						},
						{
							text: 'تنفيذ خدمة العملاء المدعومة بالذكاء الاصطناعي',
						},
						{
							text: 'تكامل تقنية البلوك تشين',
						},
					],
				},
			},
		});
		console.log(' Industry details created');

		// Create Case Studies
		const caseStudy = await prisma.caseStudy.create({
			data: {
				industryId: industries[0].id,
				title: 'Digital Banking Transformation',
				title_ar: 'تحول البنكية الرقمية',
				sub_title: 'Leading Regional Bank Modernization',
				sub_title_ar: 'تحديث البنك الإقليمي الرائد',
				paragraph_1:
					'We partnered with a leading regional bank to transform their traditional banking operations into a fully digital ecosystem.',
				paragraph_1_ar:
					'شاركنا مع بنك إقليمي رائد لتحويل عملياته المصرفية التقليدية إلى نظام بيئي رقمي بالكامل.',
				paragraph_2:
					'The transformation resulted in 60% improvement in customer satisfaction and 40% reduction in operational costs.',
				paragraph_2_ar:
					'أدى التحول إلى تحسن بنسبة 60% في رضا العملاء وانخفاض بنسبة 40% في التكاليف التشغيلية.',
				imageUrl: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800',
				caseStudyPoint: {
					create: [
						{
							p1: 'Implemented mobile-first banking platform',
						},
						{
							p1: 'Integrated AI chatbot for customer support',
						},
						{
							p1: 'Developed real-time fraud detection system',
						},
					],
				},
				caseStudyPointAr: {
					create: [
						{
							p1: 'تنفيذ منصة مصرفية تعطي الأولوية للهاتف المحمول',
						},
						{
							p1: 'دمج روبوت المحادثة بالذكاء الاصطناعي لدعم العملاء',
						},
						{
							p1: 'تطوير نظام الكشف عن الاحتيال في الوقت الفعلي',
						},
					],
				},
			},
		});
		console.log(' Case study created');

		// Create News
		const news = await prisma.news.create({
			data: {
				categoryId: newsCategories[0].id,
				title: 'CASCO Launches New Digital Leadership Program',
				title_ar: 'كاسكو تطلق برنامج القيادة الرقمية الجديد',
				imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
				date_of_news: 'February 15, 2025',
				date_of_news_ar: '15 فبراير 2025',
				paragraph_news: {
					create: [
						{
							text: 'CASCO Training Center proudly announces the launch of its innovative Digital Leadership Program, designed to equip executives with the skills needed to navigate the digital age.',
						},
						{
							text: 'The program features interactive workshops, case studies from leading global companies, and hands-on experience with cutting-edge digital tools.',
						},
						{
							text: 'Registration is now open for the first cohort starting in March 2025.',
						},
					],
				},
				paragraph_news_ar: {
					create: [
						{
							text: 'يعلن مركز كاسكو للتدريب بفخر عن إطلاق برنامج القيادة الرقمية المبتكر، المصمم لتزويد المديرين التنفيذيين بالمهارات اللازمة للتنقل في العصر الرقمي.',
						},
						{
							text: 'يتميز البرنامج بورش عمل تفاعلية ودراسات حالة من الشركات العالمية الرائدة وخبرة عملية مع أدوات رقمية متطورة.',
						},
						{
							text: 'التسجيل مفتوح الآن للمجموعة الأولى التي تبدأ في مارس 2025.',
						},
					],
				},
			},
		});
		console.log(' News created');

		// Create Events
		const event = await prisma.event.create({
			data: {
				categoryId: newsCategories[2].id,
				title: 'Annual Leadership Summit 2025',
				title_ar: 'قمة القيادة السنوية 2025',
				imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
				date_of_event: 'May 20-21, 2025',
				date_of_event_ar: '20-21 مايو 2025',
				paragraph_event: {
					create: [
						{
							text: 'Join us for the most anticipated leadership event of the year, featuring renowned speakers from around the globe.',
						},
						{
							text: 'Two days of intensive sessions covering the latest trends in leadership, innovation, and organizational transformation.',
						},
						{
							text: 'Network with industry leaders and gain insights that will shape your leadership journey.',
						},
					],
				},
				paragraph_event_ar: {
					create: [
						{
							text: 'انضم إلينا في أكثر أحداث القيادة المنتظرة للعام، مع متحدثين مشهورين من جميع أنحاء العالم.',
						},
						{
							text: 'يومان من الجلسات المكثفة تغطي أحدث الاتجاهات في القيادة والابتكار والتحول التنظيمي.',
						},
						{
							text: 'تواصل مع قادة الصناعة واحصل على رؤى ستشكل رحلة قيادتك.',
						},
					],
				},
			},
		});
		console.log(' Event created');

		// Create Testimonials
		await Promise.all([
			prisma.testimonials.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
					text: "CASCO's training programs have transformed our organization. The quality of instruction and practical approach made a real difference in our team's performance.",
					name: 'Omar Al-Rashid',
					title: 'CEO, TechCorp MENA',
					text_ar: 'لقد غيرت برامج التدريب في كاسكو مؤسستنا. جودة التعليم والنهج العملي أحدث فرقًا حقيقيًا في أداء فريقنا.',
					name_ar: 'عمر الراشد',
					title_ar: 'الرئيس التنفيذي، تك كورب الشرق الأوسط وشمال أفريقيا',
				},
			}),
			prisma.testimonials.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b820?w=400',
					text: 'The digital transformation course exceeded my expectations. The instructors were knowledgeable and the content was immediately applicable to our business challenges.',
					name: 'Layla Mohamed',
					title: 'CTO, Innovation Bank',
					text_ar: 'تجاوزت دورة التحول الرقمي توقعاتي. كان المدربون متمكنين والمحتوى قابل للتطبيق فورًا على تحديات أعمالنا.',
					name_ar: 'ليلى محمد',
					title_ar: 'مدير التكنولوجيا، بنك الابتكار',
				},
			}),
			prisma.testimonials.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
					text: 'Outstanding training experience! The project management course helped me deliver our latest initiative 30% faster than planned.',
					name: 'Khalid Mansour',
					title: 'Project Director, Global Solutions',
					text_ar: 'تجربة تدريبية متميزة! ساعدتني دورة إدارة المشاريع في تسليم مبادرتنا الأخيرة أسرع بنسبة 30% من المخطط له.',
					name_ar: 'خالد منصور',
					title_ar: 'مدير المشاريع، الحلول العالمية',
				},
			}),
		]);
		console.log(' Testimonials created');

		// Create Insiders View
		await Promise.all([
			prisma.insidersView.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
					text: 'Behind every successful transformation is a team that believes in continuous learning and innovation. At CASCO, we foster this culture every day.',
					name: 'Dr. Amina Farouk',
					title: 'Chief Learning Officer',
					text_ar: 'وراء كل تحول ناجح فريق يؤمن بالتعلم المستمر والابتكار. في كاسكو، نعزز هذه الثقافة كل يوم.',
					name_ar: 'د. أمينة فاروق',
					title_ar: 'مدير التعلم الأول',
				},
			}),
			prisma.insidersView.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
					text: 'The future of business lies in the intersection of technology and human potential. Our programs are designed to unlock both.',
					name: 'Hassan Al-Mahmoud',
					title: 'Innovation Director',
					text_ar: 'مستقبل الأعمال يكمن في تقاطع التكنولوجيا والإمكانات البشرية. برامجنا مصممة لإطلاق كليهما.',
					name_ar: 'حسان المحمود',
					title_ar: 'مدير الابتكار',
				},
			}),
		]);
		console.log(' Insiders view created');

		// Create Recognition
		await Promise.all([
			prisma.recognition.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?w=400',
					title: 'Best Training Provider 2024',
					title_ar: 'أفضل مقدم تدريب 2024',
				},
			}),
			prisma.recognition.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400',
					title: 'Excellence in Digital Innovation',
					title_ar: 'التميز في الابتكار الرقمي',
				},
			}),
			prisma.recognition.create({
				data: {
					imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400',
					title: 'Regional Leadership Development Award',
					title_ar: 'جائزة تطوير القيادة الإقليمية',
				},
			}),
		]);
		console.log(' Recognition created');

		// Create Expert Industry
		await Promise.all([
			prisma.expertIndustry.create({
				data: {
					industryId: industries[0].id,
					expert_name: 'Yasmin Abdel-Rahman',
					expert_name_ar: 'ياسمين عبد الرحمن',
					expert_title:
						'Banking Technology Specialist',
					expert_title_ar:
						'أخصائي تكنولوجيا البنوك',
					expert_mail: 'yasmin.abdel@casco.com',
					expert_phone: '+20-2-1234-5682',
					imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
				},
			}),
			prisma.expertIndustry.create({
				data: {
					industryId: industries[1].id,
					expert_name: 'Dr. Tamer Hosny',
					expert_name_ar: 'د. تامر حسني',
					expert_title:
						'Healthcare Innovation Consultant',
					expert_title_ar:
						'مستشار ابتكار الرعاية الصحية',
					expert_mail: 'tamer.hosny@casco.com',
					expert_phone: '+20-2-1234-5683',
					imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
				},
			}),
		]);
		console.log(' Expert industry created');

		// Create Event2 and Event3 (additional event types)
		const event2 = await prisma.event2.create({
			data: {
				categoryId: newsCategories[1].id,
				title: 'Technology Innovation Showcase',
				title_ar: 'معرض ابتكار التكنولوجيا',
				imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
				date_of_event: 'June 15, 2025',
				date_of_event_ar: '15 يونيو 2025',
				paragraph_event2: {
					create: [
						{
							text: 'Discover the latest technological innovations shaping the future of business across industries.',
						},
						{
							text: 'Interactive demonstrations and hands-on experience with emerging technologies.',
						},
					],
				},
				paragraph_event_ar2: {
					create: [
						{
							text: 'اكتشف أحدث الابتكارات التكنولوجية التي تشكل مستقبل الأعمال عبر الصناعات.',
						},
						{
							text: 'عروض تفاعلية وخبرة عملية مع التقنيات الناشئة.',
						},
					],
				},
			},
		});

		const event3 = await prisma.event3.create({
			data: {
				categoryId: newsCategories[2].id,
				title: 'Strategic Planning Workshop Series',
				title_ar: 'سلسلة ورش التخطيط الاستراتيجي',
				imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
				date_of_event: 'August 10-12, 2025',
				date_of_event_ar: '10-12 أغسطس 2025',
				paragraph_event3: {
					create: [
						{
							text: 'A comprehensive three-day workshop series focusing on strategic planning methodologies.',
						},
						{
							text: 'Designed for senior executives and strategic planners.',
						},
						{
							text: 'Limited to 25 participants for maximum interaction and personalized guidance.',
						},
					],
				},
				paragraph_event_ar3: {
					create: [
						{
							text: 'سلسلة ورش عمل شاملة لثلاثة أيام تركز على منهجيات التخطيط الاستراتيجي.',
						},
						{
							text: 'مصممة للمديرين التنفيذيين الأقدم ومخططي الاستراتيجية.',
						},
						{
							text: 'محدودة بـ 25 مشاركًا للحصول على أقصى قدر من التفاعل والتوجيه الشخصي.',
						},
					],
				},
			},
		});
		console.log(' Additional events (Event2, Event3) created');

		// Create Industry Details 2
		const industryDetails2 = await prisma.industryDetailes2.create({
			data: {
				industryId: industries[1].id,
				title: 'Healthcare Digital Solutions',
				title_ar: 'حلول الرعاية الصحية الرقمية',
				industryDetailesPoint2: {
					create: [
						{
							text: 'Electronic Health Records (EHR) implementation',
						},
						{
							text: 'Telemedicine platform development',
						},
						{
							text: 'AI-powered diagnostic tools integration',
						},
						{
							text: 'Patient data security and compliance',
						},
					],
				},
				industryDetailesPointAr2: {
					create: [
						{
							text: 'تنفيذ السجلات الصحية الإلكترونية',
						},
						{
							text: 'تطوير منصة الطب عن بُعد',
						},
						{
							text: 'دمج أدوات التشخيص المدعومة بالذكاء الاصطناعي',
						},
						{
							text: 'أمان بيانات المرضى والامتثال',
						},
					],
				},
			},
		});
		console.log(' Industry details 2 created');

		console.log('🎉 Database seeding completed successfully!');
		console.log(`
📊 Summary of created records:
- 3 Course Categories
- 3 Course Types  
- 3 News Categories
- 3 Industries
- 3 Services
- 2 Teams
- 2 Courses (with all related content)
- 2 Team Members
- 2 Expert Services
- 2 Service Descriptions
- 1 Industry Details (with points)
- 1 Case Study (with points)
- 1 News (with paragraphs)
- 1 Event (with paragraphs)
- 3 Testimonials
- 2 Insiders View
- 3 Recognition
- 2 Expert Industry
- 1 Event2 (with paragraphs)
- 1 Event3 (with paragraphs)
- 1 Industry Details 2 (with points)
    `);
	} catch (error) {
		console.error('❌ Error during seeding:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((e) => {
	console.error('❌ Seeding failed:', e);
	process.exit(1);
});
