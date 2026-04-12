type PageIntroProps = {
  title: string;
};

export function PageIntro({ title }: PageIntroProps) {
  return (
    <section className="page-intro">
      <h2>{title}</h2>
    </section>
  );
}
