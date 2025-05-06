
import React from "react";
import { Dna } from "lucide-react";

const LandingFooter: React.FC = () => {
  return (
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
              Revolutionizing personal health optimization with AI-powered lab test analysis and future genetic insights.
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
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Genetic Analysis</a></li>
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
  );
};

export default LandingFooter;
