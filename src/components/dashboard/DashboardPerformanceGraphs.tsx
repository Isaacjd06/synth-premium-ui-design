import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const executionsData = [
  { name: "Mon", value: 240 }, { name: "Tue", value: 320 }, { name: "Wed", value: 280 },
  { name: "Thu", value: 390 }, { name: "Fri", value: 420 }, { name: "Sat", value: 180 }, { name: "Sun", value: 150 },
];

const successFailureData = [
  { name: "Mon", success: 235, failure: 5 }, { name: "Tue", success: 312, failure: 8 },
  { name: "Wed", success: 270, failure: 10 }, { name: "Thu", success: 380, failure: 10 },
  { name: "Fri", success: 410, failure: 10 }, { name: "Sat", success: 175, failure: 5 }, { name: "Sun", success: 147, failure: 3 },
];

const triggerActivityData = [
  { hour: "6am", count: 12 }, { hour: "9am", count: 85 }, { hour: "12pm", count: 120 },
  { hour: "3pm", count: 95 }, { hour: "6pm", count: 60 }, { hour: "9pm", count: 25 }, { hour: "12am", count: 8 },
];

const actionUsageData = [
  { name: "Email", value: 35, color: "hsl(var(--primary))" },
  { name: "Slack", value: 25, color: "hsl(var(--accent))" },
  { name: "Database", value: 20, color: "#22c55e" },
  { name: "HTTP", value: 12, color: "#f59e0b" },
  { name: "Other", value: 8, color: "#6366f1" },
];

const durationData = [
  { name: "Mon", duration: 2.1 }, { name: "Tue", duration: 2.4 }, { name: "Wed", duration: 2.2 },
  { name: "Thu", duration: 2.8 }, { name: "Fri", duration: 2.3 }, { name: "Sat", duration: 1.9 }, { name: "Sun", duration: 1.8 },
];

const DashboardPerformanceGraphs = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-card border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Executions Over Time</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={executionsData}>
            <defs>
              <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorExec)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Success vs Failure</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={successFailureData}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="success" stackId="a" fill="#22c55e" radius={[2, 2, 0, 0]} />
            <Bar dataKey="failure" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Trigger Activity by Hour</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={triggerActivityData}>
            <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Action Usage</h3>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={actionUsageData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" label={({ name }) => name}>
              {actionUsageData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border/50 p-4 md:col-span-2">
        <h3 className="text-sm font-medium text-foreground mb-3">Execution Duration Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={durationData}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} unit="s" />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Line type="monotone" dataKey="duration" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: 'hsl(var(--accent))' }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardPerformanceGraphs;
