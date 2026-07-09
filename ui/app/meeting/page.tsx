"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MeetingContext {
  industry: string;
  meetingType: string;
  attendees: string;
  knownConcerns: string;
  customerUrl?: string;
  customerIntel?: string;
  additionalContext?: string;
  additionalContextFilename?: string;
}

interface Attachment {
  name: string;
  mediaType: string;
  data: string; // base64
  size: number;
  preview?: string; // object URL for images
}

interface Confidence {
  score: number;
  label: string;
  reason: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  attachmentNames?: string[];
  model?: string;
  isScript?: boolean;
  isQuickResponse?: boolean;
  confidence?: Confidence;
}

interface SavedSession {
  id: string;
  name: string;
  description: string;
  industry: string;
  meetingType: string;
  attendees: string;
  summary: string;
  createdAt: string;
  turnCount: number;
  sharedBy?: string | null;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  sessionId: string;
  sessionName: string;
  fromUserId: string;
  read: boolean;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail / E-commerce",
  "Technology",
  "Government / Public Sector",
  "Energy / Utilities",
  "Legal",
  "Education",
  "Other",
];

const MEETING_TYPE_OPTIONS = [
  "First Discovery Call",
  "First Demo",
  "Technical Deep Dive",
  "POC Kickoff",
  "POC Review",
  "Competitive Evaluation",
  "Executive Briefing",
  "Renewal / Expansion",
];

const MAX_FILES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PDF_BYTES = 32 * 1024 * 1024;  // 32MB

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix — API wants raw base64
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MeetingPage() {
  // Context form state
  const [context, setContext] = useState<MeetingContext>({
    industry: "",
    meetingType: "",
    attendees: "",
    knownConcerns: "",
  });
  const [contextLocked, setContextLocked] = useState(false);
  const [customerUrl, setCustomerUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  // Demo script state
  const [demoRequired, setDemoRequired] = useState(false);
  const [demoLength, setDemoLength] = useState("30");
  const [scriptModalContent, setScriptModalContent] = useState<string | null>(null);
  const [generatingScript, setGeneratingScript] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(true);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [showSessionsDrawer, setShowSessionsDrawer] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"sessions" | "scripts">("sessions");
  const [sessionScripts, setSessionScripts] = useState<Message[]>([]);

  // Quick Response state
  const [quickMode, setQuickMode] = useState(false);
  const [quickInput, setQuickInput] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);

  // Pinned key points
  const [pinnedPoints, setPinnedPoints] = useState<{ id: string; name: string; text: string; msgIndex: number }[]>([]);
  const [showPinnedDrawer, setShowPinnedDrawer] = useState(false);
  const [namingSection, setNamingSection] = useState<{ id: string; text: string; defaultName: string } | null>(null);
  const [pendingPinName, setPendingPinName] = useState("");

  // Audio / TTS state
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const speakingIndexRef = useRef<number | null>(null);

  // Share & notifications
  const [allUsers, setAllUsers] = useState<{ id: string }[]>([]);
  const [shareTargetSessionId, setShareTargetSessionId] = useState<string | null>(null);
  const [shareTargetSessionName, setShareTargetSessionName] = useState<string>("");
  const [shareLoading, setShareLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifTray, setShowNotifTray] = useState(false);

  // Additional context (file upload / paste)
  const [extractingContext, setExtractingContext] = useState(false);
  const [contextFileError, setContextFileError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextFileInputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string>("se_default");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => { if (d.userId) setUserId(d.userId); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Users list + notifications ────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(d => setAllUsers(d.users ?? [])).catch(() => {});
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchNotifications() {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => setNotifications(d.notifications ?? []))
      .catch(() => {});
  }

  async function markAllRead() {
    const unread = notifications.filter(n => !n.read).map(n => n.id);
    if (!unread.length) return;
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: unread }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function shareSession(recipientId: string) {
    if (!shareTargetSessionId) return;
    setShareLoading(true);
    try {
      await fetch("/api/sessions/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: shareTargetSessionId, sessionName: shareTargetSessionName, recipientId }),
      });
    } finally {
      setShareLoading(false);
      setShareTargetSessionId(null);
    }
  }

  // ── Persist pinned points to localStorage keyed by session ────────────────

  useEffect(() => {
    if (!sessionId) return;
    localStorage.setItem(`atlas-pinned-${sessionId}`, JSON.stringify(pinnedPoints));
  }, [pinnedPoints, sessionId]);

  // ── Persist and auto-restore last active session ───────────────────────────

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("atlas-meeting-active-session-id", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    const savedId = localStorage.getItem("atlas-meeting-active-session-id");
    if (!savedId) return;

    async function restoreLastSession() {
      const res = await fetch(`/api/meeting?action=session&sessionId=${savedId}`);
      if (!res.ok) { localStorage.removeItem("atlas-meeting-active-session-id"); return; }
      const data = await res.json();

      setContext({
        industry: data.industry,
        meetingType: data.meetingType,
        attendees: data.attendees,
        knownConcerns: data.knownConcerns,
        additionalContext: data.additionalContext || "",
        additionalContextFilename: data.additionalContextFilename || undefined,
      });
      setContextLocked(true);

      const restoredMessages: Message[] = data.interactions.flatMap(
        (int: { question: string; answer: string; isScript: boolean }) => [
          { role: "user" as const, content: int.question },
          { role: "assistant" as const, content: int.answer, isScript: int.isScript ?? false },
        ]
      );
      const restoredHistory = data.interactions
        .filter((int: { isScript: boolean }) => !int.isScript)
        .flatMap((int: { question: string; answer: string }) => [
          { role: "user" as const, content: int.question },
          { role: "assistant" as const, content: int.answer },
        ]);

      setMessages(restoredMessages);
      setHistory(restoredHistory);
      setSessionScripts(restoredMessages.filter((m) => m.role === "assistant" && m.isScript));
      setSessionId(savedId);
      setSessionName(data.name || "");
      setSessionDescription(data.description || "");
      setIsSaving(true);
      setSessionSaved(true);
      const savedPins = localStorage.getItem(`atlas-pinned-${savedId}`);
      if (savedPins) setPinnedPoints(JSON.parse(savedPins));
    }

    restoreLastSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNewSession() {
    localStorage.removeItem("atlas-meeting-active-session-id");
    setMessages([]);
    setHistory([]);
    setSessionScripts([]);
    setSessionId(null);
    setSessionName("");
    setSessionDescription("");
    setIsSaving(false);
    setSessionSaved(false);
    setContext({ industry: "", meetingType: "", attendees: "", knownConcerns: "" });
    setContextLocked(false);
    setPinnedPoints([]);
    setCustomerUrl("");
    setScrapeError(null);
  }

  // ── Additional context file upload ───────────────────────────────────────

  async function handleContextFile(file: File) {
    setContextFileError(null);
    setExtractingContext(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract-context", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setContextFileError(data.error ?? "Extraction failed");
        return;
      }
      setContext((c) => ({
        ...c,
        additionalContext: data.text,
        additionalContextFilename: data.filename,
      }));
    } catch (err) {
      setContextFileError(`Upload error: ${String(err)}`);
    } finally {
      setExtractingContext(false);
      // Reset so the same file can be re-uploaded if needed
      if (contextFileInputRef.current) contextFileInputRef.current.value = "";
    }
  }

  // ── Customer website scraping ─────────────────────────────────────────────

  async function scrapeCustomerSite() {
    if (!customerUrl.trim()) return;
    setScraping(true);
    setScrapeError(null);
    try {
      const res = await fetch("/api/scrape-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: customerUrl.trim(), attendees: context.attendees }),
      });
      const data = await res.json();
      if (data.error && !data.summary) {
        setScrapeError(data.error);
        return;
      }
      setContext((c) => ({ ...c, customerUrl: customerUrl.trim(), customerIntel: data.summary }));
      if (data.error) setScrapeError(data.error); // partial error
    } catch (err) {
      setScrapeError(`Failed to reach scrape API: ${String(err)}`);
    } finally {
      setScraping(false);
    }
  }

  // ── TTS helpers ───────────────────────────────────────────────────────────────

  function stripMarkdownForSpeech(text: string): string {
    return text
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`[^`]*`/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .trim();
  }

  function speak(text: string, index: number) {
    if (!("speechSynthesis" in window)) return;
    if (speakingIndexRef.current === index) {
      window.speechSynthesis.cancel();
      speakingIndexRef.current = null;
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(stripMarkdownForSpeech(text));
    utt.rate = 0.95;
    utt.onend = () => { speakingIndexRef.current = null; setSpeakingIndex(null); };
    utt.onerror = () => { speakingIndexRef.current = null; setSpeakingIndex(null); };
    speakingIndexRef.current = index;
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utt);
  }

  // ── Pin / unpin a section ─────────────────────────────────────────────────

  function pinSection(id: string, name: string, text: string, msgIndex: number) {
    setPinnedPoints((prev) => [...prev, { id, name, text, msgIndex }]);
  }

  function unpinSection(id: string) {
    setPinnedPoints((prev) => prev.filter((p) => p.id !== id));
  }

  function isSectionPinned(id: string) {
    return pinnedPoints.some((p) => p.id === id);
  }

  // ── Sync meeting context to localStorage so the pop-out can use it ──────────
  useEffect(() => {
    if (!contextLocked) return;
    localStorage.setItem(
      "atlas-meeting-session",
      JSON.stringify({ context, sessionId, userId })
    );
  }, [contextLocked, context, sessionId, userId]);

  // ── Eager session creation when toggle is turned on with locked context ────
  useEffect(() => {
    if (!isSaving || !contextLocked || sessionId || sessionSaved) return;

    async function initSession() {
      try {
        const res = await fetch("/api/meeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: "",
            history: [],
            attachments: [],
            meetingContext: context,
            sessionId: null,
            userId,
            saveSession: true,
            sessionName,
            sessionDescription,
            createSessionOnly: true,
          }),
        });
        const data = await res.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setSessionSaved(true);
        }
      } catch {
        // silent — will still try to save on next message
      }
    }

    initSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving, contextLocked]);

  // ── File attachment handling ───────────────────────────────────────────────

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setAttachError(null);
    const fileArray = Array.from(files);

    if (attachments.length + fileArray.length > MAX_FILES) {
      setAttachError(`Maximum ${MAX_FILES} files per message.`);
      return;
    }

    const newAttachments: Attachment[] = [];

    for (const file of fileArray) {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";
      const isXlsx = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.match(/\.(xlsx|xls)$/i) !== null;

      if (!isImage && !isPDF && !isXlsx) {
        setAttachError(`${file.name}: only images, PDFs, and spreadsheets are supported.`);
        continue;
      }
      if (isImage && file.size > MAX_IMAGE_BYTES) {
        setAttachError(`${file.name}: images must be under 5 MB.`);
        continue;
      }
      if (isPDF && file.size > MAX_PDF_BYTES) {
        setAttachError(`${file.name}: PDFs must be under 32 MB.`);
        continue;
      }

      if (isXlsx) {
        try {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/extract-context", { method: "POST", body: form });
          const data = await res.json();
          if (!res.ok) { setAttachError(`${file.name}: ${data.error ?? "Extraction failed"}`); continue; }
          newAttachments.push({ name: file.name, mediaType: "text/plain", data: data.text, size: file.size });
        } catch (err) { setAttachError(`${file.name}: ${String(err)}`); }
        continue;
      }

      const base64 = await fileToBase64(file);
      const preview = isImage ? URL.createObjectURL(file) : undefined;

      newAttachments.push({
        name: file.name,
        mediaType: file.type,
        data: base64,
        size: file.size,
        preview,
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
  }, [attachments]);

  function removeAttachment(index: number) {
    setAttachments((prev) => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview!);
      updated.splice(index, 1);
      return updated;
    });
  }

  // ── Send message ───────────────────────────────────────────────────────────

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: Message = {
      role: "user",
      content: question,
      attachmentNames: attachments.map((a) => a.name),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const sentAttachments = [...attachments];
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history,
          attachments: sentAttachments.map(({ name, mediaType, data, size }) => ({
            name,
            mediaType,
            data,
            size,
          })),
          meetingContext: contextLocked ? context : null,
          sessionId,
          userId,
          saveSession: isSaving,
          sessionName,
          sessionDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "API error");

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        model: data.model,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: data.answer },
      ]);

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        setSessionSaved(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${String(err)}` },
      ]);
    } finally {
      setLoading(false);
      // Clean up preview URLs
      sentAttachments.forEach((a) => {
        if (a.preview) URL.revokeObjectURL(a.preview);
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ── Quick Response ─────────────────────────────────────────────────────────

  async function sendQuickResponse() {
    const question = quickInput.trim();
    if (!question || quickLoading || !contextLocked) return;
    setQuickLoading(true);

    const userMsg: Message = { role: "user", content: question, isQuickResponse: true };
    setMessages((prev) => [...prev, userMsg]);
    setQuickInput("");

    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: [],
          attachments: [],
          meetingContext: context,
          sessionId,
          userId,
          saveSession: isSaving,
          sessionName,
          sessionDescription,
          quickResponse: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "API error");

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        model: data.model,
        isQuickResponse: true,
        confidence: data.confidence,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        setSessionSaved(true);
      }

      // Broadcast to second monitor via localStorage (works across popup windows)
      localStorage.setItem(
        "atlas-quick-response",
        JSON.stringify({ question, answer: data.answer, confidence: data.confidence, ts: Date.now() })
      );

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${String(err)}`, isQuickResponse: true },
      ]);
    } finally {
      setQuickLoading(false);
    }
  }

  // ── Demo script generation ─────────────────────────────────────────────────

  async function generateDemoScript() {
    if (!contextLocked || generatingScript) return;
    setGeneratingScript(true);

    const scriptMsg: Message = {
      role: "user",
      content: `Generate a ${demoLength}-minute demo script for this meeting.`,
    };
    setMessages((prev) => [...prev, scriptMsg]);

    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "",
          history,
          attachments: [],
          meetingContext: context,
          sessionId,
          userId,
          saveSession: isSaving,
          sessionName,
          sessionDescription,
          generateScript: true,
          demoLength,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "API error");

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        model: data.model,
        isScript: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setSessionScripts((prev) => [...prev, assistantMsg]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: scriptMsg.content },
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error generating script: ${String(err)}` },
      ]);
    } finally {
      setGeneratingScript(false);
    }
  }

  async function generateCallGuide() {
    if (!contextLocked || generatingScript) return;
    setGeneratingScript(true);

    const guideMsg: Message = {
      role: "user",
      content: `Generate a call guide for this ${context.meetingType}.`,
    };
    setMessages((prev) => [...prev, guideMsg]);

    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "",
          history,
          attachments: [],
          meetingContext: context,
          sessionId,
          userId,
          saveSession: isSaving,
          sessionName,
          sessionDescription,
          generateCallGuide: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "API error");

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        model: data.model,
        isScript: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setSessionScripts((prev) => [...prev, assistantMsg]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: guideMsg.content },
        { role: "assistant", content: data.answer },
      ]);
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        setSessionSaved(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error generating call guide: ${String(err)}` },
      ]);
    } finally {
      setGeneratingScript(false);
    }
  }

  // ── Sessions panel ─────────────────────────────────────────────────────────

  async function loadSessions() {
    setLoadingSessions(true);
    try {
      const res = await fetch(`/api/meeting?action=list&userId=${userId}`);
      const data = await res.json();
      setSavedSessions(data.sessions ?? []);
    } finally {
      setLoadingSessions(false);
    }
  }

  async function deleteSession(id: string) {
    await fetch(`/api/meeting?sessionId=${id}`, { method: "DELETE" });
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function openSessionsDrawer() {
    loadSessions();
    setShowSessionsDrawer(true);
  }

  async function loadSession(s: SavedSession, keepDrawerOpen = false) {
    // Clear immediately so stale scripts from a previous session don't show
    setSessionScripts([]);
    setMessages([]);
    try {
      const res = await fetch(`/api/meeting?action=session&sessionId=${s.id}`);
      if (!res.ok) return;
      const data = await res.json();

      // Restore context
      setContext({
        industry: data.industry,
        meetingType: data.meetingType,
        attendees: data.attendees,
        knownConcerns: data.knownConcerns,
        additionalContext: data.additionalContext || "",
        additionalContextFilename: data.additionalContextFilename || undefined,
      });
      setContextLocked(true);

      // Rebuild messages and history from interactions (in saved order)
      const restoredMessages: Message[] = data.interactions.flatMap(
        (i: { question: string; answer: string; isScript: boolean }) => [
          { role: "user" as const, content: i.question },
          { role: "assistant" as const, content: i.answer, isScript: i.isScript ?? false },
        ]
      );
      // History excludes script turns (they shouldn't re-enter the LLM context)
      const restoredHistory = data.interactions
        .filter((i: { isScript: boolean }) => !i.isScript)
        .flatMap((i: { question: string; answer: string }) => [
          { role: "user" as const, content: i.question },
          { role: "assistant" as const, content: i.answer },
        ]);

      const scripts = restoredMessages.filter((m) => m.role === "assistant" && m.isScript);
      setMessages(restoredMessages);
      setHistory(restoredHistory);
      setSessionScripts(scripts);
      setSessionId(s.id);
      setSessionName(s.name);
      setSessionDescription(s.description);
      setIsSaving(true);
      setSessionSaved(true);
      const savedPins = localStorage.getItem(`atlas-pinned-${s.id}`);
      setPinnedPoints(savedPins ? JSON.parse(savedPins) : []);
      if (!keepDrawerOpen) setShowSessionsDrawer(false);

      return scripts;
    } catch {
      return [];
    }
  }

  // ── Context form validation ────────────────────────────────────────────────

  const contextReady = context.industry && context.meetingType;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">

      {/* Demo script modal */}
      {scriptModalContent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-base font-semibold text-white">Demo Script</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scriptModalContent);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  Print
                </button>
                <button
                  onClick={() => setScriptModalContent(null)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-invert prose-sm max-w-none print:text-black print:bg-white">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => <h2 className="text-base font-semibold mt-5 mb-2 text-white border-b border-gray-700 pb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1 text-gray-200">{children}</h3>,
                  p: ({ children }) => <p className="mb-2 text-gray-300">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-300">{children}</ol>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  li: ({ children }) => <li className="text-gray-300">{children}</li>,
                }}
              >
                {scriptModalContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="border-b border-gray-800 px-4 py-4 flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Back</Link>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Meeting Context
          </p>

          {contextLocked ? (
            <div className="bg-gray-800 rounded-lg p-3 text-sm space-y-1">
              <p className="text-white font-medium">{context.industry}</p>
              <p className="text-gray-400">{context.meetingType}</p>
              {context.attendees && (
                <p className="text-gray-500 text-xs">{context.attendees}</p>
              )}
              {context.customerIntel && (
                <p className="text-xs text-green-400 mt-1">✓ {context.customerUrl} researched</p>
              )}
              {context.additionalContext && (
                <p className="text-xs text-blue-400 mt-1">
                  📄 {context.additionalContextFilename ?? "Additional context added"}
                </p>
              )}
              <button
                onClick={() => setContextLocked(false)}
                className="text-xs text-blue-400 hover:text-blue-300 mt-2"
              >
                Edit context
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Industry</label>
                <select
                  value={context.industry}
                  onChange={(e) => setContext((c) => ({ ...c, industry: e.target.value }))}
                  className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select industry…</option>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Meeting Type</label>
                <select
                  value={context.meetingType}
                  onChange={(e) => setContext((c) => ({ ...c, meetingType: e.target.value }))}
                  className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select type…</option>
                  {MEETING_TYPE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Who&apos;s in the room</label>
                <input
                  type="text"
                  placeholder="e.g. CISO, DevOps Lead"
                  value={context.attendees}
                  onChange={(e) => setContext((c) => ({ ...c, attendees: e.target.value }))}
                  className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Known concerns</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Already evaluating Wiz, Azure-only"
                  value={context.knownConcerns}
                  onChange={(e) => setContext((c) => ({ ...c, knownConcerns: e.target.value }))}
                  className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
                />
              </div>

              {/* Customer website */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Customer Website</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. acmecorp.com"
                    value={customerUrl}
                    onChange={(e) => setCustomerUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") scrapeCustomerSite(); }}
                    className="flex-1 bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
                  />
                  <button
                    onClick={scrapeCustomerSite}
                    disabled={!customerUrl.trim() || scraping}
                    className="text-xs bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-2.5 py-2 transition-colors shrink-0"
                    title="Research this company"
                  >
                    {scraping ? "…" : "🔍"}
                  </button>
                </div>
                {scrapeError && (
                  <p className="text-xs text-red-400 mt-1">{scrapeError}</p>
                )}
                {context.customerIntel && (
                  <p className="text-xs text-green-400 mt-1">✓ Company researched</p>
                )}
              </div>

              {/* Additional Context / Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-400">Additional Context / Notes</label>
                  <button
                    type="button"
                    onClick={() => contextFileInputRef.current?.click()}
                    disabled={extractingContext}
                    className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                    title="Upload a file to extract text (PDF, Word, Excel, CSV, TXT, image)"
                  >
                    {extractingContext ? "Extracting…" : "Upload file"}
                  </button>
                  <input
                    ref={contextFileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv,.md,.tsv,.json,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleContextFile(f);
                    }}
                  />
                </div>
                {context.additionalContextFilename && (
                  <p className="text-xs text-blue-400 mb-1 flex items-center gap-1">
                    <span>📄</span> {context.additionalContextFilename}
                    <button
                      onClick={() => setContext((c) => ({ ...c, additionalContext: "", additionalContextFilename: undefined }))}
                      className="text-gray-500 hover:text-red-400 ml-1"
                      title="Clear file"
                    >✕</button>
                  </p>
                )}
                <textarea
                  rows={3}
                  placeholder="Paste notes, RFP excerpts, customer emails, or upload a file above…"
                  value={context.additionalContext ?? ""}
                  onChange={(e) => setContext((c) => ({ ...c, additionalContext: e.target.value, additionalContextFilename: e.target.value ? c.additionalContextFilename : undefined }))}
                  className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
                />
                {contextFileError && (
                  <p className="text-xs text-red-400 mt-1">{contextFileError}</p>
                )}
              </div>

              <button
                disabled={!contextReady}
                onClick={() => setContextLocked(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Set Context
              </button>
            </div>
          )}

          {/* Demo / Call Guide controls */}
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Generate
            </p>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-400">Demo Required</span>
              <button
                onClick={() => setDemoRequired((v) => !v)}
                className={`w-8 h-4 rounded-full transition-colors relative ${demoRequired ? "bg-green-600" : "bg-gray-700"}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${demoRequired ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </label>

            {demoRequired ? (
              <>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Demo Length</label>
                  <select
                    value={demoLength}
                    onChange={(e) => setDemoLength(e.target.value)}
                    className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <button
                  disabled={!contextLocked || generatingScript}
                  onClick={generateDemoScript}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                  {generatingScript ? "Generating…" : "Generate Demo Script"}
                </button>
              </>
            ) : (
              <button
                disabled={!contextLocked || generatingScript}
                onClick={generateCallGuide}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                {generatingScript ? "Generating…" : "Generate Call Guide"}
              </button>
            )}
          </div>

          {/* Session controls */}
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Session
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setIsSaving((v) => !v)}
                className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                  isSaving ? "bg-green-600" : "bg-gray-700"
                }`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                  isSaving ? "translate-x-4" : "translate-x-0.5"
                }`} />
              </div>
              <span className="text-xs text-gray-400">Save this session</span>
            </label>

            {isSaving && (
              <>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Session Name</label>
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder={context.meetingType && context.industry ? `${context.meetingType} · ${context.industry}` : "Name this session…"}
                    className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Description</label>
                  <textarea
                    rows={2}
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    placeholder="e.g. CISO deep dive, focused on data leakage…"
                    className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-600"
                  />
                </div>
              </>
            )}

            {sessionSaved && (
              <p className="text-xs text-green-400">✓ Session being saved</p>
            )}

            {(sessionId || messages.length > 0) && (
              <button
                onClick={startNewSession}
                className="w-full text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition-colors"
              >
                + New Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Past Sessions Drawer */}
      {showSessionsDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowSessionsDrawer(false)}
          />
          {/* Drawer panel */}
          <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="font-semibold text-white">Past Sessions</h2>
              <button
                onClick={() => setShowSessionsDrawer(false)}
                className="text-gray-400 hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setDrawerTab("sessions")}
                className={`flex-1 text-xs py-2.5 font-medium transition-colors ${
                  drawerTab === "sessions"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sessions
              </button>
              <button
                onClick={() => setDrawerTab("scripts")}
                className={`flex-1 text-xs py-2.5 font-medium transition-colors ${
                  drawerTab === "scripts"
                    ? "text-white border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Scripts
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {drawerTab === "sessions" ? (
                loadingSessions ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : savedSessions.length === 0 ? (
                  <div className="text-center mt-16">
                    <p className="text-gray-500 text-sm">No saved sessions yet.</p>
                    <p className="text-gray-600 text-xs mt-1">Toggle &ldquo;Save this session&rdquo; before your next meeting.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedSessions.map((s) => (
                      <div
                        key={s.id}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {s.name || `${s.meetingType} · ${s.industry}`}
                            </p>
                            {s.sharedBy && (
                              <p className="text-xs text-blue-400 mt-0.5">↗ Shared by {s.sharedBy}</p>
                            )}
                            {s.description && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{s.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                              <span>{s.industry}</span>
                              <span>·</span>
                              <span>{s.meetingType}</span>
                              <span>·</span>
                              <span>{s.turnCount} exchanges</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0 mt-0.5">
                            <button
                              onClick={() => loadSession(s)}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Resume
                            </button>
                            <button
                              onClick={async () => {
                                await loadSession(s, true);
                                setDrawerTab("scripts");
                              }}
                              className="text-xs text-orange-400 hover:text-orange-300"
                            >
                              Scripts
                            </button>
                            {!s.sharedBy && (
                              <button
                                onClick={() => { setShareTargetSessionId(s.id); setShareTargetSessionName(s.name || `${s.meetingType} · ${s.industry}`); }}
                                className="text-xs text-green-400 hover:text-green-300"
                              >
                                Share
                              </button>
                            )}
                            {!s.sharedBy && (
                              <button
                                onClick={() => deleteSession(s.id)}
                                className="text-xs text-red-500 hover:text-red-400"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Scripts tab — shows all script messages from the current loaded session */
                (() => {
                  const scriptMessages = sessionScripts.length > 0
                    ? sessionScripts
                    : messages.filter((m) => m.role === "assistant" && m.isScript);
                  return scriptMessages.length === 0 ? (
                    <div className="text-center mt-16">
                      <p className="text-gray-500 text-sm">No scripts found.</p>
                      <p className="text-gray-600 text-xs mt-1 px-4">
                        {sessionId
                          ? "No demo script was generated or saved for this session. Use \"Generate Demo Script\" to create one."
                          : "Resume a session or generate a script first."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scriptMessages.map((m, idx) => (
                        <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-orange-400">
                              Demo Script {scriptMessages.length > 1 ? `#${idx + 1}` : ""}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigator.clipboard.writeText(m.content)}
                                className="text-xs text-gray-400 hover:text-gray-200"
                              >
                                Copy
                              </button>
                              <button
                                onClick={() => { setScriptModalContent(m.content); setShowSessionsDrawer(false); }}
                                className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                              >
                                Open →
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                            {m.content.slice(0, 200)}…
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Key Points Drawer */}
      {showPinnedDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setShowPinnedDrawer(false)} />
          <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="font-semibold text-white">★ Key Points</h2>
              <button
                onClick={() => setShowPinnedDrawer(false)}
                className="text-gray-400 hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {pinnedPoints.length === 0 ? (
                <div className="text-center mt-16">
                  <p className="text-gray-500 text-sm">No key points pinned yet.</p>
                  <p className="text-gray-600 text-xs mt-2 px-4">
                    Hover over any response section and click ☆ to pin it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pinnedPoints.map((point) => (
                    <div key={point.id} className="bg-gray-800 border border-yellow-700/40 rounded-xl px-4 py-3 group">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-semibold text-yellow-400">★ {point.name}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => navigator.clipboard.writeText(point.text)}
                            className="text-xs text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => unpinSection(point.id)}
                            className="text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">
                        {point.text.replace(/^#{1,3}\s+.+\n?/m, "").replace(/[*_`#]/g, "").trim()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pinnedPoints.length > 0 && (
              <div className="border-t border-gray-700 px-4 py-3 flex gap-2">
                <button
                  onClick={() => {
                    const text = pinnedPoints.map((p, idx) => `${idx + 1}. ${p.name}\n\n${p.text}`).join("\n\n---\n\n");
                    navigator.clipboard.writeText(text);
                  }}
                  className="flex-1 text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
                >
                  Copy All
                </button>
                <button
                  onClick={() => setPinnedPoints([])}
                  className="text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-400 border border-gray-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Session Modal */}
      {shareTargetSessionId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="font-semibold text-white text-sm">Share Session</h2>
              <button onClick={() => setShareTargetSessionId(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-400 mb-3">Select a user to share <span className="text-white font-medium">&ldquo;{shareTargetSessionName}&rdquo;</span> with:</p>
              {allUsers.length === 0 ? (
                <p className="text-xs text-gray-500">No other users found.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => shareSession(u.id)}
                      disabled={shareLoading}
                      className="w-full text-left text-sm text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg px-3 py-2.5 transition-colors truncate"
                    >
                      {u.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Tray */}
      {showNotifTray && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setShowNotifTray(false)} />
          <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="font-semibold text-white">Notifications</h2>
              <button onClick={() => setShowNotifTray(false)} className="text-gray-400 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {notifications.length === 0 ? (
                <div className="text-center mt-16">
                  <p className="text-gray-500 text-sm">No notifications yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl px-4 py-3 border ${n.read ? "bg-gray-800 border-gray-700" : "bg-blue-950 border-blue-700"}`}
                    >
                      <p className="text-sm text-gray-200 leading-snug">{n.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        {n.sessionId && (
                          <button
                            onClick={async () => {
                              const fakeSession = { id: n.sessionId, name: n.sessionName, description: "", industry: "", meetingType: "", attendees: "", summary: "", createdAt: "", turnCount: 0 };
                              await loadSession(fakeSession);
                              setShowNotifTray(false);
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                          >
                            Open Session →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-white">Meeting Readiness</h1>
            <p className="text-xs text-gray-400">
              {contextLocked
                ? `${context.meetingType} · ${context.industry}`
                : "Set meeting context in the sidebar, then start asking"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mode toggle */}
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5">
              <button
                onClick={() => setQuickMode(false)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${!quickMode ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                Chat
              </button>
              <button
                onClick={() => setQuickMode(true)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${quickMode ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                ⚡ Quick Answer
              </button>
            </div>
            {quickMode && (
              <button
                onClick={() => window.open("/meeting/quickview", "_blank", "width=900,height=600,menubar=no,toolbar=no,location=no")}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors"
                title="Open on second monitor"
              >
                ⬡ Pop Out
              </button>
            )}
            <button
              onClick={() => setShowPinnedDrawer(true)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors relative ${
                pinnedPoints.length > 0
                  ? "bg-yellow-900/40 border-yellow-700 text-yellow-300 hover:bg-yellow-900/60"
                  : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              }`}
            >
              ★ Key Points {pinnedPoints.length > 0 && `(${pinnedPoints.length})`}
            </button>
            <button
              onClick={openSessionsDrawer}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors"
            >
              Past Sessions
            </button>
            <span className="text-xs px-2 py-1 rounded-full bg-orange-900 text-orange-300 font-medium">
              SE Tool
            </span>
            {/* Notification bell */}
            <button
              onClick={() => { setShowNotifTray(true); markAllRead(); }}
              className="relative w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm flex items-center justify-center transition-colors"
              title="Notifications"
            >
              🔔
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setHelpOpen(true)}
              className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold flex items-center justify-center transition-colors"
              title="Help"
            >
              ?
            </button>
          </div>
        </header>
        <HelpPanel page="meeting" open={helpOpen} onClose={() => setHelpOpen(false)} />

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-4xl mb-4">🤝</div>
              <p className="text-lg font-medium text-gray-300">Ready when you are</p>
              <p className="text-sm mt-2 max-w-md mx-auto">
                Set your meeting context in the sidebar, then ask anything — upload
                customer screenshots, RFPs, or architecture diagrams to get
                targeted help.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-2xl min-w-0 space-y-1">
                {/* Attachment chips on user messages */}
                {msg.attachmentNames && msg.attachmentNames.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {msg.attachmentNames.map((name, j) => (
                      <span
                        key={j}
                        className="text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5"
                      >
                        📎 {name}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    (() => {
                      const sections = msg.content.split(/\n\s*---\s*\n/);
                      const mdComponents = {
                        h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-base font-semibold mt-3 mb-1">{children}</h2>,
                        h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>,
                        p:  ({ children }: { children?: React.ReactNode }) => <p className="mb-2">{children}</p>,
                        ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
                        table: ({ children }: { children?: React.ReactNode }) => <table className="w-full text-xs border-collapse my-2">{children}</table>,
                        th: ({ children }: { children?: React.ReactNode }) => <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-left">{children}</th>,
                        td: ({ children }: { children?: React.ReactNode }) => <td className="border border-gray-600 px-2 py-1">{children}</td>,
                        pre: ({ children }: { children?: React.ReactNode }) => <pre className="bg-gray-700 rounded p-2 my-2 overflow-x-auto text-xs font-mono">{children}</pre>,
                        code: ({ children }: { children?: React.ReactNode }) => <code className="bg-gray-700 px-1 rounded text-xs font-mono break-all">{children}</code>,
                      };
                      return (
                        <>
                          {sections.map((section, sIdx) => {
                            const sectionId = `${i}-${sIdx}`;
                            const pinned = isSectionPinned(sectionId);
                            const isNaming = namingSection?.id === sectionId;
                            const headingMatch = section.match(/^#{1,3}\s+(.+)/m);
                            const defaultName = headingMatch ? headingMatch[1].trim() : `Section ${sIdx + 1}`;
                            return (
                              <div key={sIdx}>
                                {sIdx > 0 && <hr className="border-gray-700 my-3" />}
                                <div className="group/section">
                                  <div className="flex items-center justify-end mb-1 min-h-[20px]">
                                    {isNaming ? (
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          autoFocus
                                          type="text"
                                          value={pendingPinName}
                                          onChange={(e) => setPendingPinName(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") { pinSection(sectionId, pendingPinName || defaultName, section, i); setNamingSection(null); }
                                            if (e.key === "Escape") setNamingSection(null);
                                          }}
                                          placeholder={defaultName}
                                          className="text-xs bg-gray-700 text-gray-100 rounded px-2 py-1 w-44 focus:outline-none focus:ring-1 focus:ring-yellow-500 placeholder-gray-500"
                                        />
                                        <button
                                          onClick={() => { pinSection(sectionId, pendingPinName || defaultName, section, i); setNamingSection(null); }}
                                          className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white rounded px-2 py-1 transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button onClick={() => setNamingSection(null)} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          if (pinned) { unpinSection(sectionId); }
                                          else { setNamingSection({ id: sectionId, text: section, defaultName }); setPendingPinName(defaultName); }
                                        }}
                                        className={`text-sm transition-colors ${pinned ? "text-yellow-400" : "text-gray-600 opacity-0 group-hover/section:opacity-100"}`}
                                        title={pinned ? "Remove from Key Points" : "Pin section to Key Points"}
                                      >
                                        {pinned ? "★" : "☆"}
                                      </button>
                                    )}
                                  </div>
                                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                    {section}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()
                  )}
                </div>

                {/* Confidence badge for quick responses */}
                {msg.role === "assistant" && msg.isQuickResponse && msg.confidence && (
                  <div className="flex items-center gap-2 px-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      msg.confidence.score >= 85
                        ? "bg-green-900 text-green-300"
                        : msg.confidence.score >= 70
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                    }`}>
                      {msg.confidence.score >= 85 ? "✓" : msg.confidence.score >= 70 ? "~" : "!"} {msg.confidence.label} ({msg.confidence.score})
                    </span>
                    <p className="text-xs text-gray-600 truncate max-w-xs">{msg.confidence.reason}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                      className="text-xs text-gray-500 hover:text-gray-300 ml-auto shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                )}

                {/* Model badge + audio + script button */}
                {msg.role === "assistant" && !msg.isQuickResponse && (
                  <div className="flex items-center gap-3 px-1">
                    <button
                      onClick={() => speak(msg.content, i)}
                      className={`text-xs transition-colors ${speakingIndex === i ? "text-orange-400 hover:text-orange-300" : "text-gray-600 hover:text-gray-400"}`}
                      title={speakingIndex === i ? "Stop reading" : "Read aloud"}
                    >
                      {speakingIndex === i ? "⏹ Stop" : "🔊 Listen"}
                    </button>
                    {msg.model && (
                      <p className="text-xs text-gray-600">via {msg.model}</p>
                    )}
                    {msg.isScript && (
                      <button
                        onClick={() => setScriptModalContent(msg.content)}
                        className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                      >
                        Open Script →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-400">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-800 px-6 py-4">
          {quickMode ? (
            /* ── Quick Answer input ── */
            <div className="max-w-4xl mx-auto space-y-2">
              <div className="flex gap-3">
                <textarea
                  className="flex-1 bg-gray-800 border border-green-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-500"
                  rows={2}
                  placeholder={contextLocked ? "Type the customer's question for an instant 3-sentence answer…" : "Set meeting context first…"}
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendQuickResponse();
                    }
                  }}
                />
                <button
                  onClick={sendQuickResponse}
                  disabled={quickLoading || !quickInput.trim() || !contextLocked}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors shrink-0"
                >
                  {quickLoading ? "…" : "⚡ Answer"}
                </button>
              </div>
              <p className="text-center text-xs text-gray-600">
                3-sentence live answer · LLM confidence scored · Broadcasts to Pop Out window
              </p>
            </div>
          ) : (
            /* ── Chat input ── */
            <>
              {attachError && (
                <p className="text-xs text-red-400 mb-2">{attachError}</p>
              )}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1">
                      {att.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={att.preview} alt={att.name} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <span className="text-sm">📄</span>
                      )}
                      <div className="text-xs">
                        <p className="text-gray-200 max-w-32 truncate">{att.name}</p>
                        <p className="text-gray-500">{formatBytes(att.size)}</p>
                      </div>
                      <button onClick={() => removeAttachment(i)} className="text-gray-500 hover:text-gray-300 ml-1 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3 max-w-4xl mx-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.length >= MAX_FILES}
                  className="text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-xl hover:bg-gray-800 transition-colors shrink-0"
                  title="Attach image or PDF (max 4)"
                >
                  📎
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf,.xlsx,.xls"
                  multiple
                  className="hidden"
                  onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
                />
                <textarea
                  className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
                  rows={1}
                  placeholder={contextLocked ? "Ask anything about Atlas, analyze an attachment, prep for objections…" : "Set meeting context in the sidebar first…"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors shrink-0"
                >
                  Send
                </button>
              </div>
              <p className="text-center text-xs text-gray-600 mt-2">
                Enter to send · Shift+Enter for new line · Images use GPT-4o · PDFs use Claude
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
