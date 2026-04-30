// Shared shell for platform routes. The root layout suppresses the
// marketing Navbar / Footer / floating CTAs for any request the
// middleware tagged as a platform route, so /admin and /owner render
// with just their own internal header and this neutral wash.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] bg-stone-50 text-stone-900">{children}</div>
  );
}
