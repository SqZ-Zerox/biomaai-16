
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
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
  ];

  return (
    <section className="py-20" id="testimonials">
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
          {testimonials.map((testimonial, index) => (
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
  );
};

export default TestimonialsSection;
