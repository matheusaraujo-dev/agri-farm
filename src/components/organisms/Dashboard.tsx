import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import StatsCard from "../molecules/StatsCard";
import { Building2, MapPin, Sprout } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const Dashboard: React.FC = () => {
  const { dashboardData } = useDashboard();
  console.log("Dashboard Data:", dashboardData);
  const { landUse, totalFarms, totalHectares, farmsByState, cropsGrouped } =
    dashboardData;

  // Dados para o gráfico de uso do solo
  const landUseData = [
    { name: "Área Agricultável", value: landUse.arable, color: "#00C49F" },
    {
      name: "Área de Vegetação",
      value: landUse.vegetation,
      color: "#0088FE",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Fazendas"
          value={totalFarms}
          icon={Building2}
          description="Fazendas cadastradas"
        />
        <StatsCard
          title="Total de Hectares"
          value={`${totalHectares.toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
          })}`}
          icon={MapPin}
          description="Área total registrada"
        />
        <StatsCard
          title="Tipos de Cultura"
          value={cropsGrouped.length}
          icon={Sprout}
          description="Culturas diferentes"
        />
        <StatsCard
          title="Estados"
          value={farmsByState.length}
          icon={MapPin}
          description="Estados com fazendas"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fazendas por Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Fazendas por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            {farmsByState.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={farmsByState}
                    dataKey="count"
                    nameKey="state"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ state, count }) => `${state}: ${count}`}
                  >
                    {farmsByState.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                Nenhuma fazenda cadastrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Culturas Plantadas */}
        <Card>
          <CardHeader>
            <CardTitle>Culturas Plantadas</CardTitle>
          </CardHeader>
          <CardContent>
            {cropsGrouped.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cropsGrouped}
                    dataKey="count"
                    nameKey="cropName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ cropName, count }) => `${cropName}: ${count}`}
                  >
                    {cropsGrouped.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                Nenhuma fazenda cadastrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Uso do Solo */}
        <Card>
          <CardHeader>
            <CardTitle>Uso do Solo (Hectares)</CardTitle>
          </CardHeader>
          <CardContent>
            {landUseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={landUseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) =>
                      `${name}: ${value.toFixed(2)} ha`
                    }
                  >
                    {landUseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} ha`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                Nenhuma área cadastrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo Detalhado */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Detalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Área Agricultável Total:
                </span>
                <span className="font-semibold">
                  {landUse.arable.toFixed(2)} ha
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Área de Vegetação Total:
                </span>
                <span className="font-semibold">
                  {landUse.vegetation.toFixed(2)} ha
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Área Total Registrada:
                </span>
                <span className="font-semibold">
                  {totalHectares.toFixed(2)} ha
                </span>
              </div>
              {totalHectares > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      % Agricultável:
                    </span>
                    <span className="font-semibold">
                      {((landUse.arable / totalHectares) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      % Vegetação:
                    </span>
                    <span className="font-semibold">
                      {((landUse.vegetation / totalHectares) * 100).toFixed(1)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
