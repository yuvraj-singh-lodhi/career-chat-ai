"use client";

import * as React from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function SearchDialog({ isOpen, onClose, userId }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const { data: results, isLoading } = trpc.session.search.useQuery(
    { userId, query },
    { enabled: query.length > 1 }
  );

  const handleSelect = (id: string) => {
    onClose();
    router.push(`/chat/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 text-zinc-100 w-full max-w-lg p-6 rounded-lg shadow-lg border border-zinc-800"
          >
            {/* Search Bar */}
            <input
              type="text"
              value={query}
              placeholder="Search sessions and messages..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded-md bg-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Results */}
            {isLoading && <p className="text-sm text-zinc-400">Searching...</p>}

            {!isLoading && results?.length === 0 && query && (
              <p className="text-sm text-zinc-400">No results found.</p>
            )}

            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {results?.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelect(session.id)}
                  className="p-3 rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
                >
                  <h3 className="text-sm font-semibold text-zinc-100 truncate">
                    {session.title}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">
                    {session.snippet || "No matching messages"}
                  </p>
                </div>
              ))}
            </div>

            {/* Close button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}