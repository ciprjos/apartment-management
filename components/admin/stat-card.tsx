import { Card, CardContent } from "../ui/card";

type StatisticCardProps = {
  title: string;
  value: string | number;
};

export function StatisticCard({ title, value }: StatisticCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );
}
