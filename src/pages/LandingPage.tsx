
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Scale, 
  MessageSquare, 
  CheckCircle,
  Award,
  FileText,
  User,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/90 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
              <span className="text-primary font-bold">L</span>
            </div>
            <h1 className="text-xl font-bold">Legal<span className="text-primary">Aid</span></h1>
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
            <Button variant="outline" size="sm" className="ml-2" onClick={() => navigate("/login")}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="ml-2" onClick={() => navigate("/login")}>
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
        <section className="relative pt-32 pb-20 overflow-hidden" id="hero">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl" />
            <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl" />
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
                    Revolutionize Your <span className="text-primary">Legal Studies</span>
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                    Boost your legal education with AI-powered tools for case briefs, research assistance, and study planning.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button size="lg" onClick={handleGetStarted} className="gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
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
                    className="relative rounded-xl shadow-xl border border-border/30 w-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-muted/20" id="features">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Powerful Legal Study Tools</h2>
              <p className="text-lg text-muted-foreground">
                Our comprehensive suite of features is designed to optimize your legal studies workflow.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Scale className="h-6 w-6 text-primary" />,
                  title: "AI Case Brief Generator",
                  description: "Generate comprehensive case briefs with facts, issues, holdings, and analysis in seconds."
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-primary" />,
                  title: "Legal Research Assistant",
                  description: "Chat with an AI tutor that understands legal concepts and can explain complex topics."
                },
                {
                  icon: <FileText className="h-6 w-6 text-primary" />,
                  title: "Citation Tool",
                  description: "Generate perfect Bluebook citations for any source with our intuitive citation tool."
                },
                {
                  icon: <BookOpen className="h-6 w-6 text-primary" />,
                  title: "Flashcards & Quizzes",
                  description: "Create and study with interactive flashcards tailored to your courses and exams."
                },
                {
                  icon: <Award className="h-6 w-6 text-primary" />,
                  title: "Progress Tracking",
                  description: "Monitor your study habits, track progress, and identify areas for improvement."
                },
                {
                  icon: <FileText className="h-6 w-6 text-primary" />,
                  title: "Essay Assistance",
                  description: "Get guidance on structuring legal arguments and improving your legal writing."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border/30 p-6 rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20" id="testimonials">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">What Law Students Say</h2>
              <p className="text-lg text-muted-foreground">
                Hear from students who have transformed their legal studies with our platform.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  quote: "As a 1L, I was struggling with legal writing until I found LegalAid. The essay assistance has improved my grades dramatically.",
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
                  className="bg-card border border-border/30 p-6 rounded-xl shadow-sm"
                >
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-20 bg-muted/20" id="pricing">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
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
                      ? "bg-card border-2 border-primary/30 shadow-lg" 
                      : "bg-card border border-border/30"
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
                        className={`w-full ${plan.popular ? "bg-primary" : ""}`}
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
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center bg-primary/5 rounded-2xl p-12 border border-primary/20"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Legal Studies?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of law students who are already studying smarter, not harder.
              </p>
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">No credit card required for free plan</p>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-card/30 border-t border-border/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
                  <span className="text-primary font-bold">L</span>
                </div>
                <h1 className="text-xl font-bold">Legal<span className="text-primary">Aid</span></h1>
              </div>
              <p className="text-muted-foreground mb-4">
                Revolutionizing legal education with AI-powered study tools.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/20 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 LegalAid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
