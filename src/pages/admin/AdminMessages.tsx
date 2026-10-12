import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { contactApi } from '../../api/contact.api';
import { notificationsApi } from '../../api/notifications.api';
import { ContactMessage, Notification } from '../../types';
import { MessageSquare, Bell, Mail, CheckCircle2 } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);

  const loadData = async () => {
    const [msgRes, notifRes] = await Promise.all([
      contactApi.getMessages(),
      notificationsApi.getNotifications('usr_admin')
    ]);

    if (msgRes.success && msgRes.data) {
      setMessages(msgRes.data);
    }
    if (notifRes.success && notifRes.data) {
      setNotifs(notifRes.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveMessage = async (id: string) => {
    await contactApi.updateStatus(id, 'Resolved');
    loadData();
  };

  return (
    <ConsoleLayout role="admin" title="Customer Inquiries & System Alerts">
      <div className="space-y-8">
        {/* Contact Us Submissions (Fig 8.16 support inbox) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Contact Us Inbound Inquiries (Fig 8.16)
            </h3>
            <span className="text-xs text-slate-500">{messages.length} messages</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {messages.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{m.name}</td>
                    <td className="py-3 px-4 text-slate-500">{m.email}</td>
                    <td className="py-3 px-4 font-semibold">{m.subject}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs">{m.message}</td>
                    <td className="py-3 px-4">
                      <Badge variant={m.status === 'Resolved' ? 'success' : 'warning'}>{m.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {m.status !== 'Resolved' && (
                        <Button size="sm" variant="outline" onClick={() => handleResolveMessage(m.id)}>
                          Mark Resolved
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> System Broadcast Alerts
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {notifs.map(n => (
              <div key={n.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                  <p className="text-slate-500">{n.message}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
