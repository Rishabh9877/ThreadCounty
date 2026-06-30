"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Upload, Shield, TrendingUp, Eye, Trash2, Edit, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAdminMetrics, getAdminUsers, getModerationQueue, deleteUpload } from "@/app/actions/admin";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [m, u, q] = await Promise.all([
        getAdminMetrics(),
        getAdminUsers(),
        getModerationQueue()
      ]);
      setMetrics(m);
      setUsers(u);
      setQueue(q);
    } catch (error: any) {
      toast.error(error.message || "Failed to load admin data. You might not have permission.");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUpload = async (id: string) => {
    try {
      await deleteUpload(id);
      toast.success("Content removed");
      loadData(); // Refresh
    } catch (e) {
      toast.error("Failed to remove content");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const adminMetricsData = [
    { title: "Total Users", value: metrics?.totalUsers || "0", change: "Registered users", icon: Users, color: "text-neon-indigo", bg: "bg-neon-indigo/10" },
    { title: "Total Uploads", value: metrics?.totalUploads || "0", change: "Total images", icon: Upload, color: "text-aurora-emerald", bg: "bg-aurora-emerald/10" },
    { title: "Active Subscriptions", value: metrics?.activeSubscriptions || "0", change: "Paid users", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "System Health", value: metrics?.systemHealth || "100%", change: "Uptime last 30 days", icon: Shield, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading title="Admin Dashboard" description="System overview, user management, and content moderation." align="left" />

        {/* Admin Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminMetricsData.map((metric, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{metric.title}</p>
                    <p className="text-2xl font-bold font-heading mt-1"><GradientText>{metric.value.toString()}</GradientText></p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* System Analytics (placeholder chart) */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> System Analytics
            </h2>
            <Select defaultValue="30d">
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-48 flex items-center justify-center rounded-lg bg-muted/30">
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="w-6 rounded-t-md bg-gradient-to-t from-neon-indigo/60 to-neon-indigo"
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* User Management */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
              <Users className="w-5 h-5" /> User Management
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="hidden md:table-cell">Uploads</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.plan === "enterprise" ? "default" : "outline"} className="text-xs capitalize">{user.plan}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{user.uploads}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="text-xs capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Viewing ${user.name}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Editing ${user.name}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>

        {/* Moderation Queue */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
              <Shield className="w-5 h-5" /> Moderation Queue
              <Badge variant="destructive" className="text-xs">{queue.length}</Badge>
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">{item.fileName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.user}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{item.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success("Content approved")}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteUpload(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {queue.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No items in moderation queue
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
