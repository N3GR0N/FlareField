"use client";

import { useMemo, useState } from "react";
import { BookOpenText, Search, Sparkles } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import { useI18n } from "@/src/i18n/useI18n";

type Term = {
	term: string;
	short: string;
	detail: string;
};

const terms: Term[] = [
	{
		term: "Kp Index",
		short: "Escala 0-9 de actividad geomagnética.",
		detail: "Mide perturbaciones del campo magnético terrestre. Valores altos implican mayor probabilidad de auroras y perturbaciones en comunicaciones.",
	},
	{
		term: "Solar Flare",
		short: "Liberación súbita de energía electromagnética.",
		detail: "Se clasifica como A, B, C, M, X. Las clases M y X pueden impactar servicios satelitales y radio de alta frecuencia.",
	},
	{
		term: "CME",
		short: "Eyección de masa coronal.",
		detail: "Expulsión de plasma y campo magnético desde la corona solar. Si llega a la Tierra, puede desencadenar tormentas geomagnéticas.",
	},
	{
		term: "Aurora Oval",
		short: "Región de máxima probabilidad auroral.",
		detail: "Anillo alrededor de los polos magnéticos donde se concentran las auroras. Se expande en eventos geomagnéticos intensos.",
	},
	{
		term: "Solar Wind",
		short: "Flujo constante de partículas del Sol.",
		detail: "Su velocidad, densidad y orientación magnética influyen de forma directa en el acoplamiento magnetosférico terrestre.",
	},
	{
		term: "Bz South",
		short: "Componente sur del campo magnético interplanetario.",
		detail: "Cuando Bz es negativo durante periodos sostenidos, aumenta la transferencia de energía solar a la magnetosfera.",
	},
];

export default function GlossaryPage() {
	const { t } = useI18n();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const text = query.trim().toLowerCase();
		if (!text) return terms;
		return terms.filter((item) => {
			return (
				item.term.toLowerCase().includes(text) ||
				item.short.toLowerCase().includes(text) ||
				item.detail.toLowerCase().includes(text)
			);
		});
	}, [query]);

	return (
		<div className="flex min-h-screen bg-[var(--color-background)]">
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="liquid-orb left-10 top-20 h-80 w-80 bg-[radial-gradient(circle,var(--color-secondary),transparent_72%)]" />
				<div className="liquid-orb bottom-12 right-14 h-72 w-72 bg-[radial-gradient(circle,var(--color-tertiary),transparent_72%)]" />
			</div>

			<Sidebar />

			<main className="relative z-10 flex-1 overflow-auto p-4 md:p-6 lg:p-8">
				<div className="space-y-6">
					<section className="glass-panel rounded-xl p-6 md:p-8">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="space-y-2">
								<h1 className="text-3xl md:text-4xl font-light">{t("glossary.title")}</h1>
								<p className="text-sm text-[var(--color-text-muted)]">
									{t("glossary.subtitle")}
								</p>
							</div>
							<label className="glass-soft inline-flex items-center gap-2 rounded-lg px-3 py-2">
								<Search className="h-4 w-4 text-[var(--color-text-subtle)]" strokeWidth={1.8} />
								<input
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder={t("glossary.search_placeholder")}
									className="w-56 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-subtle)]"
								/>
							</label>
						</div>
					</section>

					<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{filtered.map((item) => (
							<Card key={item.term} className="p-5">
								<div className="space-y-4">
									<div className="inline-flex items-center gap-2 rounded-full glass-pill px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)] [font-family:var(--font-label)]">
										<BookOpenText className="h-3.5 w-3.5" strokeWidth={1.8} />
										{t("glossary.term")}
									</div>
									<h2 className="text-2xl font-light leading-tight">{item.term}</h2>
									<p className="text-sm text-[var(--color-primary)]">{item.short}</p>
									<p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{item.detail}</p>
								</div>
							</Card>
						))}
					</section>

					{filtered.length === 0 && (
						<Card className="p-10 text-center">
							<div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full glass-pill text-[var(--color-primary)]">
								<Sparkles className="h-5 w-5" strokeWidth={1.8} />
							</div>
							<p className="mt-4 text-sm text-[var(--color-text-muted)]">
								{t("glossary.empty")}
							</p>
						</Card>
					)}
				</div>
			</main>
		</div>
	);
}
