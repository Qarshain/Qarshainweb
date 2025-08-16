import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StrategicOpportunities from "@/components/StrategicOpportunities";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <StrategicOpportunities />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
