'use client';

import { useEffect, useRef } from 'react';
import { useOpsStore } from '@/store/opsStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heading } from '@/components/common/Heading';

const AGENT_COLORS = {
  orchestrator: 'text-purple-500',
  PlanZilla: 'text-blue-500',
  QueryLyn: 'text-cyan-500',
  CodeWizard: 'text-amber-500',
  BugBuster: 'text-rose-500',
  DataBard: 'text-emerald-500',
  system: 'text-gray-500',
};

export function LogsPanel() {
  const logs = useOpsStore((state) => state.logs);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside logs panel only
 useEffect(() => {
  if (logs.length === 0) return;

  const viewport =
    scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );

  if (!viewport) return;

  viewport.scrollTop = viewport.scrollHeight;
}, [logs.length]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <Heading level={3} className="text-foreground">
        Live Execution Logs
      </Heading>

      <Card className="h-[600px] overflow-hidden bg-background/50 border-border/50">
        <ScrollArea
          ref={scrollRef}
          className="h-full w-full"
        >
          <div className="p-4 font-mono text-xs space-y-2">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">
                Waiting for task execution...
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 border-b border-border/20 pb-2"
                >
                  <span className="text-muted-foreground min-w-fit">
                    [{log.timestamp}]
                  </span>

                  <span
                    className={`font-semibold min-w-fit ${
                      AGENT_COLORS[log.agent] || 'text-gray-400'
                    }`}
                  >
                    {log.agent}:
                  </span>

                  <span className="text-foreground break-words">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}