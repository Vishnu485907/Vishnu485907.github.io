import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { Send, MessageSquare, User, Mail, Phone, FileText, AlertTriangle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Community() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [messageForm, setMessageForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { isAdmin } = useAuth();

  const utils = trpc.useUtils();

  const { data: messages, isLoading: messagesLoading } =
    trpc.message.list.useQuery();

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  const messageMutation = trpc.message.create.useMutation({
    onSuccess: () => {
      utils.message.list.invalidate();
      setMessageForm({ name: "", email: "", content: "" });
    },
  });

  const deleteMessageMutation = trpc.message.delete.useMutation({
    onSuccess: () => {
      utils.message.list.invalidate();
    },
  });

  return (
    <section id="community" className="py-24 sm:py-32 bg-[#f5f5f5] font-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-orange text-sm font-medium uppercase tracking-wider">
            Connect With Us
          </span>
          <h2
            className="font-serif text-pitch-black mt-3"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1 }}
          >
            Community <span className="italic">Hub</span>
          </h2>
          <p className="mt-4 text-neutral-600 max-w-lg mx-auto text-sm">
            Have questions or want to share your experience? We are here to
            help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leave a Message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Mail size={18} className="text-brand-orange" />
              <h3 className="text-lg font-semibold text-pitch-black">
                Leave a Message
              </h3>
            </div>

            {submitted ? (
              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Send size={20} className="text-green-600" />
                </div>
                <p className="text-green-700 font-medium">Message sent!</p>
                <p className="text-green-600 text-sm mt-1">
                  We will get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  contactMutation.mutate(contactForm);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-neutral-700 mb-1.5">
                    <User size={14} />
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-neutral-700 mb-1.5">
                    <Mail size={14} />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-neutral-700 mb-1.5">
                    <Phone size={14} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm text-neutral-700 mb-1.5">
                    <FileText size={14} />
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-brand-orange text-white rounded-full py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}

            <div className="flex items-start gap-2 mt-4 text-[11px] text-neutral-400">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              <p>
                This is an illustrative financial estimate. Actual outcomes
                depend on lender policies and individual credit profile.
              </p>
            </div>
          </motion.div>

          {/* The Hangout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-pitch-black rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-brand-orange" />
              <h3 className="text-lg font-semibold text-white">The Hangout</h3>
              <span className="ml-auto text-[11px] text-neutral-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>

            {/* Post Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                messageMutation.mutate(messageForm);
              }}
              className="flex flex-col gap-3 mb-6 pb-6 border-b border-white/10"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={messageForm.name}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-orange/30"
                />
                <input
                  type="email"
                  required
                  value={messageForm.email}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, email: e.target.value })
                  }
                  placeholder="Email"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-orange/30"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={messageForm.content}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, content: e.target.value })
                  }
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-orange/30"
                />
                <button
                  type="submit"
                  disabled={messageMutation.isPending}
                  className="bg-brand-orange text-white rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>

            {/* Messages Feed */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {messagesLoading ? (
                <div className="text-neutral-500 text-sm text-center py-8">
                  Loading messages...
                </div>
              ) : messages && messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white/5 rounded-xl p-3 border border-white/5 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-brand-orange">
                        {msg.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-600 font-mono">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              deleteMessageMutation.mutate({ id: msg.id })
                            }
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-neutral-600 text-sm text-center py-8">
                  No messages yet. Be the first to share!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
