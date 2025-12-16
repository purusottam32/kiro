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
      <section className="container mx-auto py-20 text-center ">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline your workflow
          <span className="flex items-center justify-center gap-2">
            with{" "}
            <Image
                  src={'./logo.svg'}
                  alt="logo"
                  width={480}
                  height={160}
                  className="h-30 items-center sm:h-30 md:h-48 w-auto"
                />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">Empower your team with our amazing project management system.</p>
        <Link href="/onboarding">
          <Button size="lg" className="mr-4">
            Get Started <ChevronRight size={18}/>
          </Button>
        </Link>  
        <Link href="#features">
          <Button size="lg" variant="outline" className="mr-4">
            Learn More 
          </Button>
        </Link>
      </section>
      
      {/* key features section */}

      <section id="features" className="bg-gray-900 py-20 px-5 container mx-auto">
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
      </section>

      {/* companies carousel */}
      <section className="py-20 container mx-auto">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Trusted by Industry Leaders</h3>
            <CompanyCarousel/>
        </div>
      </section>

      {/* faqs section */}
      <section className="bg-gray-900 py-20 px-5 container mx-auto">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full ">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6">Experience the difference today!</h3>
            <p className="text-xl mb-12">
              Join thousands of teams worldwide who already using kiro to boost their productivity and streamline their workflows.
            </p>
            <Link href="/onboarding">
              <Button className="animate-bounce">
                Start for free<ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </Link>
        </div>
      </section>


    </div>
  );
}
    