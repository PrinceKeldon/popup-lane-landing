import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ContactFAQ = () => {
  const faqs = [
    {
      question: "How quickly will I hear back?",
      answer: "We typically respond to all inquiries within 24-48 hours during business days (Monday-Friday). If you contact us on a weekend, we'll get back to you on the next business day."
    },
    {
      question: "Can I schedule a call with your team?",
      answer: "Absolutely! For complex inquiries or partnership discussions, we're happy to schedule a call. Just mention your preferred times in your message and we'll coordinate with you."
    },
    {
      question: "Do you offer live chat support?",
      answer: "Currently, we provide support via email and scheduled calls. This allows us to give each inquiry the attention it deserves and provide thoughtful, detailed responses."
    },
    {
      question: "What if I need urgent assistance?",
      answer: "For urgent merchant support issues, please select 'Technical Issue' or 'Merchant Application Support' as your inquiry type. We prioritize these requests and aim to respond within a few hours during business hours."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl mb-3 text-foreground">
          Quick Answers
        </h2>
        <p className="text-muted-foreground text-sm">
          Find answers to common questions about contacting us
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-card border border-border rounded-lg px-5"
          >
            <AccordionTrigger className="text-left hover:no-underline text-sm">
              <span className="font-semibold text-foreground">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm pt-2 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
