export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "We Open the Lane",
      description: "PopUp Lane appears only during the season — a short, curated showcase of indie drops and limited offers.",
    },
    {
      num: "02",
      title: "Small Brands Take the Spotlight",
      description: "We highlight makers and merchants so great products don't get buried by algorithms or ad spend.",
    },
    {
      num: "03",
      title: "You Find What Matters",
      description: "Shop intentionally: limited-time items, real stories, and deals that reward discovery — not noise.",
    },
  ];

  return (
    <section className="py-16" id="how-it-works" aria-labelledby="how-title">
      <div className="container px-4 mx-auto max-w-7xl">
        <h2 id="how-title" className="text-serif text-[28px] text-center mb-8">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4.5" role="list">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-card rounded-xl p-5 border border-border shadow-[var(--shadow-card)] hover-lift"
              role="listitem"
            >
              <div className="font-bold text-foreground text-xl mb-2">
                {step.num}
              </div>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed m-0">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
