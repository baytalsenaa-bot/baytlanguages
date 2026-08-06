type LegalSection = { heading: string; body: string };

export function LegalPageBody({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="px-4 pb-24 pt-20 md:pt-28">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-parchment md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-brand-muted">{updated}</p>
        <p className="mt-6 text-brand-parchment">{intro}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-brand-gold">{section.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
