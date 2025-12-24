import KlaviyoProvider from "@/providers/klaviyo-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KlaviyoProvider/>
        {children}
      </body>
    </html>
  );
}
