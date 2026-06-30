"use client";

import { motion } from "framer-motion";
import { Users, Upload, Shield, TrendingUp, Eye, Trash2, Edit, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const adminMetrics = [
  { title: "Total Users", value: "2,847", change: "+124 this month", icon: Users, color: "text-neon-indigo", bg: "bg-neon-indigo/10" },
  { title: "Total Uploads", value: "18,293", change: "+2,340 this month", icon: Upload, color: "text-aurora-emerald", bg: "bg-aurora-emerald/10" },
  { title: "Active Subscriptions", value: "1,204", change: "+89 this month", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "System Health", value: "99.9%", change: "Uptime last 30 days", icon: Shield, color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const mockUsers = [
  { id: "1", email: "sarah@mit.edu", name: "Dr. Sarah Chen", plan: "Professional", uploads: 342, role: "user", joinDate: "2025-03-15" },
  { id: "2", email: "rajesh@arvind.com", name: "Rajesh Patel", plan: "Enterprise", uploads: 1204, role: "user", joinDate: "2024-11-20" },
  { id: "3", email: "emma@parsons.edu", name: "Emma Williams", plan: "Student", uploads: 78, role: "user", joinDate: "2025-08-01" },
  { id: "4", email: "admin@threadcounty.ai", name: "Admin Account", plan: "Enterprise", uploads: 0, role: "admin", joinDate: "2024-01-01" },
  { id: "5", email: "john@textilecorp.com", name: "John Smith", plan: "Free", uploads: 5, role: "user", joinDate: "2026-06-20" },
];

const moderationQueue = [
  { id: "m1", fileName: "suspicious-upload-1.jpg", user: "unknown@temp.com", reason: "Potential non-fabric content", date: "2026-06-28" },
  { id: "m2", fileName: "blurry-scan-test.png", user: "test@test.com", reason: "Low quality / spam", date: "2026-06-27" },
];

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading title="Admin Dashboard" description="System overview, user management, and content moderation." align="left" />

        {/* Admin Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminMetrics.map((metric, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{metric.title}</p>
                    <p className="text-2xl font-bold font-heading mt-1"><GradientText>{metric.value}</GradientText></p>
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
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.plan === "Enterprise" ? "default" : "outline"} className="text-xs">{user.plan}</Badge>
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
              <Badge variant="destructive" className="text-xs">{moderationQueue.length}</Badge>
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
              {moderationQueue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">{item.fileName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.user}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{item.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success("Content approved")}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => toast.success("Content removed")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
