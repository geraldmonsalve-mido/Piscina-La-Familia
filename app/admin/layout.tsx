import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "Admin — Piscina La Familia",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#eef9ff]">
      <AdminSidebar />
      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}
