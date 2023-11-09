import AuthenticatedLayoutComponent from "@/components/Layout/authenticated";
export default function AuthenLayout({ children }) {
  return (
    <AuthenticatedLayoutComponent>{children}</AuthenticatedLayoutComponent>
  );
}
