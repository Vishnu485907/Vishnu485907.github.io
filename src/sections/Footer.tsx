import { Link } from "react-router";
import CredfixLogo from "@/components/CredfixLogo";

const footerLinks = {
  Products: ["Loan Optimizer", "EMI Calculator", "Savings Planner", "Debt Tracker"],
  Learn: ["Blog", "Guides", "RBI Guidelines", "Financial Tips"],
  Company: ["About Us", "Careers", "Press", "Partners"],
  Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer className="bg-pitch-black text-white font-primary py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="mb-4 inline-flex rounded-2xl bg-white px-4 py-3">
              <CredfixLogo className="h-7" />
            </div>
            <p className="text-sm text-neutral-400 max-w-xs mb-6">
              Empowering Indian professionals with smart financial planning
              tools. Take control of your loans, optimize your savings, and
              build a better financial future.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-brand-orange text-white rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Credfix. All rights reserved.
          </p>
          <p className="text-[11px] text-neutral-700 max-w-md text-center sm:text-right">
            This is an illustrative financial estimate. Actual outcomes depend
            on lender policies and individual credit profile.
          </p>
        </div>
      </div>
    </footer>
  );
}
