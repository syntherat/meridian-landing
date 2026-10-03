import { Anatomy } from "@/components/sections/Anatomy";
import { Cta } from "@/components/sections/Cta";
import { Features } from "@/components/sections/Features";
import { Global } from "@/components/sections/Global";
import { Hero } from "@/components/sections/Hero";
import { MoneyFlow } from "@/components/sections/MoneyFlow";
import { Numbers } from "@/components/sections/Numbers";
import { Proof } from "@/components/sections/Proof";
import { Nav } from "@/components/ui/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Anatomy />
        <MoneyFlow />
        <Features />
        <Numbers />
        <Global />
        <Proof />
        <Cta />
      </main>
    </>
  );
}
