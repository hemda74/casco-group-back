import { UserButton, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import StoreSwitcher from '@/components/store-switcher';
import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import prismadb from '@/lib/prismadb';

const Navbar = async () => {
	const { } = auth();



	const stores = await prismadb.store.findMany({

	});

	return (
		<div className="">
			<div className="flex h-24 flex-col items-stert px-5">
				<StoreSwitcher items={stores} />
				<MainNav className="mx-5" />
				<div className=" flex flex-start space-x-4 mt-12">
					<ThemeToggle />
					<div className="mt-1">
						<UserButton afterSignOutUrl="/" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
