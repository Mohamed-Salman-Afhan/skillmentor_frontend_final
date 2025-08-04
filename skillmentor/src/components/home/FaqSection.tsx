import {
    Accordion, AccordionItem, AccordionTrigger, AccordionContent
  } from "@/components/ui/accordion"
  
  const faqs = [
      {
          question: "How do I book a session?",
          answer: "Simply browse our available classes, choose a mentor, and click the 'Schedule' button. You'll be prompted to select a date and time and upload your payment slip to confirm your booking."
      },
      {
          question: "How does payment work?",
          answer: "Currently, we support offline bank transfers. You will need to upload a proof of payment (bank slip) when booking, which will then be verified by our admin team to approve your session."
      },
      {
          question: "Can I cancel or reschedule a session?",
          answer: "In our current MVP version, cancellation and rescheduling features are not available. Please be sure of your selected time before booking. We plan to add this functionality in a future update."
      },
      {
          question: "Who are the mentors?",
          answer: "Our mentors are highly qualified professionals and academics who are experts in their respective fields. You can view their qualifications and experience on their profile pages."
      },
  ];
  
  export default function FaqSection() {
      return (
          <section className="py-20 bg-muted">
               <div className="container mx-auto max-w-3xl">
                  <div className="text-center">
                      <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                      <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about Skillmentor.</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full mt-12">
                      {faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index + 1}`}>
                              <AccordionTrigger>{faq.question}</AccordionTrigger>
                              <AccordionContent>{faq.answer}</AccordionContent>
                          </AccordionItem>
                      ))}
                  </Accordion>
              </div>
          </section>
      );
  }