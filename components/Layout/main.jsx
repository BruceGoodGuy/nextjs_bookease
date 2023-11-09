import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Content from "@/components/Content";

export default function MainLayoutComponent({ children }) {
  return (
    <>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </>
  );
}
