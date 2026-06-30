"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlassCard } from "@/components/ui/GlassCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  fileName: string;
  fabricType: string;
  threadDensity: number;
  confidence: number;
  uploadDate: string;
  status: "completed" | "processing" | "failed";
}

const mockHistory: HistoryItem[] = [
  { id: "a1b2c3d4", fileName: "Cotton-Blend-Sample-A.jpg", fabricType: "Cotton", threadDensity: 186, confidence: 97.2, uploadDate: "2026-06-28", status: "completed" },
  { id: "e5f6g7h8", fileName: "Denim-Production-Batch-12.png", fabricType: "Denim", threadDensity: 234, confidence: 95.8, uploadDate: "2026-06-27", status: "completed" },
  { id: "i9j0k1l2", fileName: "Twill-Weave-QC-Check.jpg", fabricType: "Twill", threadDensity: 178, confidence: 98.1, uploadDate: "2026-06-27", status: "completed" },
  { id: "m3n4o5p6", fileName: "Satin-Weave-Premium.png", fabricType: "Satin", threadDensity: 289, confidence: 96.4, uploadDate: "2026-06-26", status: "completed" },
  { id: "q7r8s9t0", fileName: "Linen-Natural-Fiber.jpg", fabricType: "Linen", threadDensity: 142, confidence: 94.7, uploadDate: "2026-06-25", status: "completed" },
  { id: "u1v2w3x4", fileName: "Cotton-Jersey-Knit.jpg", fabricType: "Cotton", threadDensity: 156, confidence: 97.9, uploadDate: "2026-06-24", status: "completed" },
  { id: "y5z6a7b8", fileName: "Silk-Charmeuse-Test.png", fabricType: "Satin", threadDensity: 274, confidence: 93.2, uploadDate: "2026-06-23", status: "completed" },
  { id: "c9d0e1f2", fileName: "Denim-Selvedge-Raw.jpg", fabricType: "Denim", threadDensity: 218, confidence: 96.1, uploadDate: "2026-06-22", status: "completed" },
  { id: "g3h4i5j6", fileName: "Twill-Herringbone.png", fabricType: "Twill", threadDensity: 192, confidence: 98.7, uploadDate: "2026-06-21", status: "completed" },
  { id: "k7l8m9n0", fileName: "Processing-Sample.jpg", fabricType: "Cotton", threadDensity: 0, confidence: 0, uploadDate: "2026-06-28", status: "processing" },
];

const ITEMS_PER_PAGE = 5;

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof HistoryItem>("uploadDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHistory = useMemo(() => {
    let filtered = mockHistory.filter(
      (item) =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fabricType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return filtered;
  }, [searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (field: keyof HistoryItem) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleDelete = (id: string) => {
    toast.success(`Record ${id} deleted successfully`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeading
          title="Analysis History"
          description="View, search, and manage all your past fabric analyses."
          align="left"
        />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by filename or fabric type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Badge variant="secondary" className="self-center px-4 py-2">
            {filteredHistory.length} results
          </Badge>
        </div>

        {/* Data Table */}
        <GlassCard className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("fileName")}
                >
                  <span className="flex items-center gap-1">
                    File Name <ArrowUpDown className="w-3 h-3" />
                  </span>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("fabricType")}
                >
                  <span className="flex items-center gap-1">
                    Fabric Type <ArrowUpDown className="w-3 h-3" />
                  </span>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground hidden md:table-cell"
                  onClick={() => toggleSort("threadDensity")}
                >
                  <span className="flex items-center gap-1">
                    Density <ArrowUpDown className="w-3 h-3" />
                  </span>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground hidden md:table-cell"
                  onClick={() => toggleSort("confidence")}
                >
                  <span className="flex items-center gap-1">
                    Confidence <ArrowUpDown className="w-3 h-3" />
                  </span>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground hidden sm:table-cell"
                  onClick={() => toggleSort("uploadDate")}
                >
                  <span className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </span>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHistory.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-sm max-w-48 truncate">
                    {item.fileName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.fabricType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {item.status === "completed"
                      ? `${item.threadDensity}/cm`
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {item.status === "completed"
                      ? `${item.confidence}%`
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {item.uploadDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "completed" && (
                        <>
                          <Link href={`/dashboard/results/${item.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.print()}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredHistory.length)} of{" "}
              {filteredHistory.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
