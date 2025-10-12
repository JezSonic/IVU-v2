"use client";
import "./globals.css";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import UI from "@/app/ui";
import { useSettingsStore } from "@/stores/settingsStore";
import { ModalProvider } from "@/components/modal/modal-provider";

function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { theme, language } = useSettingsStore();

	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) return (
		<html lang={language} data-theme={theme} className={theme}>
			<body className={`antialiased bg-background text-foreground flex flex-col w-full h-full justify-center items-center`}>
				<h1 className={`text-xl text-center`}>
					...
				</h1>
			</body>
		</html>
	)
    return (
        <html lang={language} data-theme={theme} className={theme}>
			<body className={`antialiased bg-background text-foreground`}>
				<I18nextProvider i18n={i18n}>
					<ModalProvider>
						<UI>
							{children}
						</UI>
					</ModalProvider>
					<Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive"/>
					<div id="modal-root" />
				</I18nextProvider>
			</body>
        </html>
    );
}

export default RootLayout;