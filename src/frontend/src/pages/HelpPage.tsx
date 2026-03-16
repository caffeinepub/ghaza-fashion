import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import { Layout } from "../components/Layout";

const FAQS = [
  {
    q: "What are your delivery charges?",
    a: "We offer FREE delivery on all orders above Rs. 5,999. For orders below this amount, a flat delivery charge of Rs. 250 applies. We deliver across Pakistan.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 working days for major cities (Karachi, Lahore, Islamabad). Remote areas may take 5–7 working days.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD), JazzCash (03201435872 – Syed Muhammad Ali Shah), EasyPaisa (03201435872 – Syed Muhammad Ali Shah), and Meezan Bank transfer (Account: 02820108082003 – Syed Muhammad Ali Shah). Payment instructions will be sent via WhatsApp after order confirmation.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes! We have a 7-day easy return/exchange policy. Items must be unworn, unwashed, and in original packaging. Contact us via WhatsApp within 7 days of delivery to initiate.",
  },
  {
    q: "How do I know which size to order?",
    a: "We recommend referring to the size guide on each product page. If you're between sizes, we suggest sizing up. You can also WhatsApp us for personalized sizing assistance.",
  },
  {
    q: "Can I track my order?",
    a: "Yes, once your order is dispatched you'll receive a tracking number via WhatsApp or SMS. You can use it to track your package.",
  },
  {
    q: "What if I receive a damaged or wrong item?",
    a: "We sincerely apologize! Please contact us immediately via WhatsApp with photos of the item. We'll resolve this with a free replacement or full refund.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled within 4 hours of placement. After dispatch, cancellation is not possible but you can return within 7 days.",
  },
];

export function HelpPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            We're here to help
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Help Centre
          </h1>
          <p className="font-body text-muted-foreground max-w-lg">
            Find answers to common questions, or reach out to us directly —
            we're always happy to assist.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-0">
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.q}
                value={faq.q.slice(0, 20)}
                className="border-b border-border"
              >
                <AccordionTrigger className="font-body text-sm font-semibold text-foreground py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "📱",
                label: "WhatsApp",
                value: "03224402086",
                note: "Fastest response",
                href: "https://wa.me/923224402086",
              },
              {
                icon: "📧",
                label: "Email",
                value: "ghazafashion2232@gmail.com",
                note: "Reply within 24 hours",
                href: "mailto:ghazafashion2232@gmail.com",
              },
              {
                icon: "🏦",
                label: "Bank / Mobile Payments",
                value: "JazzCash / EasyPaisa / Meezan",
                note: "03201435872 · 02820108082003",
                href: null,
              },
            ].map((contact) => (
              <div key={contact.label} className="bg-secondary p-5">
                <div className="text-2xl mb-2">{contact.icon}</div>
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  {contact.label}
                </p>
                {contact.href ? (
                  <a
                    href={contact.href}
                    className="font-body text-sm font-semibold text-foreground hover:underline break-all"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="font-body text-sm font-semibold text-foreground">
                    {contact.value}
                  </p>
                )}
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {contact.note}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Policies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Store Policies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Return Policy",
                body: "Easy 7-day returns on all items. Products must be in original condition with tags attached.",
              },
              {
                title: "Exchange Policy",
                body: "Free size exchanges available within 7 days of delivery, subject to stock availability.",
              },
              {
                title: "Delivery Policy",
                body: "We deliver Pakistan-wide. COD available. Free delivery on orders over Rs. 5,999.",
              },
              {
                title: "Privacy Policy",
                body: "Your personal information is never shared with third parties and is used solely for order processing.",
              },
            ].map((policy) => (
              <div key={policy.title} className="border border-border p-5">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  {policy.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {policy.body}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
