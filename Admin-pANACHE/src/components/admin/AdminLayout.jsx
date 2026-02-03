import Header from "../../pages/admin/Header";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
