import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  Users,
  Mail,
  MessageSquare,
  Shield,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import CredfixLogo from "@/components/CredfixLogo";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const { data: stats } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: contacts } = trpc.contact.list.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: messages } = trpc.message.list.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: allUsers } = trpc.admin.users.useQuery(undefined, {
    enabled: isAdmin,
  });

  const utils = trpc.useUtils();

  const deleteContactMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const deleteMessageMutation = trpc.message.delete.useMutation({
    onSuccess: () => {
      utils.message.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ededed]">
        <Loader2 size={32} className="animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const statCards = [
    {
      label: "OAuth Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Local Users",
      value: stats?.totalLocalUsers ?? 0,
      icon: Shield,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Contact Submissions",
      value: stats?.totalContacts ?? 0,
      icon: Mail,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Community Messages",
      value: stats?.totalMessages ?? 0,
      icon: MessageSquare,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#ededed] font-primary">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-neutral-600 hover:text-pitch-black transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <CredfixLogo className="h-7 sm:h-8" />
              <span className="text-neutral-400">|</span>
              <span className="text-sm text-neutral-600">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">{user?.name || "Admin"}</span>
            <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Shield size={16} className="text-brand-orange" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-5 border border-neutral-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-500">{card.label}</span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-pitch-black">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-pitch-black">
              All Users
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Combined list of OAuth and local authentication users
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Source
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((u, idx) => (
                    <tr
                      key={`${u.source}-${u.id}-${idx}`}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-pitch-black font-medium">
                        {u.name}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{u.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            u.source === "oauth"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {u.source}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            u.role === "admin"
                              ? "bg-brand-orange/10 text-brand-orange"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-neutral-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-pitch-black">
              Leave a Message Submissions
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Contact form entries from the Community Hub
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Phone
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Message
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-neutral-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts && contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-pitch-black font-medium">
                        {contact.name}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {contact.email}
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {contact.phone || "—"}
                      </td>
                      <td className="px-5 py-3 text-neutral-600 max-w-xs truncate">
                        {contact.message}
                      </td>
                      <td className="px-5 py-3 text-neutral-500 text-xs whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() =>
                            deleteContactMutation.mutate({ id: contact.id })
                          }
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-neutral-400"
                    >
                      No submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-pitch-black">
              The Hangout Messages
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Community board posts
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Content
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-neutral-600">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-neutral-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages && messages.length > 0 ? (
                  messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-brand-orange font-medium">
                        {msg.name}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {msg.email}
                      </td>
                      <td className="px-5 py-3 text-neutral-600 max-w-xs truncate">
                        {msg.content}
                      </td>
                      <td className="px-5 py-3 text-neutral-500 text-xs whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() =>
                            deleteMessageMutation.mutate({ id: msg.id })
                          }
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-neutral-400"
                    >
                      No messages yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
