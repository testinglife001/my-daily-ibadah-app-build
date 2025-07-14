// src/components/MarqueeBar.jsx
import React from "react";
import Marquee from "react-fast-marquee";

const breakingNews = [
  "Astaghfirullah - 3 times (Bukhari 4-95, Muslim 4-2071).",
  "“Subhanallah” - 33 times, “Alhamdulillah” - 33 times, “Allahu Akbar” - 33 times. “La ilaha illallahu wah dahu la shareeka lahu lahul mulku, wa la hulu hamdu, wa hua ala kulli shayin qadir” - 1 time (Muslim 1228).",
  "Ayatul Kursi (verse 255 of Surah Al-Baqarah) - 1 time (Silsilah Sahih-972). And recite Ayatul Kursi after every fardh prayer.",
  "Allahumma antas-salaam wa minqas-salaam, tabarakta ya jajjalaaliwal-ikram - 1 time (Muslim 1/218, Abu Dawud 1/221, Ibn Majah 928).",
  "Bismillahil-ladhi la ya duru ma amihi shayun fil ardi walafis samayi wa huas samayiul alim - 3 times.",
];

export default function MarqueeBar() {
  return (
    <div className="bg-primary text-white py-2">
      <Marquee pauseOnHover={true} gradient={false} speed={50}>
        {breakingNews.map((news, index) => (
          <span key={index} className="mx-4">
            {news}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
