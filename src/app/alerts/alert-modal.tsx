import { useTranslation } from "next-i18next";
import { useModal } from "@/components/modal/modal-provider";
import { Alert } from "@/lib/data.d"

export default function AlertModal({selected}: {selected: Alert}) {
	const { t, i18n } = useTranslation();
	const { closeModal } = useModal();
	return (
		<div>
			<div
				className="flex items-start justify-between border-b border-black/[.06] dark:border-white/[.06] mb-2 pb-2">
				<div>
					<h2 id="alert-dialog-title" className="text-lg font-semibold">
						{selected.title}
					</h2>
					<div className="text-xs text-gray-600 dark:text-gray-400">
						{new Date(selected.timestamp).toLocaleString(i18n.language)} — {t("alerts.severity")}: {t(`alerts.severity.${selected.severity}`)}
					</div>
				</div>
			</div>
			<div className="">
				<p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">{selected.description}</p>

				{selected.meta && (
					<div className="mt-4">
						<div
							className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">{t("alerts.details")}</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{Object.entries(selected.meta).map(([k, v]) => (
								<div key={k} className="p-2 rounded bg-black/[.04] dark:bg-white/[.06]">
									<div
										className="text-xs text-gray-600 dark:text-gray-400">{t(`alerts.details.${k}`)}</div>
									<div className="text-sm">{v}</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			<div className="border-t mt-2 pt-2 border-black/[.06] dark:border-white/[.06] flex justify-end gap-2">
				<button
					className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
					onClick={() => closeModal()}
				>
					{t("close")}
				</button>
			</div>
		</div>
	)
}