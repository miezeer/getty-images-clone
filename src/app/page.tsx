"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ImageGallery from "@/components/ImageGallery";

interface SearchFilters {
  contentType: string;
  sortBy: string;
  categories: string[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    contentType: "all",
    sortBy: "relevant",
    categories: []
  });

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    console.log("Search:", query, filters);
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <ImageGallery searchQuery={searchQuery} searchFilters={searchFilters} />
    </div>
  );
}
