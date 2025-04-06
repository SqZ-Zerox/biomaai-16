
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Scale, 
  MessageSquare, 
  GraduationCap,
  CheckCircle,
  Briefcase,
  User,
  Lock,
  BarChart,
  BookMarked,
  Award,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
              <span className="text-primary font-bold">L</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <a href="#features">Features</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#testimonials">Testimonials</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#pricing">Pricing</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#faq">FAQ</a>
            </Button>
            <Button variant="outline" size="sm" className="ml-2" onClick={() => navigate("/login")}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="ml-2 bg-primary" onClick={() => navigate("/login")}>
              <Lock className="h-4 w-4 mr-2" />
              Sign Up
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
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden" id="hero">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-primary/5 filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
            <div className="absolute bottom-1/3 right-1/6 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    Revolutionize Your <span className="text-primary">Legal Studies</span> with AI
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                    Boost your legal education with AI-powered tools for case briefs, research assistance, and study planning. The modern way to master law school.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button size="lg" onClick={handleGetStarted} className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="border-primary/20 hover:bg-primary/5">
                    Live Demo
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-12"
                >
                  <p className="text-sm text-muted-foreground mb-4">Trusted by law students at</p>
                  <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                    <div className="text-muted-foreground/70 font-semibold">Harvard Law</div>
                    <div className="text-muted-foreground/70 font-semibold">Yale University</div>
                    <div className="text-muted-foreground/70 font-semibold">Stanford Law</div>
                    <div className="text-muted-foreground/70 font-semibold">Columbia Law</div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl transform rotate-3 scale-105"></div>
                  <img 
                    src="/hero-mockup.png" 
                    alt="LegalAid Dashboard" 
                    className="relative rounded-xl shadow-2xl border border-border/40 w-full"
                  />
                  
                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -top-6 -left-6 bg-card shadow-lg p-3 rounded-lg border border-border/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Scale className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Case Brief</p>
                        <p className="text-xs text-muted-foreground">Generated in seconds</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-6 -right-6 bg-card shadow-lg p-3 rounded-lg border border-border/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Study Streak</p>
                        <p className="text-xs text-muted-foreground">7 days</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 relative" id="features">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Legal Students</h2>
              <p className="text-lg text-muted-foreground">
                Our comprehensive suite of features is designed to optimize your legal studies workflow.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Scale className="h-8 w-8 text-primary" />,
                  title: "AI Case Brief Generator",
                  description: "Automatically generate comprehensive case briefs with facts, issues, holdings, and analysis in seconds."
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-primary" />,
                  title: "Legal Research Assistant",
                  description: "Chat with an AI tutor that understands legal concepts and can explain complex topics in simple terms."
                },
                {
                  icon: <BookMarked className="h-8 w-8 text-primary" />,
                  title: "Citation Tool",
                  description: "Generate perfect Bluebook citations for any source with our intuitive citation tool."
                },
                {
                  icon: <FileText className="h-8 w-8 text-primary" />,
                  title: "Legal Essay Help",
                  description: "Get guidance on structuring legal arguments, improving analysis, and editing your essays."
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-primary" />,
                  title: "Flashcards & Quizzes",
                  description: "Create and study with interactive flashcards tailored to your courses and exam preparation."
                },
                {
                  icon: <BarChart className="h-8 w-8 text-primary" />,
                  title: "Study Progress Tracking",
                  description: "Monitor your study habits, track progress, and identify areas for improvement."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-hover"
                >
                  <div className="bg-card border border-border/40 p-6 rounded-xl h-full">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20" id="how-it-works">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How LegalAid Works</h2>
              <p className="text-lg text-muted-foreground">
                Our platform simplifies your legal studies journey in three easy steps.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Create an Account",
                  description: "Sign up for a free account to access our basic features and explore the platform.",
                  icon: <User className="h-6 w-6 text-primary" />
                },
                {
                  number: "02",
                  title: "Upload Your Materials",
                  description: "Upload case documents, notes, or any study materials you want to work with.",
                  icon: <FileText className="h-6 w-6 text-primary" />
                },
                {
                  number: "03",
                  title: "Start Learning Smarter",
                  description: "Use our AI-powered tools to analyze, summarize, and master your legal materials.",
                  icon: <GraduationCap className="h-6 w-6 text-primary" />
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-card border border-border/40 p-6 rounded-xl h-full">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {step.number}
                    </div>
                    <div className="pt-6">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full">
                      <ArrowRight className="h-6 w-6 text-primary/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 relative" id="testimonials">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Law Students Say</h2>
              <p className="text-lg text-muted-foreground">
                Hear from students who have transformed their legal studies with our platform.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "LegalAid has saved me countless hours on case briefs. The AI gets all the key points and helps me understand complex cases much faster.",
                  author: "Sarah Johnson",
                  role: "2L at Columbia Law School",
                  avatar: "/avatars/avatar-1.png"
                },
                {
                  quote: "The citation tool is a game-changer. I no longer stress about Bluebook formats for my papers. It's accurate and incredibly easy to use.",
                  author: "Michael Chen",
                  role: "3L at Stanford Law School",
                  avatar: "/avatars/avatar-2.png"
                },
                {
                  quote: "As a 1L, I was struggling with legal writing until I found LegalAid. The essay assistance and feedback have improved my grades dramatically.",
                  author: "Jessica Rodriguez",
                  role: "1L at Harvard Law School",
                  avatar: "/avatars/avatar-3.png"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-card border border-border/40 p-6 rounded-xl h-full">
                    <div className="mb-4 text-primary/50">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21C3 16.0294 7.02944 12 12 12M12 12C16.9706 12 21 7.97056 21 3M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden">
                        <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-20" id="pricing">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                Choose the plan that works for your legal studies journey.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Free",
                  price: "$0",
                  description: "Perfect for trying out the platform",
                  features: [
                    "Basic case brief generation",
                    "Limited chat with legal assistant",
                    "5 citations per month",
                    "Basic study planner"
                  ],
                  cta: "Start Free",
                  popular: false
                },
                {
                  name: "Pro",
                  price: "$19.99",
                  period: "/month",
                  description: "Everything you need for law school",
                  features: [
                    "Unlimited case briefs",
                    "Advanced legal research assistant",
                    "Unlimited citations",
                    "Essay feedback and suggestions", 
                    "Flashcards with spaced repetition",
                    "Advanced study analytics"
                  ],
                  cta: "Get Started",
                  popular: true
                },
                {
                  name: "Team",
                  price: "$49.99",
                  period: "/month",
                  description: "For study groups and clinics",
                  features: [
                    "Everything in Pro plan",
                    "Up to 5 user accounts",
                    "Collaborative study tools",
                    "Document sharing",
                    "Group analytics",
                    "Priority support"
                  ],
                  cta: "Contact Us",
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className={`h-full rounded-xl flex flex-col ${
                    plan.popular 
                      ? "bg-gradient-to-b from-primary/10 to-transparent border-2 border-primary/30 shadow-lg" 
                      : "bg-card border border-border/40"
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium py-1 px-4 rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                      </div>
                      <p className="text-muted-foreground mb-6">{plan.description}</p>
                      
                      <div className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary" 
                            : ""
                        }`}
                        onClick={handleGetStarted}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 relative" id="faq">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We've got answers. If you don't see what you're looking for, reach out to our team.
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How accurate are the AI-generated case briefs?",
                  answer: "Our AI-generated case briefs have been tested and refined to achieve high accuracy. They extract key facts, legal issues, holdings, and reasoning from legal cases. However, we always recommend reviewing AI-generated content for your specific needs and context."
                },
                {
                  question: "Can I use this for Bar exam preparation?",
                  answer: "Absolutely! Many of our users use LegalAid for Bar exam preparation. Our tools can help you create study materials, practice with flashcards, and review case law efficiently, making your bar prep more effective."
                },
                {
                  question: "Do I need to install any software?",
                  answer: "No, LegalAid is entirely web-based. You can access all features through your browser on any device - laptop, tablet, or smartphone, without needing to install anything."
                },
                {
                  question: "Is my data secure and private?",
                  answer: "We take data security very seriously. All your uploads and generated content are encrypted and stored securely. We never share your content with third parties, and you retain ownership of all your materials."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. There are no long-term commitments, and we offer a 14-day money-back guarantee on all paid plans."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-4"
                >
                  <div className="bg-card border border-border/40 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-12 border border-primary/20"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Legal Studies?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of law students who are already studying smarter, not harder.
              </p>
              <Button size="lg" onClick={handleGetStarted} className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">No credit card required for free plan</p>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-card/30 border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
                  <span className="text-primary font-bold">L</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
              </div>
              <p className="text-muted-foreground mb-4">
                Revolutionizing legal education with AI-powered study tools.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Case Law Database</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Support</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 LegalAid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
