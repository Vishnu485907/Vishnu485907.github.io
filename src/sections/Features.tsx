import { motion } from "framer-motion";
import { TrendingDown, Percent, Receipt, Phone } from "lucide-react";

const features = [
  {
    icon: TrendingDown,
    title: "Lower your payments",
    description:
      "Explore options to restructure your EMIs based on your current salary and savings capacity. Find a repayment plan that fits your budget without compromising on essentials.",
  },
  {
    icon: Percent,
    title: "Reduce interest rates",
    description:
      "Understand how improving your credit profile and financial discipline can help you negotiate better interest rates with your existing or new lenders.",
  },
  {
    icon: Receipt,
    title: "Waive late fees",
    description:
      "Learn about RBI guidelines on late payment charges and how consistent repayment behavior can help you avoid or reduce penalty fees over time.",
  },
  {
    icon: Phone,
    title: "Stop collection calls",
    description:
      "Get guidance on your rights as a borrower and how proactive communication with lenders can reduce collection-related stress.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-off-black font-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-orange text-sm font-medium uppercase tracking-wider">
            What We Help With
          </span>
          <h2
            className="font-serif text-white mt-3"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1 }}
          >
            The Debt <span className="italic">Matrix</span>
          </h2>
          <p className="mt-4 text-neutral-400 max-w-lg mx-auto text-sm">
            Four key areas where better financial planning can make a real
            difference in your loan journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 perspective-[1000px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60, rotateZ: index % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-5 group-hover:bg-brand-orange/20 transition-colors">
                  <Icon size={22} className="text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-brand-orange text-sm font-medium hover:underline"
          >
            View All Services
            <span className="text-lg">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
