import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calculator as CalcIcon,
  ChevronRight,
  PiggyBank,
  Smartphone,
  TrendingDown,
  Wallet,
} from "lucide-react";
import CredfixDownloadModal from "@/components/CredfixDownloadModal";
import { useCredfixDownload } from "@/hooks/useCredfixDownload";
import { cn } from "@/lib/utils";

type CalculatorProps = {
  className?: string;
  embedded?: boolean;
  id?: string;
  showHeader?: boolean;
};

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `\u20B9${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `\u20B9${(amount / 100000).toFixed(2)} Lakh`;
  if (amount >= 1000) return `\u20B9${amount.toLocaleString("en-IN")}`;
  return `\u20B9${amount.toFixed(0)}`;
}

export default function Calculator({
  className,
  embedded = false,
  id = "calculator",
  showHeader = true,
}: CalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [emi, setEmi] = useState(15000);
  const [monthlySalary, setMonthlySalary] = useState(50000);
  const [savingsPercent, setSavingsPercent] = useState(20);
  const [timeDuration, setTimeDuration] = useState<3 | 6 | 12>(6);
  const { handleDownloadClick, showDownloadModal, setShowDownloadModal } =
    useCredfixDownload();

  const monthlyInterestRate = interestRate / 12 / 100;

  const currentTenureMonths = useMemo(() => {
    if (emi <= 0 || monthlyInterestRate <= 0) return 0;
    const n =
      -Math.log(1 - (loanAmount * monthlyInterestRate) / emi) /
      Math.log(1 + monthlyInterestRate);
    return Math.ceil(n);
  }, [loanAmount, monthlyInterestRate, emi]);

  const totalInterestCurrent = useMemo(() => {
    return emi * currentTenureMonths - loanAmount;
  }, [emi, currentTenureMonths, loanAmount]);

  const monthlySavings = useMemo(() => {
    return (monthlySalary * savingsPercent) / 100;
  }, [monthlySalary, savingsPercent]);

  const accumulatedSavings = useMemo(() => {
    return monthlySavings * timeDuration;
  }, [monthlySavings, timeDuration]);

  const improvedScenario = useMemo(() => {
    const extraPayment = monthlySavings * 0.7;
    const newEmi = emi + extraPayment;
    if (newEmi <= 0 || monthlyInterestRate <= 0) return null;

    const newTenure =
      -Math.log(1 - (loanAmount * monthlyInterestRate) / newEmi) /
      Math.log(1 + monthlyInterestRate);
    const newTenureMonths = Math.ceil(newTenure);
    const newTotalInterest = newEmi * newTenureMonths - loanAmount;
    const interestSaved = totalInterestCurrent - newTotalInterest;
    const monthsSaved = currentTenureMonths - newTenureMonths;

    return {
      newEmi,
      newTenureMonths,
      newTotalInterest,
      interestSaved,
      monthsSaved,
    };
  }, [
    loanAmount,
    monthlyInterestRate,
    emi,
    monthlySavings,
    currentTenureMonths,
    totalInterestCurrent,
  ]);

  const content = (
    <>
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-1.5">
            <CalcIcon size={14} className="text-brand-orange" />
            <span className="text-sm font-medium text-brand-orange">
              Salary-to-Loan Optimizer
            </span>
          </div>
          <h2
            className="font-serif text-pitch-black"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1 }}
          >
            Understand Your <span className="italic">True</span> Loan Cost
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-600 sm:text-base">
            Enter your loan details and see how disciplined savings can improve
            your repayment capability.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl bg-[#f5f5f5] p-5 sm:p-6 lg:p-7"
        >
          <div className="mb-6 flex items-center gap-2">
            <CalcIcon size={18} className="text-brand-orange" />
            <h3 className="text-lg font-semibold text-pitch-black">
              Your Financial Profile
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex justify-between text-sm text-neutral-700">
                Loan Amount
                <span className="font-medium text-pitch-black">
                  {formatCurrency(loanAmount)}
                </span>
              </label>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
                <span>\u20B91L</span>
                <span>\u20B950L</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex justify-between text-sm text-neutral-700">
                Interest Rate (p.a.)
                <span className="font-medium text-pitch-black">
                  {interestRate}%
                </span>
              </label>
              <input
                type="range"
                min={5}
                max={24}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
                <span>5%</span>
                <span>24%</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex justify-between text-sm text-neutral-700">
                Monthly EMI
                <span className="font-medium text-pitch-black">
                  {formatCurrency(emi)}
                </span>
              </label>
              <input
                type="range"
                min={5000}
                max={100000}
                step={1000}
                value={emi}
                onChange={(e) => setEmi(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
            </div>

            <div>
              <label className="mb-1.5 flex justify-between text-sm text-neutral-700">
                Monthly Salary
                <span className="font-medium text-pitch-black">
                  {formatCurrency(monthlySalary)}
                </span>
              </label>
              <input
                type="range"
                min={15000}
                max={500000}
                step={5000}
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
            </div>

            <div>
              <label className="mb-1.5 flex justify-between text-sm text-neutral-700">
                % of Salary Saved
                <span className="font-medium text-brand-orange">
                  {savingsPercent}%
                </span>
              </label>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-neutral-700">
                Savings Duration
              </label>
              <div className="flex gap-2">
                {[3, 6, 12].map((months) => (
                  <button
                    key={months}
                    onClick={() => setTimeDuration(months as 3 | 6 | 12)}
                    className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
                      timeDuration === months
                        ? "bg-brand-orange text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="rounded-3xl bg-pitch-black p-5 text-white sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingDown size={18} className="text-brand-orange" />
              <h4 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
                Current Scenario
              </h4>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-[11px] text-neutral-500">
                  Total Interest
                </p>
                <p className="text-xl font-semibold text-brand-orange">
                  {formatCurrency(totalInterestCurrent)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[11px] text-neutral-500">
                  Loan Tenure
                </p>
                <p className="text-xl font-semibold">
                  {Math.ceil(currentTenureMonths / 12)} years{" "}
                  {currentTenureMonths % 12} months
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-neutral-300">
                You are paying{" "}
                <span className="font-semibold text-brand-orange">
                  {formatCurrency(totalInterestCurrent)}
                </span>{" "}
                in interest over time.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#f5f5f5] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <PiggyBank size={18} className="text-brand-orange" />
              <h4 className="text-sm font-medium uppercase tracking-wider text-neutral-600">
                Savings Accumulated
              </h4>
            </div>
            <p className="mb-1 text-3xl font-semibold text-pitch-black">
              {formatCurrency(accumulatedSavings)}
            </p>
            <p className="text-sm text-neutral-600">
              With consistent savings of {savingsPercent}% of salary, you build{" "}
              <span className="font-semibold text-brand-orange">
                {formatCurrency(accumulatedSavings)}
              </span>{" "}
              in {timeDuration} months.
            </p>
          </div>

          {improvedScenario && (
            <div className="rounded-3xl border border-brand-orange/20 bg-brand-orange/10 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Wallet size={18} className="text-brand-orange" />
                <h4 className="text-sm font-medium uppercase tracking-wider text-brand-orange">
                  With Better Discipline
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">
                    Interest Saved
                  </span>
                  <span className="text-sm font-semibold text-brand-orange">
                    {formatCurrency(improvedScenario.interestSaved)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Months Saved</span>
                  <span className="text-sm font-semibold text-pitch-black">
                    {improvedScenario.monthsSaved} months
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-neutral-700">
                Better financial planning can reduce your loan burden faster.
                Consistent savings enable earlier repayment, reducing total
                interest outgo.
              </p>
            </div>
          )}

          <button
            onClick={handleDownloadClick}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Smartphone size={16} />
            Download Credfix
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <div className="flex items-start gap-2 text-[11px] text-neutral-400">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <p>
              This is an illustrative financial estimate. Actual outcomes depend
              on lender policies and individual credit profile. This tool is for
              educational and planning purposes only.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div id={id} className={cn("w-full scroll-mt-28 font-primary", className)}>
        {content}
        <CredfixDownloadModal
          open={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
        />
      </div>
    );
  }

  return (
    <section
      id={id}
      className={cn("bg-white py-20 sm:py-28 scroll-mt-28 font-primary", className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {content}
        <CredfixDownloadModal
          open={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
        />
      </div>
    </section>
  );
}
