"use client";

import { CommandShortcut } from "@/components/ui/command";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { controlSymbol } from "@/lib/utils";
import { Images, Map, Table } from "lucide-react";
import React from "react";

interface TripItemsProps {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
}

export function TripTabs({ tab, setTab, children }: TripItemsProps) {
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="table">
          <Table className="h-4 w-4 mr-2" />
          <span className="mr-2">Table</span>
          <CommandShortcut>
            <span className="text-xs">{controlSymbol()} </span>
            <span className="text-md">1</span>
          </CommandShortcut>
        </TabsTrigger>
        <TabsTrigger value="gallery">
          <Images className="h-4 w-4 mr-2" />
          <span className="mr-2">Gallery</span>
          <CommandShortcut>
            <span className="text-xs">{controlSymbol()} </span>
            <span className="text-md">2</span>
          </CommandShortcut>
        </TabsTrigger>
        <TabsTrigger value="map">
          <Map className="h-4 w-4 mr-2" />
          <span className="mr-2">Map</span>
          <CommandShortcut>
            <span className="text-xs">{controlSymbol()} </span>
            <span className="text-md">3</span>
          </CommandShortcut>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
