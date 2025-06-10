"use client";

import { useState, useEffect } from "react";
import { Search, Users, X, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { faceDetectionService, type Person } from "@/services/faceDetection";

interface FaceSearchFilterProps {
  onPersonSelect: (persons: Person[]) => void;
  selectedPersons: Person[];
  className?: string;
}

export default function FaceSearchFilter({
  onPersonSelect,
  selectedPersons,
  className = ""
}: FaceSearchFilterProps) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load all verified persons for search
    const allPersons = faceDetectionService.getAllPersons()
      .filter(person => person.verified && person.faces.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
    setPersons(allPersons);
  }, []);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePersonSelect = (person: Person) => {
    if (selectedPersons.find(p => p.id === person.id)) {
      // Remove if already selected
      onPersonSelect(selectedPersons.filter(p => p.id !== person.id));
    } else {
      // Add to selection
      onPersonSelect([...selectedPersons, person]);
    }
  };

  const handleRemovePerson = (personId: string) => {
    onPersonSelect(selectedPersons.filter(p => p.id !== personId));
  };

  const clearAllSelections = () => {
    onPersonSelect([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Face Search Input */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {selectedPersons.length > 0
                  ? `${selectedPersons.length} person${selectedPersons.length > 1 ? 's' : ''} selected`
                  : "Search by person..."
                }
              </span>
            </div>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search persons..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No persons found.</CommandEmpty>
              <CommandGroup>
                {filteredPersons.slice(0, 10).map((person) => {
                  const isSelected = selectedPersons.find(p => p.id === person.id);

                  return (
                    <CommandItem
                      key={person.id}
                      onSelect={() => handlePersonSelect(person)}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{person.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {person.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {person.faces.length} faces
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Persons Display */}
      {selectedPersons.length > 0 && (
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Selected Persons ({selectedPersons.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllSelections}
              className="text-xs h-6 px-2"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPersons.map((person) => (
              <Badge
                key={person.id}
                variant="secondary"
                className="flex items-center space-x-1 pr-1"
              >
                <span>{person.name}</span>
                <button
                  onClick={() => handleRemovePerson(person.id)}
                  className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Search results will show images containing these persons
          </div>
        </Card>
      )}

      {/* Face Recognition Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{persons.length} verified persons available</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-3 w-3" />
          <span>Face recognition active</span>
        </div>
      </div>
    </div>
  );
}
