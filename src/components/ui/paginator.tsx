import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";

export default function Paginator({page, all_pages, onPreviousPageClicked, onNextPageClicked, buttonVariant}: {page: number, all_pages: number, onPreviousPageClicked: () => void, onNextPageClicked: () => void, buttonVariant?: "link" | "primary" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined}) {
	const { t } = useTranslation();
	return (
		<div className={"flex gap-3 items-center justify-center xl:justify-start"}>
			<Button variant={buttonVariant || "primary"} size={'sm'} disabled={page == 1} onClick={onPreviousPageClicked}><FontAwesomeIcon icon={faChevronLeft} /></Button>
			<p>{t("page.of", {
				all_pages: all_pages,
				page: page
			})}</p>
			<Button variant={buttonVariant || "primary"} size={'sm'} onClick={onNextPageClicked} disabled={page == all_pages}><FontAwesomeIcon icon={faChevronRight} /></Button>
		</div>
	)
}