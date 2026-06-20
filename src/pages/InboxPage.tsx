import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CONVERSATIONS, type Conversation, type Message } from "@/data/conversations";

export function InboxPage() {
  const [conversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const activeConversation = conversations.find((c) => c.id === activeId);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const showList = !isMobile || !activeId;
  const showChat = !isMobile || !!activeId;

  return (
    <div className="max-w-5xl mx-auto h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-8rem)]">
      <div className="flex h-full border border-lm-border-light rounded-xl overflow-hidden bg-white">
        {/* Conversation List */}
        {showList && (
          <div className={`${isMobile && activeId ? "hidden" : "w-full"} lg:w-80 border-r border-lm-border-light flex flex-col`}>
            <div className="p-4 border-b border-lm-border-light">
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 hover:bg-lm-bg-warm transition-colors text-left ${
                    activeId === conv.id ? "bg-lm-bg-warm" : ""
                  }`}
                >
                  <img
                    src={conv.listingImage}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-lm-text-primary truncate">{conv.listingTitle}</p>
                    <p className="text-xs text-lm-text-secondary truncate mt-0.5">
                      {conv.messages[conv.messages.length - 1].content}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-lm-text-muted">
                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-lm-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-3 border-b border-lm-border-light">
                  {isMobile && (
                    <button onClick={() => setActiveId(null)} className="p-1 rounded-full hover:bg-lm-bg-warm">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <img
                    src={activeConversation.listingImage}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activeConversation.listingTitle}</p>
                    <p className="text-xs text-lm-text-muted">
                      {activeConversation.otherUser.name} · £{activeConversation.listingPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {activeConversation.messages.map((msg: Message) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.senderId === "buyer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                            msg.senderId === "buyer"
                              ? "bg-lm-orange text-white rounded-br-md"
                              : "bg-lm-bg-warm text-lm-text-primary border border-lm-border-light rounded-bl-md"
                          }`}
                        >
                          {msg.type === "offer" ? (
                            <div>
                              <p className="text-xs opacity-80 mb-1">Offer</p>
                              <p className="text-xl font-bold">£{msg.offerAmount?.toLocaleString()}</p>
                            </div>
                          ) : (
                            <p className="text-sm">{msg.content}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div className="p-3 border-t border-lm-border-light">
                  <div className="flex items-end gap-2">
                    <button className="p-2 rounded-full hover:bg-lm-bg-warm transition-colors shrink-0">
                      <Image className="w-5 h-5 text-lm-text-secondary" />
                    </button>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="flex-1 min-h-[40px] max-h-24 px-3 py-2 bg-lm-bg-warm rounded-full border border-lm-border-light focus:border-lm-orange outline-none text-sm resize-none transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          setMessageText("");
                        }
                      }}
                    />
                    <button
                      onClick={() => setMessageText("")}
                      className="w-10 h-10 rounded-full bg-lm-orange text-white flex items-center justify-center hover:bg-lm-orange-hover transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-lm-bg-warm flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-lm-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-lm-text-primary mb-1">No messages yet</h3>
                <p className="text-sm text-lm-text-secondary">Start browsing to find something you like!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
