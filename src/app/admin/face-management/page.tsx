"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Plus,
  User,
  UserCheck,
  UserX,
  Merge,
  Download,
  Upload,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  MoreHorizontal,
  Save,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  faceDetectionService,
  type Person,
  type DetectedFace
} from "@/services/faceDetection";

function PersonEditModal({
  person,
  isOpen,
  onClose,
  onSave
}: {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Person) => void;
}) {
  const [editedPerson, setEditedPerson] = useState<Person | null>(person);

  useEffect(() => {
    setEditedPerson(person);
  }, [person]);

  if (!editedPerson) return null;

  const handleSave = async () => {
    await faceDetectionService.updatePerson(editedPerson.id, {
      name: editedPerson.name,
      aliases: editedPerson.aliases,
      category: editedPerson.category,
      verified: editedPerson.verified
    });
    onSave(editedPerson);
    onClose();
  };

  const handleAliasesChange = (aliasesStr: string) => {
    const aliases = aliasesStr.split(',').map(a => a.trim()).filter(a => a.length > 0);
    setEditedPerson({ ...editedPerson, aliases });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>
            Update person information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedPerson.name}
              onChange={(e) => setEditedPerson({ ...editedPerson, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="aliases">Aliases (comma separated)</Label>
            <Input
              id="aliases"
              value={editedPerson.aliases.join(', ')}
              onChange={(e) => handleAliasesChange(e.target.value)}
              placeholder="Alternative names, nicknames..."
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={editedPerson.category}
              onValueChange={(value) => setEditedPerson({ ...editedPerson, category: value as Person['category'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model">Model</SelectItem>
                <SelectItem value="celebrity">Celebrity</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified"
              checked={editedPerson.verified}
              onChange={(e) => setEditedPerson({ ...editedPerson, verified: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="verified" className="text-sm">Verified person</Label>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Total Faces:</span> {editedPerson.faces.length}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(editedPerson.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PersonCard({
  person,
  onEdit,
  onDelete,
  onToggleVerification,
  isSelected,
  onSelect
}: {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
  onToggleVerification: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "model":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "celebrity":
        return "bg-purple-500/20 text-purple-700 border-purple-500/30";
      case "contributor":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "staff":
        return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  return (
    <Card className={`overflow-hidden border transition-all duration-200 ${
      isSelected ? "border-green-accent bg-green-accent/5" : "border-border"
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(person.id, e.target.checked)}
              className="mt-1 rounded border-gray-300"
            />
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
              {person.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground">
                  {person.name}
                </h3>
                {person.verified && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={`text-xs ${getCategoryColor(person.category)}`}>
                  {person.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {person.faces.length} faces
                </span>
              </div>
              {person.aliases.length > 1 && (
                <p className="text-xs text-muted-foreground">
                  Also known as: {person.aliases.slice(1).join(", ")}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(person)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleVerification(person.id)}>
                {person.verified ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Unverify
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(person.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(person.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span>{new Date(person.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          <Button
            size="sm"
            onClick={() => onEdit(person)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Faces
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function FaceManagementPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Load all persons
    setPersons(faceDetectionService.getAllPersons());
  }, []);

  const filteredPersons = persons.filter(person => {
    const matchesCategory = categoryFilter === "all" || person.category === categoryFilter;
    const matchesVerification = verificationFilter === "all" ||
      (verificationFilter === "verified" && person.verified) ||
      (verificationFilter === "unverified" && !person.verified);
    const matchesSearch = !searchQuery ||
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesVerification && matchesSearch;
  });

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setShowEditModal(true);
  };

  const handleSave = (updatedPerson: Person) => {
    setPersons(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  };

  const handleDelete = async (personId: string) => {
    if (confirm("Are you sure you want to delete this person? This will remove all associated face data.")) {
      await faceDetectionService.deletePerson(personId);
      setPersons(prev => prev.filter(p => p.id !== personId));
    }
  };

  const handleToggleVerification = async (personId: string) => {
    const person = persons.find(p => p.id === personId);
    if (!person) return;

    await faceDetectionService.updatePerson(personId, { verified: !person.verified });
    setPersons(prev => prev.map(p => p.id === personId ? { ...p, verified: !p.verified } : p));
  };

  const handleBatchDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedPersons.length} persons? This action cannot be undone.`)) {
      for (const personId of selectedPersons) {
        await faceDetectionService.deletePerson(personId);
      }
      setPersons(prev => prev.filter(p => !selectedPersons.includes(p.id)));
      setSelectedPersons([]);
    }
  };

  const handleBatchVerify = async () => {
    for (const personId of selectedPersons) {
      await faceDetectionService.updatePerson(personId, { verified: true });
    }
    setPersons(prev => prev.map(p => selectedPersons.includes(p.id) ? { ...p, verified: true } : p));
    setSelectedPersons([]);
  };

  const handleSelectPerson = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedPersons(prev => [...prev, id]);
    } else {
      setSelectedPersons(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedPersons.length === filteredPersons.length) {
      setSelectedPersons([]);
    } else {
      setSelectedPersons(filteredPersons.map(p => p.id));
    }
  };

  const stats = faceDetectionService.getStatistics();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "model", label: "Models" },
    { value: "celebrity", label: "Celebrities" },
    { value: "contributor", label: "Contributors" },
    { value: "staff", label: "Staff" },
    { value: "unknown", label: "Unknown" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">{stats.totalPersons}</div>
          <div className="text-sm text-muted-foreground">Total Persons</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.verifiedPersons}</div>
          <div className="text-sm text-muted-foreground">Verified</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.totalFaces}</div>
          <div className="text-sm text-muted-foreground">Total Faces</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.categories.model}</div>
          <div className="text-sm text-muted-foreground">Models</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.categories.celebrity}</div>
          <div className="text-sm text-muted-foreground">Celebrities</div>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Face Database Management</h1>
          <p className="text-muted-foreground">Manage persons and face recognition data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search persons by name or alias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Batch Actions */}
      {selectedPersons.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              {selectedPersons.length} person{selectedPersons.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleBatchVerify}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Verify Selected
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBatchDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedPersons([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPersons.length} of {persons.length} persons
        </p>
        {filteredPersons.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedPersons.length === filteredPersons.length ? "Deselect All" : "Select All"}
          </Button>
        )}
      </div>

      {/* Persons Grid */}
      {filteredPersons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPersons.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleVerification={handleToggleVerification}
              isSelected={selectedPersons.includes(person.id)}
              onSelect={handleSelectPerson}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No persons found</h3>
          <p className="text-muted-foreground">
            {searchQuery || categoryFilter !== "all" || verificationFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "Start by uploading images with faces to build your database."
            }
          </p>
        </Card>
      )}

      {/* Edit Modal */}
      <PersonEditModal
        person={editingPerson}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPerson(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
