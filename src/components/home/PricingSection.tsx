
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      popular: false,
      name: "Basic",
      price: "$0",
      description: "Start your health journey",
      features: [
        "1 Lab test analysis per month",
        "Basic nutrition recommendations",
        "Limited health tracking",
        "7-day chat history"
      ],
      cta: "Get Started",
      ctaVariant: "outline"
    },
    {
      popular: true,
      name: "Premium",
      price: "$19.99",
      period: "/month",
      description: "Complete health optimization",
      features: [
        "Unlimited lab test analysis",
        "Advanced nutrition planner",
        "Personalized fitness regimens",
        "Supplement recommendations",
        "Continuous health monitoring",
        "Unlimited chat history",
        "Priority support"
      ],
      cta: "Get Started",
      ctaVariant: "default"
    },
    {
      popular: false,
      name: "Family",
      price: "$39.99",
      period: "/month",
      description: "Health benefits for everyone",
      features: [
        "Everything in Premium",
        "Up to 5 family members",
        "Family health dashboard",
        "Genetic insights (Coming Soon)",
        "Shared health goals",
        "Family nutrition planning",
        "Dedicated health advisor"
      ],
      cta: "Contact Sales",
      ctaVariant: "outline"
    }
  ];

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <section className="py-20 bg-muted/30" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that works best for your health goals
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative h-full bg-card border ${
                plan.popular
                  ? "border-primary/30 shadow-lg shadow-primary/5"
                  : "border-border/30 shadow-sm"
              } rounded-xl flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 mx-auto w-36 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? "pt-8" : "pt-6"} flex-1`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4 flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <span className="text-sm">
                        {feature}
                        {feature.includes("Genetic") && (
                          <Badge variant="outline" className="ml-2 text-[10px] bg-primary/10 text-primary border-primary/20">
                            Coming Soon
                          </Badge>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  variant={plan.ctaVariant as "default" | "outline"}
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : ""
                  }`}
                  onClick={handleGetStarted}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
