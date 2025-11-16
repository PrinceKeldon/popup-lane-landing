import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const PricingFAQ = () => {
  const faqs = [
    {
      question: "Do I need both a Lane Pass and Backroom Membership?",
      answer: "No, they serve different purposes. A Lane Pass grants you access to participate in a specific seasonal Lane event. The Backroom Membership provides year-round community access, early Lane invitations, and merchant perks. You can purchase either or both depending on your needs."
    },
    {
      question: "Can I get a refund if I can't participate?",
      answer: "Lane Pass purchases are non-refundable once a Lane opens, but we understand that circumstances change. Contact us before your Lane starts and we'll work with you. Backroom Memberships can be cancelled anytime with no penalty."
    },
    {
      question: "What happens when the Lane closes?",
      answer: "Your Lane Pass is valid for the entire duration of that specific Lane (typically 2-4 weeks). Once it closes, you'll need a new Lane Pass to join future Lanes. However, Backroom Members get early access to upcoming Lane invitations."
    },
    {
      question: "Do you take a percentage of my sales?",
      answer: "No! We never take a commission on your sales. Our pricing is transparent and upfront. You pay once for your Lane Pass or monthly for Backroom Membership, and you keep 100% of what you earn."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure payment processor. Payments are processed immediately and you'll receive a receipt via email."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes! You can add a Backroom Membership at any time. If you have a Backroom Membership, you can cancel it whenever you want. Lane Passes are one-time purchases per season and cannot be transferred or refunded once the Lane is live."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Everything you need to know about our pricing
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="bg-card border border-border rounded-lg px-6"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-semibold text-foreground">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pt-2 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <a 
          href="mailto:hello@popuplane.com" 
          className="text-wine hover:text-wine-light font-medium underline underline-offset-4"
        >
          Contact our team
        </a>
      </div>
    </div>
  );
};
