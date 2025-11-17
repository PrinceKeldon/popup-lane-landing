import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";
import { ContactFAQ } from "@/components/contact/ContactFAQ";

const Contact = () => {
  return (
    <>
      <SEOHead
        title="Contact Us — Get in Touch with PopUp Lane"
        description="Have questions about PopUp Lane? Contact our team for merchant support, partnerships, or general inquiries. We respond within 24-48 hours."
        canonical="https://popuplane.com/contact"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-b from-wine/5 to-background border-b border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Get in Touch
                </h1>
                <p className="text-lg text-muted-foreground">
                  We'd love to hear from you. Whether you have a question, feedback, or just want to say hello, reach out and we'll get back to you soon.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="lg:col-span-1">
                  <ContactInfoCard />
                </div>
                <div className="lg:col-span-2">
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <ContactFAQ />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
