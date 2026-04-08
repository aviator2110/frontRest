type PageIntroProps = {
  title: string;
  subtitle: string;
};

export function PageIntro({ title, subtitle }: PageIntroProps) {
  return (
    <section className="page-intro">
      <span>{subtitle}</span>
      <h2>{title}</h2>
    </section>
  );
}
