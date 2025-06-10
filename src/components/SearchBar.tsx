"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FaceSearchFilter from "./FaceSearchFilter";
import type { Person } from "@/services/faceDetection";

interface SearchFilters {
  contentType: string;
  sortBy: string;
  categories: string[];
  persons: Person[];
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");

  const filterOptions = [
    "People",
    "Architecture",
    "Business",
    "Nature",
    "Travel",
    "Technology",
    "Food",
    "Fashion",
    "Sports",
    "Animals"
  ];

  const handleSearch = () => {
    onSearch(searchQuery, {
      contentType,
      sortBy,
      categories: selectedFilters,
      persons: selectedPersons
    });
  };

  const handleFilterToggle = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];

    setSelectedFilters(newFilters);

    // Trigger search automatically when filters change
    onSearch(searchQuery, {
      contentType,
      sortBy,
      categories: newFilters,
      persons: selectedPersons
    });
  };

  const handlePersonSelect = (persons: Person[]) => {
    setSelectedPersons(persons);

    // Trigger search automatically when face filters change
    onSearch(searchQuery, {
      contentType,
      sortBy,
      categories: selectedFilters,
      persons
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery, {
        contentType,
        sortBy,
        categories: selectedFilters,
        persons: selectedPersons
      });
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [contentType, sortBy, searchQuery, selectedFilters, selectedPersons, onSearch]);

  return (
    <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search images, vectors, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 text-base sm:text-lg border-gray-300 focus:border-green-500 bg-white text-gray-900"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="h-12 px-6 sm:px-8 bg-green-600 hover:bg-green-700 text-sm sm:text-base"
          >
            Search
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Content Type Filter */}
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-32 sm:w-40 bg-white text-gray-900 border-gray-300 text-sm">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All content</SelectItem>
              <SelectItem value="images" className="text-gray-900 hover:bg-gray-100">Images</SelectItem>
              <SelectItem value="videos" className="text-gray-900 hover:bg-gray-100">Videos</SelectItem>
              <SelectItem value="illustrations" className="text-gray-900 hover:bg-gray-100">Illustrations</SelectItem>
              <SelectItem value="vectors" className="text-gray-900 hover:bg-gray-100">Vectors</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 sm:w-40 bg-white text-gray-900 border-gray-300 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="relevant" className="text-gray-900 hover:bg-gray-100">Most relevant</SelectItem>
              <SelectItem value="popular" className="text-gray-900 hover:bg-gray-100">Most popular</SelectItem>
              <SelectItem value="newest" className="text-gray-900 hover:bg-gray-100">Newest</SelectItem>
              <SelectItem value="oldest" className="text-gray-900 hover:bg-gray-100">Oldest</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1 sm:gap-2 bg-white text-gray-900 border-gray-300 hover:bg-gray-50 text-sm">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
                <span className="sm:hidden">Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-gray-300">
              {filterOptions.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => handleFilterToggle(filter)}
                  className={`text-gray-900 hover:bg-gray-100 ${selectedFilters.includes(filter) ? "bg-green-50" : ""}`}
                >
                  <div className="flex items-center justify-between w-full">
                    {filter}
                    {selectedFilters.includes(filter) && (
                      <div className="h-2 w-2 bg-green-600 rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleFilterToggle(filter)}
                >
                  {filter} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Face Search Filter */}
        <div className="mt-4 max-w-md">
          <FaceSearchFilter
            selectedPersons={selectedPersons}
            onPersonSelect={handlePersonSelect}
          />
        </div>
      </div>
    </div>
  );
}
