"use client";

import {
  Calendar,
  ChevronRight,
  MapIcon,
  Notebook,
  Search,
  User,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import LogoSmall from "../LogoSmall";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { api } from "@/trpc/react";

const items = [
  {
    title: "Znajdź inicjatywę",
    url: "/find-event",
    icon: Search,
  },
  {
    title: "Moje inicjatywy",
    url: "/dashboard",
    icon: Notebook,
  },
  {
    title: "Mapa inicjatyw",
    url: "#",
    icon: MapIcon,
  },
  {
    title: "Kalendarz",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Czat",
    url: "/chat",
    icon: MessageSquare,
  },
];

export default function AppSidebar() {
  const { data: userProfile, isLoading } = api.profile.getCurrent.useQuery();

  const { state } = useSidebar();

  const getInitials = () => {
    if (!userProfile) return "U";

    if (userProfile.profileData) {
      if (
        userProfile.role === "wolontariusz" ||
        userProfile.role === "koordynator"
      ) {
        const profileData = userProfile.profileData as {
          firstName?: string;
          lastName?: string;
        };
        if (profileData.firstName && profileData.lastName) {
          return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
        }
      } else if (userProfile.role === "organizator") {
        const profileData = userProfile.profileData as { companyName?: string };
        if (profileData.companyName) {
          return profileData.companyName.slice(0, 2).toUpperCase();
        }
      }
    }

    if (userProfile.name) {
      const nameParts = userProfile.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0]![0]}${nameParts[1]![0]}`.toUpperCase();
      }
      return userProfile.name.slice(0, 2).toUpperCase();
    }

    return "U";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className={`${state === "collapsed" ? "p-0" : "p-2"}`}>
          <SidebarMenuItem className="flex p-0">
            <LogoSmall collapsed={state === "collapsed"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                  <span className="ml-auto">
                    <ChevronRight size={16} />
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 py-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                {isLoading ? (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage
                      src={userProfile?.image ?? undefined}
                      alt={userProfile?.name ?? "Avatar użytkownika"}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden text-left">
                <div className="truncate text-sm font-medium">
                  {userProfile?.name}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  {userProfile?.email}
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
