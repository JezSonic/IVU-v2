import Sidebar from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function UI({children}: Readonly<{children: React.ReactNode; }>) {
	const path = usePathname();

	return (
		<div className="min-h-screen flex">
			{!path.includes("auth") && <Sidebar/>}
			<main className="flex-1 pt-14 md:pt-0">
				{children}
			</main>
		</div>
	)
}