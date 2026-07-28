"use client";
import * as React from "react";
import { CheckCheck } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { NotificationItem } from "@/components/molecules/notification-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getNotifications } from "@/lib/api";
import type { AppNotification } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[] | null>(null);

  React.useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <SiteShell>
      <div className="container max-w-2xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notificaciones</h1>
            <p className="text-sm text-muted-foreground">{unread > 0 ? `${unread} sin leer` : "Estás al día"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev)}
          >
            <CheckCheck size={14} /> Marcar todas como leídas
          </Button>
        </div>

        <div className="flex flex-col gap-2.5">
          {!notifications
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            : notifications.map((n) => <NotificationItem key={n.id} notification={n} />)}
        </div>
      </div>
    </SiteShell>
  );
}
