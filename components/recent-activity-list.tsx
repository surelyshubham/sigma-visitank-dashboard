import { CheckCircle, AlertCircle, Upload } from "lucide-react"

const activities = [
  { id: 1, type: "inspection", title: "Tank 3 Inspection Complete", time: "2 hours ago", icon: CheckCircle },
  { id: 2, type: "alert", title: "High corrosion detected in Tank 12", time: "4 hours ago", icon: AlertCircle },
  { id: 3, type: "upload", title: "Excel data uploaded for Tank 7", time: "1 day ago", icon: Upload },
  { id: 4, type: "inspection", title: "Tank 15 Inspection Started", time: "2 days ago", icon: CheckCircle },
]

export function RecentActivityList() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Recent Activities</h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-center gap-4 pb-3 border-b border-border last:border-b-0">
              <Icon size={20} className="text-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{activity.title}</p>
                <p className="text-muted-foreground text-sm">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
