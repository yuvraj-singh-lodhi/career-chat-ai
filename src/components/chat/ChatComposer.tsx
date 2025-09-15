"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Send, Mic, Square } from "lucide-react";

interface ChatComposerProps {
  onSend: (message: { content?: string; audio?: { mimeType: string; base64: string } }) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  /** Handle text send */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;

    onSend({ content: value.trim() });
    setValue("");
  };

  /** Start audio recording */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = bufferToBase64(arrayBuffer);

        onSend({
          audio: { mimeType: "audio/webm", base64 },
        });

        // cleanup
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  /** Stop audio recording */
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center bg-background px-3 py-4"
    >
      <div className="relative w-[600px] flex items-center space-x-2">
        {/* Text input + send */}
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={recording ? "Recording…" : "Type your message..."}
            disabled={disabled || recording}
            className="w-full pr-10 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim() || recording}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Mic / Stop button */}
        <div>
          {recording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
              disabled={disabled}
            >
              <Square className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              disabled={disabled}
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

/** Helper: convert ArrayBuffer → Base64 */
function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
