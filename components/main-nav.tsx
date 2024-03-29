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
		// {
		// 	href: `/${params.storeId}`,
		// 	label: 'Overview',
		// 	active: pathname === `/${params.storeId}`,
		// },
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
			href: `/${params.storeId}/services-categories`,
			label: 'Services Categories',
			active:
				pathname ===
				`/${params.storeId}/services-categories`,
		},

		// {
		// 	href: `/${params.storeId}/sizes`,
		// 	label: 'Sizes',
		// 	active: pathname === `/${params.storeId}/sizes`,
		// },
		// {
		// 	href: `/${params.storeId}/colors`,
		// 	label: 'Colors',
		// 	active: pathname === `/${params.storeId}/colors`,
		// },
		{
			href: `/${params.storeId}/courses`,
			label: 'Courses',
			active: pathname === `/${params.storeId}/courses`,
		},
		{
			href: `/${params.storeId}/services`,
			label: 'Services',
			active: pathname === `/${params.storeId}/services`,
		},
		// {
		// 	href: `/${params.storeId}/orders`,
		// 	label: 'Orders',
		// 	active: pathname === `/${params.storeId}/orders`,
		// },
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
		},
	];

	return (
		<div
			className={cn(
				'flex mt-5 items-start flex-col space-y-4 lg:space-y-6',
				className
			)}
			{...props}
		>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary',
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
