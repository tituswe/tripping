import { Trip } from "@prisma/client";
import { CirclePlus, LayoutGrid, LucideIcon, MapPin } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, trips: Trip[]): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Trips",
      menus: [
        ...trips.map((e) => ({
          href: `/trips/${e.title}`,
          label: e.title,
          active: pathname.includes(`/${e.title}`),
          icon: MapPin,
          submenus: []
        })),
        {
          href: "/trips/new",
          label: "New Trip",
          active: pathname === "/trips/new",
          icon: CirclePlus,
          submenus: []
        }
      ]
    }
  ];
}

// TODO: Implement other features

// {
//   groupLabel: "Contents",
//   menus: [
//     {
//       href: "",
//       label: "Posts",
//       active: pathname.includes("/posts"),
//       icon: SquarePen,
//       submenus: [
//         {
//           href: "/posts",
//           label: "All Posts",
//           active: pathname === "/posts"
//         },
//         {
//           href: "/posts/new",
//           label: "New Post",
//           active: pathname === "/posts/new"
//         }
//       ]
//     },
//     {
//       href: "/categories",
//       label: "Categories",
//       active: pathname.includes("/categories"),
//       icon: Bookmark,
//       submenus: []
//     },
//     {
//       href: "/tags",
//       label: "Tags",
//       active: pathname.includes("/tags"),
//       icon: Tag,
//       submenus: []
//     }
//   ]
// },
// {
//   groupLabel: "Settings",
//   menus: [
//     {
//       href: "/users",
//       label: "Users",
//       active: pathname.includes("/users"),
//       icon: Users,
//       submenus: []
//     },
//     {
//       href: "/account",
//       label: "Account",
//       active: pathname.includes("/account"),
//       icon: Settings,
//       submenus: []
//     }
//   ]
// }
