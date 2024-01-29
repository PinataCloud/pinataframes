import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [rawHtml, setRawHtml] = useState("");

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    const res = await fetch("/api/tc");
    const text = await res.text(); 
  }

  return (
    <div>
      <div
      dangerouslySetInnerHTML={{__html: rawHtml}}
    />
    </div>
  );
}
