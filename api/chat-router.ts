import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

const responses = [
  "Based on your financial profile, I recommend focusing on building an emergency fund of 3-6 months' expenses before aggressively paying down debt. This creates a safety net that prevents new borrowing during unexpected situations.",
  "Have you considered the debt avalanche method? Focus on paying off the highest-interest loan first while making minimum payments on others. This minimizes total interest paid over time.",
  "Your EMI-to-income ratio is a key metric. Financial advisors typically recommend keeping total EMIs below 40% of your monthly income. If you're above this threshold, consider debt consolidation.",
  "Building consistent savings habits, even small amounts, can significantly improve your credit score over time. Lenders view disciplined savers as lower-risk borrowers.",
  "Consider setting up automatic transfers to a separate savings account on your salary date. This 'pay yourself first' approach ensures savings happen before discretionary spending.",
  "Prepaying your loan when you have surplus funds can substantially reduce total interest. Even one extra EMI per year can shorten your tenure by several months.",
  "Have you explored balance transfer options? Moving high-interest debt to a lower-rate facility can reduce your monthly burden while maintaining the same repayment pace.",
  "Tracking your expenses for just 30 days often reveals surprising spending patterns. Many users find they're spending 15-20% more than estimated on non-essential items.",
  "A well-structured financial plan addresses four pillars: debt management, emergency savings, retirement planning, and goal-based investing. Which area would you like to explore first?",
  "Remember: loan optimization isn't just about lowering EMIs. It's about aligning your debt structure with your life goals and cash flow patterns.",
];

export const chatRouter = createRouter({
  send: publicQuery
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const lowerMsg = input.message.toLowerCase();
      let responseIndex = Math.floor(Math.random() * responses.length);

      if (lowerMsg.includes("emi") || lowerMsg.includes("payment")) {
        responseIndex = 2;
      } else if (lowerMsg.includes("save") || lowerMsg.includes("saving")) {
        responseIndex = 4;
      } else if (lowerMsg.includes("interest") || lowerMsg.includes("rate")) {
        responseIndex = 1;
      } else if (lowerMsg.includes("plan") || lowerMsg.includes("budget")) {
        responseIndex = 8;
      } else if (lowerMsg.includes("prepay") || lowerMsg.includes("extra")) {
        responseIndex = 5;
      }

      return { response: responses[responseIndex] };
    }),
});
