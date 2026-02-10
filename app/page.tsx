import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import Link from "next/dist/client/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import  faqs  from "@/data/faqs.json";
import CompanyCarousel from "@/components/company-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



export default function Home() {

    const features = [
    {
      title: "Intuitive Kanban Boards",
      description:
        "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
      icon: Layout,
    },
    {
      title: "Powerful Sprint Planning",
      description:
        "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
      icon: Calendar,
    },
    {
      title: "Comprehensive Reporting",
      description:
        "Gain insights into your team's performance with detailed, customizable reports and analytics.",
      icon: BarChart,
    },
  ];

  return (
    <div className="min-h-screen">
    <section className="relative min-h-screen flex items-center justify-center text-center">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
          Stop managing chaos.
          <br />
          Start executing with{" "}
          <span className="text-[#0A5BFF] tracking-[0.25em]">
            KIRO
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Sprint-based project management built for fast teams.
          No workflows. No bloat. Just execution.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <Link href="/onboarding">
            <Button size="lg" className="px-10 bg-[#0A5BFF] hover:bg-[#1F6CFF]">
              Get Started
            </Button>
          </Link>

          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="px-10 border-white/20 text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>


      
      {/* key features section */}

      {/* <section id="features" className="bg-gray-900 py-20 px-5 container mx-auto">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}
      <section id="features" className="py-32">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-16 text-center">
            Features
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-[#0B1220] border border-[#111827] rounded-xl"
              >
                <CardContent className="pt-10">
                  <feature.icon className="h-10 w-10 mb-6 text-[#0A5BFF]" />
                  <h4 className="text-xl font-semibold mb-3">
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


      {/* companies carousel */}
      {/* <section className="py-20 container mx-auto">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Trusted by Industry Leaders</h3>
            <CompanyCarousel/>
        </div>
      </section> */}

      {/* faqs section */}
      <section className=" py-20 px-5 container mx-auto">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6">
            Built for teams that ship.
          </h3>
              <p className="text-lg text-[#9AA4B2] mb-12 max-w-xl mx-auto">
                KIRO removes friction so your team can focus on execution.
              </p>
            <Link href="/onboarding">
              <Button className="px-10" size="lg">
                Start for free<ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </Link>
        </div>
      </section>


    </div>
  );
}
    