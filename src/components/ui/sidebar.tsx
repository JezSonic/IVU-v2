"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeButton from "./theme-button";
import { faBell, faCalendarDays, faGear, faHome, faTrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarLink } from "@/lib/data.d";
import { useTranslation } from "next-i18next";
import { env, getLatestVersion } from "@/lib/helpers/app";
import { ThemeMode } from "@/stores/settingsStore";
import { useModal } from "@/components/modal/modal-provider";
import Changelog from "@/components/ui/changelog";

export default function Sidebar() {
	const { t } = useTranslation();
	const { openModal } = useModal();
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const drawerRef = useRef<HTMLDivElement | null>(null);
	const hasManyThemes = env<ThemeMode[]>("available_themes").length > 1;
	const links: SidebarLink[] = [
		{ href: "/", label: t("dashboard"), icon: faHome },
		{ href: "/alerts", label: t("alerts"), icon: faBell },
		{ href: "/shifts", label: t("shifts"), icon: faCalendarDays },
		{ href: "/trains", label: t("trains"), icon: faTrain },
		{ href: "/settings", label: t("settings"), icon: faGear },
	];

	// Close drawer on route change
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	// Close on Escape and when clicking outside
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") setMobileOpen(false);
		}

		function onClick(e: MouseEvent) {
			if (!drawerRef.current) return;
			if (mobileOpen && e.target instanceof Node && !drawerRef.current.contains(e.target)) {
				setMobileOpen(false);
			}
		}

		if (mobileOpen) {
			document.addEventListener("keydown", onKey);
			document.addEventListener("mousedown", onClick);
		}
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("mousedown", onClick);
		};
	}, [mobileOpen]);

	return (
		<>
			{/* Mobile top bar */}
			<div
				className="md:hidden fixed top-0 left-0 right-0 h-14 z-30 bg-surface border-b border-border shadow-md flex items-center justify-end px-4">
				<div className="flex items-center gap-2">
					{hasManyThemes && <ThemeButton/>}
					<button
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						aria-expanded={mobileOpen}
						aria-controls="mobile-drawer"
						onClick={() => setMobileOpen((v) => !v)}
						className="p-2 rounded hover:bg-surface-muted"
					>
						{/* Hamburger / Close icon */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className="h-6 w-6"
						>
							{mobileOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									  d="M6 18L18 6M6 6l12 12"/>
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									  d="M4 6h16M4 12h16M4 18h16"/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Drawer */}
			{mobileOpen && (
				<>
					<div className="md:hidden fixed inset-0 z-30 bg-black/40"/>
					<div
						id="mobile-drawer"
						ref={drawerRef}
						role="dialog"
						aria-modal="true"
						className="md:hidden fixed top-0 left-0 bottom-0 z-40 w-64 bg-surface shadow-lg border-r border-border"
					>
						<nav className="h-full overflow-auto py-3">
							<ul className="flex flex-col">
								{links.map((l) => (
									<li key={l.href}>
										<Link
											href={l.href}
											className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted ${
												pathname === l.href ? "bg-surface-muted font-semibold" : ""
											}`}
										>
											<FontAwesomeIcon className="!h-4 !w-4 p-2 rounded bg-surface-muted"
															 icon={l.icon}/>
											<span className="truncate">{l.label}</span>
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</>
			)}

			{/* Desktop sidebar */}
			<aside
				className={`hidden h-screen md:flex overflow-hidden flex-col sticky top-0 left-0 z-20 bg-surface border-r border-border shadow-md transition-all duration-200 ease-in-out ${
					collapsed ? "w-16" : "w-64"
				}`}
				aria-label="Sidebar"
			>
				{hasManyThemes && <ThemeButton folded={collapsed}/>}
				<nav className={`flex-1 overflow-auto ${hasManyThemes ? "border-t border-border" : "mt-2"}`}>
					<ul className={`flex flex-col gap-2 ${collapsed && "items-center"}`}>
						{links.map((l) => (
							<li key={l.href}>
								<Link
									href={l.href}
									className={`flex items-center gap-3 ${collapsed ? "rounded-lg px-2 py-2" : "px-3 py-2"} transition-colors hover:bg-surface-muted ${
										pathname === l.href
											? "bg-surface-muted font-semibold"
											: ""
									}`}
								>
									<FontAwesomeIcon
										className={"!h-4 !w-4 p-2 rounded bg-surface-muted flex items-center justify-center"}
										icon={l.icon}/>
									{!collapsed && <span className="truncate">{l.label}</span>}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div
					className={`px-3 py-3 border-t border-border flex flex-row items-center ${collapsed ? "justify-center" : "justify-between"}`}>
					{!collapsed && (
						<div className="text-xs cursor-pointer text-muted-foreground" onClick={() => openModal(<Changelog />)}>IVC {getLatestVersion()}</div>
					)}
					<button
						aria-expanded={!collapsed}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						onClick={() => setCollapsed((v) => !v)}
						className="p-1 rounded hover:bg-surface-muted"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className={`h-7 w-7 transform transition-transform duration-150 ${
								collapsed ? "rotate-180" : "rotate-0"
							}`}
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6"/>
						</svg>
					</button>
				</div>
			</aside>
		</>
	);
}
