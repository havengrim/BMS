import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useUsers } from "@/stores/useUsers"
import { useCertificates } from "@/stores/useCertificates"
import { useComplaints } from "@/stores/useComplaints"
import { useAnnouncements } from "@/stores/useAnnouncements" 
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const { data: users, error: usersError, isLoading: usersLoading } = useUsers()
  const { data: certificates, error: certError, isLoading: certLoading } = useCertificates()
  const { data: complaints, error: compError, isLoading: compLoading } = useComplaints()
  const { data: announcements, error: annError, isLoading: annLoading } = useAnnouncements()

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Total Personnel Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Personnel</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usersLoading ? (
              <div className="h-8 w-20 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            ) : usersError ? (
              "Error"
            ) : (
              users?.length ?? 0
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Personnel added in the last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* Total Certificates Request Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Certificates Request</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {certLoading ? (
              <div className="h-8 w-20 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            ) : certError ? (
              "Error"
            ) : (
              certificates?.length ?? 0
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Certificates requested recently
          </div>
        </CardFooter>
      </Card>

      {/* Total Complaints Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Complaints</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {compLoading ? (
              <div className="h-8 w-20 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            ) : compError ? (
              "Error"
            ) : (
              complaints?.length ?? 0
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Slight decrease this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Complaints received recently
          </div>
        </CardFooter>
      </Card>

      {/* Total Announcements Card (was Growth Rate) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Announcements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {annLoading ? (
              <div className="h-8 w-20 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            ) : annError ? (
              "Error"
            ) : (
              announcements?.length ?? 0
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Recent announcements <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Announcements published recently</div>
        </CardFooter>
      </Card>
    </div>
  )
}
