"use client";

import { useMemo, useState } from "react";
import {
	ArrowUpDown,
	CalendarRange,
	Download,
	FileSpreadsheet,
	Search,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import StatusChip from "@/components/ui/StatusChip";
import { useI18n } from "@/src/i18n/useI18n";

type ReportRow = {
	id: string;
	date: string;
	period: "Diario" | "Semanal";
	kp: number;
	flares: string;
	risk: "calm" | "watch" | "alert" | "critical";
};

const rows: ReportRow[] = [
	{ id: "R-1192", date: "2026-04-25", period: "Diario", kp: 6, flares: "M2, C5", risk: "alert" },
	{ id: "R-1191", date: "2026-04-24", period: "Diario", kp: 4, flares: "C3, C2", risk: "watch" },
	{ id: "R-1190", date: "2026-04-23", period: "Diario", kp: 7, flares: "X1, M4", risk: "critical" },
	{ id: "R-1189", date: "2026-04-22", period: "Diario", kp: 3, flares: "B9, C1", risk: "watch" },
	{ id: "R-1188", date: "2026-04-21", period: "Semanal", kp: 5, flares: "M1, C8", risk: "alert" },
	{ id: "R-1187", date: "2026-04-20", period: "Semanal", kp: 2, flares: "B4, B8", risk: "calm" },
];

export default function MyReportsPage() {
	const { t } = useI18n();
	const [query, setQuery] = useState("");
	const [sortDesc, setSortDesc] = useState(true);

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "date", label: t("reports.column_date") },
		{ key: "period", label: t("reports.column_period") },
		{ key: "kp", label: "Kp", align: "center" as const },
		{ key: "flares", label: "Flares" },
		{
			key: "risk",
			label: t("reports.column_risk"),
			format: (value: unknown) => (
				<StatusChip label={String(value)} tone={value as ReportRow["risk"]} className="justify-center" />
			),
		},
	];

	const handleExportCsv = () => {
		const headers = ["id", "date", "period", "kp", "flares", "risk"];
		const rowsCsv = filtered.map((row) =>
			[row.id, row.date, row.period, row.kp, row.flares, row.risk]
				.map((value) => `"${String(value).replaceAll('"', '""')}"`)
				.join(",")
		);

		const csvContent = [headers.join(","), ...rowsCsv].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const timestamp = new Date().toISOString().slice(0, 10);
		link.href = url;
		link.setAttribute("download", `flarefield-reports-${timestamp}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const filtered = useMemo(() => {
		const text = query.trim().toLowerCase();
		const base = rows.filter((row) => {
			if (!text) return true;
			return (
				row.id.toLowerCase().includes(text) ||
				row.flares.toLowerCase().includes(text) ||
				row.period.toLowerCase().includes(text)
			);
		});

		return [...base].sort((a, b) => {
			const aTime = new Date(a.date).getTime();
			const bTime = new Date(b.date).getTime();
			return sortDesc ? bTime - aTime : aTime - bTime;
		});
	}, [query, sortDesc]);

	return (
		<div className="flex min-h-screen bg-[var(--color-background)]">
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="liquid-orb right-12 top-20 h-96 w-96 bg-[radial-gradient(circle,var(--color-primary),transparent_70%)]" />
				<div className="liquid-orb bottom-12 left-16 h-72 w-72 bg-[radial-gradient(circle,var(--color-tertiary),transparent_72%)]" />
			</div>

			<Sidebar />

			<main className="relative z-10 flex-1 overflow-auto p-4 md:p-6 lg:p-8">
				<div className="space-y-6">
					<section className="glass-panel rounded-xl p-6 md:p-8">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="space-y-2">
								<h1 className="text-3xl md:text-4xl font-light">{t("reports.title")}</h1>
								<p className="text-sm text-[var(--color-text-muted)]">
									{t("reports.subtitle")}
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<Button variant="outlined" size="sm">
									<CalendarRange className="h-4 w-4" strokeWidth={1.8} />
									{t("reports.date_range")}
								</Button>
								<Button size="sm" onClick={handleExportCsv}>
									<Download className="h-4 w-4" strokeWidth={1.8} />
									{t("reports.export_csv")}
								</Button>
							</div>
						</div>
					</section>

					<section className="grid gap-6 lg:grid-cols-3">
						<Card className="p-5 lg:col-span-2">
							<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
									<FileSpreadsheet className="h-4 w-4" strokeWidth={1.8} />
									{t("reports.feed")}
								</div>
								<div className="flex items-center gap-2">
									<label className="glass-soft flex items-center gap-2 rounded-lg px-3 py-2">
										<Search className="h-4 w-4 text-[var(--color-text-subtle)]" strokeWidth={1.8} />
										<input
											value={query}
											onChange={(event) => setQuery(event.target.value)}
												placeholder={t("reports.search_placeholder")}
											className="w-52 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-subtle)]"
										/>
									</label>
									<Button variant="ghost" size="sm" onClick={() => setSortDesc((prev) => !prev)}>
										<ArrowUpDown className="h-4 w-4" strokeWidth={1.8} />
											{sortDesc ? t("reports.recent") : t("reports.oldest")}
									</Button>
								</div>
							</div>

							<DataTable data={filtered} columns={columns} className="glass-soft border-0" />
						</Card>

						<Card className="p-5">
							<div className="space-y-4">
								<h2 className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
									{t("reports.summary")}
								</h2>
								<div className="glass-soft rounded-lg p-4">
									<p className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">{t("reports.total_reports")}</p>
									<p className="mt-2 text-4xl font-light text-[var(--color-primary)] [font-family:var(--font-display)]">{filtered.length}</p>
								</div>
								<div className="glass-soft rounded-lg p-4">
									<p className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">Peak Kp</p>
									<p className="mt-2 text-4xl font-light text-[var(--color-primary)] [font-family:var(--font-display)]">
										{filtered.length > 0 ? Math.max(...filtered.map((row) => row.kp)) : "-"}
									</p>
								</div>
								<div className="glass-soft rounded-lg p-4">
									<p className="text-xs uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">{t("reports.critical_events")}</p>
									<p className="mt-2 text-4xl font-light text-[var(--color-alert)] [font-family:var(--font-display)]">
										{filtered.filter((row) => row.risk === "critical").length}
									</p>
								</div>
							</div>
						</Card>
					</section>
				</div>
			</main>
		</div>
	);
}
