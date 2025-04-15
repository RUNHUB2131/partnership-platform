import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's included in the Pay Per Post plan?",
    answer: "The Pay Per Post plan includes a single opportunity posting that stays active for 30 days, along with application tracking. You'll also get a brand profile and email notifications for new applications.",
  },
  {
    question: "Can I switch between plans?",
    answer: "Yes, you can upgrade to the Unlimited plan at any time. If you switch from Unlimited to Pay Per Post, the change will take effect at the end of your current billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. For annual subscriptions, we can also accommodate bank transfers.",
  },
  {
    question: "Is there a contract or minimum commitment?",
    answer: "No, there's no minimum commitment. Pay Per Post is a one-time payment, and the Unlimited plan can be cancelled at any time.",
  },
  {
    question: "How long do opportunities stay active?",
    answer: "Pay Per Post opportunities remain active for 30 days, while Unlimited plan opportunities can stay active for as long as you need.",
  },
];

export function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}