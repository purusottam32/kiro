import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Calendar, Layout } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import faqs from "@/data/faqs.json";
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
        "Visualize your workflow and optimize team productivity with simple, fast Kanban boards.",
      icon: Layout,
    },
    {
      title: "Powerful Sprint Planning",
      description:
        "Plan and execute sprints with clarity. No workflows. No configuration.",
      icon: Calendar,
    },
    {
      title: "Comprehensive Reporting",
      description:
        "Track progress and execution velocity with clean, actionable insights.",
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
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-10">
        <div className="container mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
            Stop managing chaos.
            <br />
            Start executing with{" "}
            <span className="bg-linear-to-r from-[#0A5BFF] to-[#3B82F6] bg-clip-text text-transparent tracking-[0.15em] sm:tracking-[0.25em]">
              KIRO
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Sprint-based project management built for fast teams.
            No workflows. No bloat. Just execution.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button className="w-full sm:w-auto px-10 bg-[#0A5BFF] hover:bg-[#1F6CFF]">
                Get Started
              </Button>
            </Link>

            <Link href="#features">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-10 border-white/20 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="py-24 sm:py-32 border-t border-white/10 px-4"
      >
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-16 text-center">
            Features
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-[#0B1220] border border-[#111827] rounded-xl"
              >
                <CardContent className="pt-8 sm:pt-10">
                  <feature.icon className="h-10 w-10 mb-6 text-[#0A5BFF]" />
                  <h4 className="text-lg sm:text-xl font-semibold mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-[#9AA4B2] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            Frequently Asked Questions
          </h3>

          <Accordion
            type="single"
            collapsible
            className="max-w-full sm:max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">
            Built for teams that ship.
          </h3>
          <p className="text-base sm:text-lg text-[#9AA4B2] mb-10 max-w-xl mx-auto">
            KIRO removes friction so your team can focus on execution.
          </p>

          <Link href="/onboarding">
            <Button size="lg" className="px-10">
              Start for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
