import { Changelog as ChangelogType, getChangelog, Paginated } from "@/lib/helpers/app";
import { useTranslation } from "next-i18next";
import Paginator from "@/components/ui/paginator";
import { useEffect, useState } from "react";

export default function Changelog() {
	const { t } = useTranslation();
	const [changelog, setChangelog] = useState<Paginated<ChangelogType>>();
	const [data, setData] = useState<ChangelogType>();
	const loadChangelog = (page: number = 1) => {
		const _data = getChangelog(page, 3)
		setChangelog(_data);
		setData(_data.data)
	}

	useEffect(() => {
		loadChangelog()
	}, [])
	const {i18n} = useTranslation();
	return (
		<div>
			<h3 className={"text-xl pb-4"}>Changelog</h3>

			{data == undefined ? <p>{t("loading")}</p> : (
				<div className="flex flex-col gap-3 min-h-[570px]">
					{Object.keys(data).map((key) => {
						return (
							<div key={key} className={"not-last:border-b border-gray-700 pb-2"}>
								<div><span className="text-xl">{key}</span>, <span className={"text-sm"}>{new Date(data[key].date*1000).toLocaleString(i18n.language)}</span></div>
								{data[key].description !== "" && <p className={"my-1"}>{data[key].description}</p>}
								<div className="flex flex-col gap-4">
									{data[key].added !== undefined && (
										<div>
											<p>Added:</p>
											<ul>
												{data[key].added.map((added) => {
													return <li className={"list-disc list-inside"} key={added}>{added}</li>
												})}
											</ul>
										</div>
									)}
									{data[key].fixed !== undefined && (
										<div>
											<p>Fixed:</p>
											<ul>
												{data[key].fixed.map((added) => {
													return <li className={"list-disc list-inside"} key={added}>{added}</li>
												})}
											</ul>
										</div>
									)}
									{data[key].removed !== undefined && (
										<div>
											<p>Removed:</p>
											<ul>
												{data[key].removed.map((added) => {
													return <li className={"list-disc list-inside"} key={added}>{added}</li>
												})}
											</ul>
										</div>
									)}
								</div>
							</div>
						)
					})}
				</div>
			)}

			{changelog && <Paginator buttonVariant={"link"} page={changelog.page} all_pages={changelog.all_pages} onPreviousPageClicked={() => loadChangelog(--changelog.page)} onNextPageClicked={() => loadChangelog(++changelog.page)} />}
		</div>
	)
}