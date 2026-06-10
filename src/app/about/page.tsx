import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "About RyoK73",
    description: "RyoK73についての紹介ページです。",
  };
};
const AboutPage = () => {
  return (
    <div>
      <h1>Aboutページです。</h1>
    </div>
  );
};

export default AboutPage;
