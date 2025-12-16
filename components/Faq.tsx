import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  heading?: string;
  items?: FaqItem[];
}

const defaultItems: FaqItem[] = [
  {
    question: "What is this product?",
    answer:
      "This product helps teams manage projects efficiently using Kanban boards, sprint planning, and reporting tools.",
  },
  {
    question: "Is this suitable for small teams?",
    answer:
      "Yes, it works great for both small teams and large organizations.",
  },
  {
    question: "Does it support analytics?",
    answer:
      "Yes, you get detailed reports and insights into your team’s performance.",
  },
];

const Faq = ({
  heading = "Frequently Asked Questions",
  items = defaultItems,
}: FaqProps) => {
  return (
    <section className="py-16 bg-[#141413]">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-gray-50 md:text-5xl">
          {heading}
        </h1>

        {/* Accordion */}
        <div className="mt-10 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-zinc-700 rounded-lg bg-zinc-900"
              >
                <AccordionTrigger className="p-4 text-lg font-medium text-gray-100 hover:text-gray-300">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="p-4 text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
