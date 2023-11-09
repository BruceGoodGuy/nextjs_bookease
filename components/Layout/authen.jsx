"use client";
import Header from "@/components/Header/authen";
import Content from "@/components/Content";
import Footer from "@/components/Footer";
export default function AuthenLayoutComponent({ children }) {
  return (
    <>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </>
  );
}
