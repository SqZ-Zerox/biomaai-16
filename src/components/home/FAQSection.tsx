
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How does BIOMA AI analyze my lab tests?",
      answer: "BIOMA AI uses advanced machine learning algorithms to analyze your lab test results, comparing them with reference ranges and scientific research. Our AI identifies patterns and correlations in your biomarkers to generate personalized health insights and recommendations."
    },
    {
      question: "When will the genetic analysis feature be available?",
      answer: "We're currently developing our revolutionary genetic analysis capabilities. While we don't have an exact release date yet, we're working diligently to bring this groundbreaking feature to our users. In the meantime, our lab test analysis provides valuable health insights."
    },
    {
      question: "Is my health data secure with BIOMA AI?",
      answer: "Yes, we take data security very seriously. All your health data is encrypted both in transit and at rest. We comply with HIPAA regulations and never share your information with third parties without your explicit consent."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your current billing period."
    },
    {
      question: "What types of lab tests can BIOMA AI analyze?",
      answer: "BIOMA AI can analyze a wide range of lab tests, including complete blood count (CBC), comprehensive metabolic panel (CMP), lipid panels, hormone tests, vitamin levels, and many more. If you have questions about a specific test, please contact our support team."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about BIOMA AI
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/40">
                <AccordionTrigger className="text-left py-4 hover:no-underline">
                  <span className="text-base font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
