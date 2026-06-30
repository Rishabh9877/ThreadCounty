"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Shield,
  Trash2,
  Camera,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/GlassCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSupabase } from "@/providers/SupabaseProvider";
import { toast } from "sonner";
import { getSecurityLogs, logSecurityAction, updateProfileName } from "@/app/actions/profile";

interface SecurityLogEntry {
  id: string;
  action: string;
  ip: string;
  device: string;
  date: string;
}

export default function ProfilePage() {
  const { user, supabase } = useSupabase();
  const [fullName, setFullName] = useState(
    user?.user_metadata?.name || ""
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.user_metadata?.avatar_url || "");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [securityLogData, setSecurityLogData] = useState<SecurityLogEntry[]>([]);

  const loadSecurityLogs = async () => {
    try {
      const logs = await getSecurityLogs();
      setSecurityLogData(logs.map((l: any) => ({ ...l, date: new Date(l.date).toLocaleString() })));
    } catch (err) {
      console.error("Failed to load security logs", err);
    }
  };

  useEffect(() => {
    loadSecurityLogs();
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.name || "");
      setProfileImage(user.user_metadata?.avatar_url || "");
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // For preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      let avatarUrl = user?.user_metadata?.avatar_url;

      if (selectedImageFile) {
        const fileExt = selectedImageFile.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, selectedImageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          name: fullName,
          avatar_url: avatarUrl,
        }
      });
      if (error) throw error;
      
      // Update Prisma Database
      await updateProfileName(fullName);
      
      toast.success("Profile updated successfully!");
      await logSecurityAction("Profile updated");
      loadSecurityLogs();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await logSecurityAction("Password changed");
      loadSecurityLogs();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled for safety during the hackathon demo.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <SectionHeading
          title="Profile Settings"
          description="Manage your account information, security settings, and preferences."
          align="left"
        />

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>
            <Separator className="mb-6" />

            <div className="flex items-start gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {fullName ? fullName.substring(0, 2).toUpperCase() : "TC"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 opacity-60"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-gradient-to-r from-neon-indigo to-primary text-white gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>
            <Separator className="mb-6" />

            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={loading} variant="outline">
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Activity Log
            </h2>
            <Separator className="mb-4" />
            <div className="space-y-3">
              {securityLogData.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No recent security activity found.</p>
              )}
              {securityLogData.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      IP: {log.ip} | Device: {log.device}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.date}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="border-destructive/30">
            <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h2>
            <Separator className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all data. This action is
                  irreversible.
                </p>
              </div>
              <Dialog>
                <DialogTrigger render={
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                } />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your account, all uploaded
                      images, analysis reports, and subscription data. This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                    >
                      Delete My Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
