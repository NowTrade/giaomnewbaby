"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Profile = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export function UserManagementList({ users }: { users: Profile[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{user.full_name || "No name"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 items-center">
                  <Badge
                    variant={user.role === "admin" ? "destructive" : user.role === "seller" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
