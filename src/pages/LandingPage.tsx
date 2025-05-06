
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Activity, 
  Scale, 
  MessageSquare, 
  CheckCircle, 
  Award,
  FileText,
  User,
  Lock,
  ArrowUpRight,
  ExternalLink,
  Heart,
  Dumbbell,
  Apple,
  Weight,
  Thermometer,
  ChartLine,
  Dna
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const featuredRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/90 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-9 h-9">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[6px]"></div>
              <div className="relative rounded-full p-1.5 w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/20">
                <Dna className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h1 className="text-xl font-bold">BIOMA<span className="text-primary">AI</span></h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection(featuredRef)}>
              Features
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection(testimonialRef)}>
              Testimonials
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection(pricingRef)}>
              Pricing
            </Button>
            <Button variant="outline" size="sm" className="ml-2" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button size="sm" className="ml-1" onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center">
            <Button size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl" />
            <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl" />
            <div className="absolute top-3/4 left-1/3 w-60 h-60 rounded-full bg-primary/5 filter blur-3xl opacity-70" />
          </div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <motion.div 
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                  Health Analytics Reinvented
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Unlock Your <span className="text-primary">Optimal Health</span> With Lab Test Analysis
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                  Transform your health journey with AI-powered analysis of your lab tests, delivering personalized nutrition and fitness recommendations tailored to your unique biology.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => scrollToSection(featuredRef)}
                  >
                    Explore Features
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 justify-center lg:justify-start">
                  {[
                    { icon: <Dna className="h-5 w-5 text-primary" />, label: "Lab Analysis" },
                    { icon: <Apple className="h-5 w-5 text-primary" />, label: "Nutrition Plans" },
                    { icon: <Dumbbell className="h-5 w-5 text-primary" />, label: "Fitness Advice" },
                    { icon: <ChartLine className="h-5 w-5 text-primary" />, label: "Health Tracking" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.3 + (idx * 0.1) }
                      }}
                      className="flex flex-col items-center lg:items-start"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                        {item.icon}
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1 w-full max-w-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-card/70 border border-border/40 shadow-xl rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">Your Health Dashboard</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-background/40 border border-border/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Latest Analysis</h4>
                              <p className="text-sm text-muted-foreground">Your comprehensive health insights</p>
                            </div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">Blood Panel Analysis</span>
                              <Badge variant="outline" className="text-xs">Recent</Badge>
                            </div>
                            <div className="w-full bg-background/50 h-2 rounded-full overflow-hidden">
                              <div className="bg-primary h-full w-3/4 rounded-full"></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-muted-foreground">Health Score: 75/100</span>
                              <span className="text-xs text-primary">View Details</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-background/40 border border-border/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Apple className="h-4 w-4 text-primary" />
                              <span className="font-medium">Today's Nutrition Plan</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">Personalized</Badge>
                          </div>
                          <div className="space-y-2 mt-3">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary/50 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm text-muted-foreground/80">Increase protein intake</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary/50 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm text-muted-foreground/80">Add vitamin D supplement</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary/50 flex items-center justify-center">
                              </div>
                              <span className="text-sm text-muted-foreground/80">Reduce processed carbs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                        onClick={handleGetStarted}
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="bg-muted/30 border-t border-border/20 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-muted-foreground">7-day health streak</span>
                      </div>
                      <span className="text-xs text-primary">See your progress</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-card shadow-lg p-3 rounded-lg border border-border/40 max-w-[200px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Nutrition Plan Updated</p>
                        <p className="text-xs text-muted-foreground">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-muted/30" ref={featuredRef} id="features">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Health Analysis</h2>
              <p className="text-lg text-muted-foreground">
                Our AI analyzes your lab test results to create personalized health recommendations, nutrition plans, and fitness regimens.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Dna className="h-6 w-6 text-primary" />,
                  title: "Lab Test Analysis",
                  description: "Upload your blood work and receive comprehensive insights and health markers explained in plain language.",
                  delay: 0
                },
                {
                  icon: <Apple className="h-6 w-6 text-primary" />,
                  title: "Personalized Nutrition",
                  description: "Get tailored food recommendations based on your unique biomarkers and health goals.",
                  delay: 0.1
                },
                {
                  icon: <Dumbbell className="h-6 w-6 text-primary" />,
                  title: "Fitness Recommendations",
                  description: "Receive exercise plans calibrated to your physiology and fitness level for optimal results.",
                  delay: 0.2
                },
                {
                  icon: <Heart className="h-6 w-6 text-primary" />,
                  title: "Health Monitoring",
                  description: "Track improvements in your biomarkers over time and get alerts for concerning changes.",
                  delay: 0.3
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-primary" />,
                  title: "AI Health Advisor",
                  description: "Chat with our AI to answer questions about your health data and get personalized advice.",
                  delay: 0.4
                },
                {
                  icon: <ChartLine className="h-6 w-6 text-primary" />,
                  title: "Progress Tracking",
                  description: "Visualize your health journey with intuitive charts and metrics to stay motivated.",
                  delay: 0.5
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-card border border-border/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20" ref={testimonialRef} id="testimonials">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-lg text-muted-foreground">
                Hear from people who have transformed their health with BIOMA AI's insights.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "BIOMA AI helped me understand my lab results in a way doctors never explained. The personalized nutrition plan helped me resolve my vitamin D deficiency in just 3 months.",
                  author: "Sarah Johnson",
                  role: "Health Enthusiast, 34",
                  avatar: "/avatars/avatar-1.png"
                },
                {
                  quote: "After years of struggling with fatigue, BIOMA AI analyzed my bloodwork and identified patterns my doctors missed. Their recommendations transformed my energy levels completely.",
                  author: "Michael Chen",
                  role: "Marathon Runner, 42",
                  avatar: "/avatars/avatar-2.png"
                },
                {
                  quote: "The personalized fitness plan based on my biomarkers was a game-changer. I've lost 20 pounds and my cholesterol numbers have improved dramatically after just 4 months.",
                  author: "Jessica Rodriguez",
                  role: "Working Professional, 38",
                  avatar: "/avatars/avatar-3.png"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center mt-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden mr-3">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-muted/30" ref={pricingRef} id="pricing">
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
              {[
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
                    "Genetic insights",
                    "Shared health goals",
                    "Family nutrition planning",
                    "Dedicated health advisor"
                  ],
                  cta: "Contact Sales",
                  ctaVariant: "outline"
                }
              ].map((plan, index) => (
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
                          <span className="text-sm">{feature}</span>
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
                {[
                  {
                    question: "How does BIOMA AI analyze my lab tests?",
                    answer: "BIOMA AI uses advanced machine learning algorithms to analyze your lab test results, comparing them with reference ranges and scientific research. Our AI identifies patterns and correlations in your biomarkers to generate personalized health insights and recommendations."
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
                  },
                  {
                    question: "How accurate are the nutrition and fitness recommendations?",
                    answer: "Our recommendations are based on peer-reviewed scientific research and continuously updated algorithms. While highly personalized, they are designed to complement, not replace, advice from healthcare professionals. We recommend discussing significant health changes with your doctor."
                  }
                ].map((faq, i) => (
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
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to optimize your health?</h2>
                    <p className="text-muted-foreground mb-6 md:mb-0">
                      Join thousands of users who are using BIOMA AI to understand their lab results and transform their health. Get started for free today.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:flex-col lg:flex-row">
                    <Button 
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleGetStarted}
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-primary/20"
                      onClick={() => scrollToSection(featuredRef)}
                    >
                      Learn More
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted/30 border-t border-border/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full p-1.5 w-8 h-8 flex items-center justify-center bg-primary/10">
                  <Dna className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">BIOMA AI</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Revolutionizing personal health optimization with AI-powered lab test analysis and personalized recommendations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
            
            <div className="md:ml-12">
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground text-sm">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground text-sm">Pricing</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground text-sm">Testimonials</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">For Professionals</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Health Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Research</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 BIOMA AI. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
