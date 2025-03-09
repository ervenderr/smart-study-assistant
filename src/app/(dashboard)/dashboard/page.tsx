import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return null;
  }

  const [documentsCount, coursesCount, studySessionsCount] = await Promise.all([
    db.document.count({ where: { userId: user.id } }),
    db.course.count({ where: { userId: user.id } }),
    db.studySession.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's an overview of your study progress.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total uploaded documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studySessionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total study sessions
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              Your recently uploaded study materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* We'll add the document list component here later */}
            <p className="text-sm text-muted-foreground">No documents yet</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>Your learning activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            {/* We'll add the progress chart component here later */}
            <p className="text-sm text-muted-foreground">
              No study sessions yet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
