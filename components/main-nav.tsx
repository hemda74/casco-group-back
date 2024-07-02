'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();
	const params = useParams();

	const routes = [
		{
			href: `/${params.storeId}/billboards`,
			label: 'Main Categories',
			active: pathname === `/${params.storeId}/billboards`,
		},
		{
			href: `/${params.storeId}/courses-categories`,
			label: 'Courses Categories',
			active:
				pathname ===
				`/${params.storeId}/courses-categories`,
		},
		{
			href: `/${params.storeId}/courses`,
			label: 'Courses',
			active: pathname === `/${params.storeId}/courses`,
		},
		{
			href: `/${params.storeId}/services-categories`,
			label: 'Services Categories',
			active:
				pathname ===
				`/${params.storeId}/services-categories`,
		},
		{
			href: `/${params.storeId}/services`,
			label: 'Services',
			active: pathname === `/${params.storeId}/services`,
		},
		{
			href: `/${params.storeId}/industries-categories`,
			label: 'Industries Categories',
			active:
				pathname ===
				`/${params.storeId}/industries-categories`,
		},
		{
			href: `/${params.storeId}/industries`,
			label: 'Industries',
			active: pathname === `/${params.storeId}/industries`,
		},
		{
			href: `/${params.storeId}/case-studies`,
			label: 'Case Studies',
			active: pathname === `/${params.storeId}/case-studies`,
		},
		{
			href: `/${params.storeId}/news-categories`,
			label: 'News & Events categories',
			active: pathname === `/${params.storeId}/news-categories`,
		},
		{
			href: `/${params.storeId}/news`,
			label: 'News',
			active: pathname === `/${params.storeId}/news`,
		},
		{
			href: `/${params.storeId}/events`,
			label: 'Events',
			active: pathname === `/${params.storeId}/events`,
		},
		{
			href: `/${params.storeId}/teams`,
			label: 'Teams',
			active: pathname === `/${params.storeId}/teams`,
		},
		{
			href: `/${params.storeId}/team-members`,
			label: 'Team Members',
			active: pathname === `/${params.storeId}/team-members`,
		},
		{
			href: `/${params.storeId}/insidersviews`,
			label: 'Insiders Views',
			active: pathname === `/${params.storeId}/insidersviews`,
		},
		{
			href: `/${params.storeId}/testimonials`,
			label: 'Testimonials',
			active: pathname === `/${params.storeId}/testimonials`,
		},
		{
			href: `/${params.storeId}/recognitions`,
			label: 'Recognitions',
			active: pathname === `/${params.storeId}/recognitions`,
		},
		{
			href: `/${params.storeId}/course-type`,
			label: 'course-type',
			active: pathname === `/${params.storeId}/course-type`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
		},
	];

	return (
		<div
			className={cn(
				'flex ml-0 mt-5 items-start flex-col p-0 space-y-4 space-x-0 ',
				className
			)}
			{...props}
		>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm items-start font-medium transition-colors hover:text-primary',
						route.active
							? 'text-black dark:text-white'
							: 'text-muted-foreground'
					)}
				>
					{route.label}
				</Link>
			))}
		</div>
	);
}
