"use client";

import { motion } from "framer-motion";
import React from "react";

interface AutoSmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function AutoSmoothScroll({
  children,
  className = "",
}: AutoSmoothScrollProps) {
  // Mengubah semua elemen children menjadi array agar sistem bisa menghitung urutannya
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} // Animasi terpicu saat elemen terlihat
          transition={{
            duration: 0.7,
            ease: [0.25, 0.25, 0, 1], // Kurva animasi mulus ala Apple
            delay: index * 0.12, // MAGIC: Delay otomatis bertambah berdasarkan urutan elemen!
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
