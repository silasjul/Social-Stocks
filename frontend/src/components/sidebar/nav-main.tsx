"use client";

import { LucideProps, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface NavItems {
    items: {
        title: string;
        url: string;
        icon?: ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
        >;
        isActive?: boolean;
    }[];
}

export function NavMain({ items }: NavItems) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <a href={item.url}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className="cursor-pointer"
                                        isActive={item.isActive}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </a>
                            </CollapsibleTrigger>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
