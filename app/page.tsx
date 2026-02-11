import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Calendar, Layout, Star, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import faqs from "@/data/faqs.json";
import CompanyCarousel from "@/components/company-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const features = [
    {
      title: "Intuitive Kanban Boards",
      description:
        "Visualize your workflow and optimize team productivity with simple, fast Kanban boards. Drag, drop, and ship.",
      icon: Layout,
    },
    {
      title: "Powerful Sprint Planning",
      description:
        "Plan and execute sprints with clarity. Set goals, track progress, and celebrate wins together.",
      icon: Calendar,
    },
    {
      title: "Comprehensive Reporting",
      description:
        "Track progress and execution velocity with clean, actionable insights. Data-driven decisions made simple.",
      icon: BarChart,
    },
    {
      title: "Team Collaboration",
      description:
        "Keep everyone aligned with real-time updates, comments, and notifications. No more scattered conversations.",
      icon: Users,
    },
    {
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and workflows so your team can focus on what matters—shipping great work.",
      icon: Zap,
    },
    {
      title: "Built for Scale",
      description:
        "From startups to enterprises, KIRO grows with your team. Reliable infrastructure built for high performance.",
      icon: BarChart,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* GLOBAL BACKGROUND GRADIENT */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000 40%, rgba(10,91,255,0.35) 100%)",
          }}
        />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-0 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute  left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] mb-6 -mt-20 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">Stop managing</span>
            <br />
            <span className="text-white">chaos. Start</span>
            <br />
            <span className="bg-linear-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-glow">
              executing
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-in" style={{ animationDelay: '0.2s' }}>
            Sprint-based project management built for teams that ship.
            <span className="block mt-2 text-slate-400 text-base">No workflows. No bloat. Just execution.</span>
          </p>

          {/* Stats Section */}
          {/* <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mb-10 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 hover:border-blue-500/30 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">500+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-2">Active Teams</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 hover:border-blue-500/30 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">10K+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-2">Projects Tracked</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 hover:border-blue-500/30 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">99.9%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-2">Uptime</div>
            </div>
          </div> */}

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/onboarding">
              <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-10 py-6 text-base font-semibold border-2 border-slate-600 text-white hover:bg-slate-700/50 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Features Quick Preview */}
          {/* <div className="mt-16 flex flex-wrap gap-3 justify-center animate-slide-in" style={{ animationDelay: '0.5s' }}>
            {['📊 Real-time Analytics', '🚀 Sprint Management', '👥 Team Collaboration'].map((feature, index) => (
              <div key={index} className="px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-full text-sm text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-default">
                {feature}
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* TRUSTED BY COMPANIES */}
      {/* <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900/70 border-t border-white/5">
        <div className="container mx-auto">
          <h3 className="text-center text-sm sm:text-base font-semibold text-slate-400 mb-8">
            TRUSTED BY LEADING TEAMS
          </h3>
          <CompanyCarousel />
        </div>
      </section> */}

      {/* FEATURES */}
      <section
        id="features"
        className="py-24 sm:py-32 border-t border-white/10 px-4 bg-gradient-to-b from-slate-950 to-slate-900/50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-down">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage sprints, track progress, and keep your team aligned.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-900/30 to-slate-950/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors mb-4">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      {/* <section className="py-24 sm:py-32 px-4 bg-gradient-to-b from-slate-900/50 to-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-down">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See what industry leaders are saying about KIRO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                quote: "KIRO transformed how our team manages projects. The simplicity is refreshing.",
                author: "Sarah Johnson",
                role: "Engineering Lead at TechCorp",
                rating: 5,
              },
              {
                quote: "Finally, a project management tool that doesn't get in the way. We ship faster.",
                author: "Mike Chen",
                role: "CEO at StartupXYZ",
                rating: 5,
              },
              {
                quote: "No more bloated workflows. Just pure execution. Our team loves it.",
                author: "Emma Rodriguez",
                role: "Product Manager at InnovateCo",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-200 mb-4 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-slate-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-slide-down">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Everything you need to know about KIRO
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-slate-700/50 hover:border-blue-500/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AccordionTrigger className="text-left text-white hover:text-blue-300 transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-32 text-center px-4 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-down">
            Built for teams that
            <br />
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ship
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-down" style={{ animationDelay: '0.1s' }}>
            KIRO removes friction from your workflow so your team can focus on what matters—execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-down" style={{ animationDelay: '0.2s' }}>
            <Link href="/onboarding">
              <Button size="lg" className="px-12 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* <Link href="/onboarding">
              <Button size="lg" variant="outline" className="px-12 py-6 text-base font-semibold border-2 border-slate-600 hover:border-blue-500 hover:bg-slate-700/30 transition-all duration-300 hover:scale-105">
                Schedule Demo
              </Button>
            </Link> */}
          </div>

         
        </div>
      </section>
    </div>
  );
}
