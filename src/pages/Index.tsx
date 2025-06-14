import React from "react";
import Dashboard from "../components/organisms/Dashboard";

const Index: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Visão geral do seu gerenciamento rural
        </p>
      </div>
      <Dashboard />
    </div>
  );
};

export default Index;
