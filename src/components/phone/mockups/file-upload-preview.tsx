'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, File as FileIcon, Plus, Trash2, UploadCloud } from 'lucide-react';
import { MockupScreen } from './_shared';
import { cn } from '@/lib/utils';

type ExistingFile = {
  name: string;
  size: string;
  progress: number;
};

type Cfg = {
  maxFiles?: number;
  existingFiles?: ExistingFile[];
};

const DEFAULT_FILES: ExistingFile[] = [
  { name: 'Договор.pdf', size: '248 КБ', progress: 100 },
  { name: 'Паспорт.jpg', size: '1.2 МБ', progress: 100 },
];

const PALETTE = [
  'bg-emerald-100 dark:bg-emerald-950/40',
  'bg-amber-100 dark:bg-amber-950/30',
  'bg-rose-100 dark:bg-rose-950/30',
  'bg-neutral-100 dark:bg-neutral-800',
];

const SAMPLE_NEW_FILES = [
  { name: 'Чек.pdf', size: '96 КБ' },
  { name: 'Фото.jpg', size: '512 КБ' },
  { name: 'Справка.pdf', size: '184 КБ' },
];

/**
 * FileUploadPreviewMockup — upload area with a "+" button. Existing files are
 * shown as cards with a colored thumbnail, name, size, and a progress bar
 * (100% = green check). "Загрузить ещё" simulates an upload over ~2s with a
 * progress bar 0→100, then adds the file to the list. Each file has a "Удалить"
 * trash icon.
 */
export function FileUploadPreviewMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const maxFiles = typeof cfg.maxFiles === 'number' && cfg.maxFiles > 0 ? cfg.maxFiles : 5;
  const initialFiles =
    Array.isArray(cfg.existingFiles) && cfg.existingFiles.length > 0
      ? cfg.existingFiles
      : DEFAULT_FILES;

  type ListItem = ExistingFile & { id: number; uploading?: boolean };
  const [files, setFiles] = useState<ListItem[]>(() =>
    initialFiles.map((f, i) => ({ ...f, id: i + 1 })),
  );
  const [nextId, setNextId] = useState(initialFiles.length + 1);
  const [sampleIdx, setSampleIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const atMax = files.length >= maxFiles;
  const anyUploading = files.some((f) => f.uploading);

  function startUpload() {
    if (atMax || anyUploading) return;
    const sample = SAMPLE_NEW_FILES[sampleIdx % SAMPLE_NEW_FILES.length];
    const newId = nextId;
    setNextId((n) => n + 1);
    setSampleIdx((i) => i + 1);
    setFiles((prev) => [
      ...prev,
      { id: newId, name: sample.name, size: sample.size, progress: 0, uploading: true },
    ]);

    const start = Date.now();
    const duration = 2000;
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setFiles((prev) =>
        prev.map((f) => (f.id === newId ? { ...f, progress: pct } : f)),
      );
      if (pct >= 100) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setFiles((prev) =>
          prev.map((f) => (f.id === newId ? { ...f, progress: 100, uploading: false } : f)),
        );
      }
    }, 40);
  }

  function remove(id: number) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          aria-label="Назад"
          className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          Документы
        </span>
        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
          {files.length}/{maxFiles}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Загрузка файлов
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Документы для проверки аккаунта
        </p>

        {/* Upload zone */}
        <button
          type="button"
          onClick={startUpload}
          disabled={atMax || anyUploading}
          className={cn(
            'mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 transition-colors',
            atMax || anyUploading
              ? 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50'
              : 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40',
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              atMax || anyUploading
                ? 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                : 'bg-emerald-500 text-white',
            )}
          >
            {anyUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <UploadCloud className="h-5 w-5" />
              </motion.div>
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            )}
          </div>
          <div
            className={cn(
              'mt-2 text-[13px] font-semibold',
              atMax || anyUploading
                ? 'text-neutral-400 dark:text-neutral-600'
                : 'text-neutral-900 dark:text-white',
            )}
          >
            {atMax ? 'Достигнут лимит файлов' : 'Загрузить ещё'}
          </div>
          <div className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
            PDF, JPG, PNG — до {maxFiles} файлов
          </div>
        </button>

        {/* File list */}
        <div className="mt-5 space-y-2">
          <AnimatePresence initial={false}>
            {files.map((f, i) => {
              const done = f.progress >= 100;
              const palette = PALETTE[i % PALETTE.length];
              const ext = f.name.split('.').pop()?.toUpperCase() ?? 'FILE';
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden rounded-xl border border-neutral-100 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Thumbnail */}
                    <div
                      className={cn(
                        'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        palette,
                      )}
                    >
                      <FileIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                      <span className="absolute -bottom-1 -right-1 rounded bg-white px-0.5 text-[7px] font-bold text-neutral-600 shadow-sm dark:bg-neutral-900 dark:text-neutral-300">
                        {ext}
                      </span>
                    </div>

                    {/* Name + size */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-semibold text-neutral-900 dark:text-white">
                        {f.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {f.size}
                      </div>
                    </div>

                    {/* Status / action */}
                    {f.uploading ? (
                      <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        {Math.round(f.progress)}%
                      </span>
                    ) : done ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3 w-3" strokeWidth={4} />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => remove(f.id)}
                      aria-label={`Удалить ${f.name}`}
                      className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Progress bar (only show while uploading) */}
                  <AnimatePresence>
                    {f.uploading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                          <motion.div
                            className="h-full rounded-full bg-emerald-500"
                            animate={{ width: `${f.progress}%` }}
                            transition={{ duration: 0.05, ease: 'linear' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {files.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center dark:border-neutral-800">
              <FileIcon className="mx-auto h-8 w-8 text-neutral-300 dark:text-neutral-600" />
              <p className="mt-2 text-[12px] text-neutral-500 dark:text-neutral-400">
                Пока ничего не загружено
              </p>
            </div>
          )}
        </div>
      </div>
    </MockupScreen>
  );
}
