import { motion } from "framer-motion";
import { Wrench, BarChart3, Layers } from "lucide-react";

const addons = [
  {
    icon: Wrench,
    title: "Done-For-You Workflow Setup",
    description: "Our automation experts build your entire workflow system from scratch. Perfect for businesses that want to hit the ground running.",
    price: "$500",
    priceNote: "one-time",
    features: ["Full workflow audit", "Custom automation design", "3 workflows included", "1-on-1 strategy call"],
  },
  {
    icon: BarChart3,
    title: "Advanced Monitoring & Analytics",
    description: "Get deep insights into your automation performance with real-time dashboards and custom reports.",
    price: "$99",
    priceNote: "/month",
    features: ["Real-time dashboards", "Custom reports", "Anomaly detection", "Performance alerts"],
  },
  {
    icon: Layers,
    title: "Automation Scaling Pack",
    description: "Unlock additional capacity and priority execution for high-volume automation needs.",
    price: "$199",
    priceNote: "/month",
    features: ["+200,000 runs/month", "Priority execution queue", "Dedicated resources", "99.99% uptime SLA"],
  },
];

const AddOnsSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display-bold text-foreground mb-3">
            Add-ons
          </h2>
          <p className="text-foreground/50">
            Enhance your automation power
          </p>
        </motion.div>

        {/* Vertical Cards */}
        <div className="space-y-6 max-w-3xl">
          {addons.map((addon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 8, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl bg-[#111]/60 border border-white/5 p-6 md:p-8 overflow-hidden cursor-pointer"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
              </div>

              {/* Glowing border on hover */}
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all">
                  <addon.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                    <h3 className="text-xl font-display text-foreground">{addon.title}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-display-bold text-foreground">{addon.price}</span>
                      <span className="text-foreground/40 text-sm ml-1">{addon.priceNote}</span>
                    </div>
                  </div>
                  <p className="text-foreground/50 mb-4">{addon.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {addon.features.map((feature, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 text-xs text-foreground/60 bg-white/5 rounded-full border border-white/5"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;