// Shared shell for platform routes. Sits inside the existing root
// layout, so the marketing Navbar and Footer still render around it
// for now. We can move marketing pages into a `(marketing)` route
// group later to drop that chrome on logged-in surfaces.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] bg-stone-50 text-stone-900">{children}</div>
  );
}
