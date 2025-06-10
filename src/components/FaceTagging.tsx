"use client";

import { useState, useEffect } from "react";
import { Users, Eye, Tag, Save, X, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { faceDetectionService, type FaceDetectionResult, type Person } from "@/services/faceDetection";

interface FaceTaggingProps {
  imageUrl: string;
  imageId: string;
  onTaggingComplete: (result: FaceDetectionResult) => void;
  className?: string;
}

interface FaceAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  personId?: string;
  personName?: string;
  confidence?: number;
}

export default function FaceTagging({
  imageUrl,
  imageId,
  onTaggingComplete,
  className = ""
}: FaceTaggingProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceAnnotations, setFaceAnnotations] = useState<FaceAnnotation[]>([]);
  const [selectedFace, setSelectedFace] = useState<FaceAnnotation | null>(null);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPersonName, setNewPersonName] = useState("");

  useEffect(() => {
    // Load all persons for tagging
    setAllPersons(faceDetectionService.getAllPersons());
  }, []);

  const detectFaces = async () => {
    setIsDetecting(true);
    try {
      const result = await faceDetectionService.detectAndRecognizeFaces(imageUrl, imageId);

      // Convert detection result to annotations
      const annotations: FaceAnnotation[] = result.faces.map((face, index) => ({
        id: face.id || `face_${index}`,
        x: face.coordinates.x * 100, // Convert to percentage
        y: face.coordinates.y * 100,
        width: face.coordinates.width * 100,
        height: face.coordinates.height * 100,
        personId: face.personId,
        personName: face.personName,
        confidence: face.matchConfidence
      }));

      setFaceAnnotations(annotations);
      onTaggingComplete(result);
    } catch (error) {
      console.error('Face detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleFaceClick = (face: FaceAnnotation) => {
    setSelectedFace(face);
    setShowTagDialog(true);
    setSearchQuery("");
    setNewPersonName("");
  };

  const tagFaceWithPerson = (personId: string, personName: string) => {
    if (!selectedFace) return;

    setFaceAnnotations(prev => prev.map(face =>
      face.id === selectedFace.id
        ? { ...face, personId, personName, confidence: 0.95 }
        : face
    ));

    setShowTagDialog(false);
    setSelectedFace(null);
  };

  const createNewPerson = async () => {
    if (!newPersonName.trim() || !selectedFace) return;

    try {
      const person = await faceDetectionService.addPerson(newPersonName.trim(), 'unknown');

      // Tag the face with the new person
      tagFaceWithPerson(person.id, person.name);

      // Update persons list
      setAllPersons(prev => [...prev, person]);
    } catch (error) {
      console.error('Failed to create person:', error);
    }
  };

  const removeFaceTag = (faceId: string) => {
    setFaceAnnotations(prev => prev.map(face =>
      face.id === faceId
        ? { ...face, personId: undefined, personName: undefined, confidence: undefined }
        : face
    ));
  };

  const filteredPersons = allPersons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Detection Controls */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Face Detection & Tagging</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Detect faces in the image and tag them with person names
          </p>
        </div>
        <Button
          onClick={detectFaces}
          disabled={isDetecting}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isDetecting ? (
            <>
              <Eye className="h-4 w-4 mr-2 animate-pulse" />
              Detecting...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Detect Faces
            </>
          )}
        </Button>
      </div>

      {/* Image with Face Annotations */}
      <Card className="p-4">
        <div className="relative inline-block max-w-full">
          <img
            src={imageUrl}
            alt="Content for face tagging"
            className="max-w-full h-auto rounded-lg"
          />

          {/* Face Bounding Boxes */}
          {faceAnnotations.map((face) => (
            <div
              key={face.id}
              className="absolute border-2 border-blue-500 cursor-pointer hover:border-blue-700 transition-colors"
              style={{
                left: `${face.x}%`,
                top: `${face.y}%`,
                width: `${face.width}%`,
                height: `${face.height}%`
              }}
              onClick={() => handleFaceClick(face)}
            >
              {/* Face Tag */}
              {face.personName && (
                <div className="absolute -top-6 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {face.personName}
                  {face.confidence && (
                    <span className="ml-1 opacity-75">
                      ({Math.round(face.confidence * 100)}%)
                    </span>
                  )}
                </div>
              )}

              {/* Untagged Face Indicator */}
              {!face.personName && (
                <div className="absolute -top-6 left-0 bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                  <Tag className="h-3 w-3 inline mr-1" />
                  Click to tag
                </div>
              )}
            </div>
          ))}
        </div>

        {faceAnnotations.length === 0 && !isDetecting && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No faces detected. Click "Detect Faces" to analyze this image.</p>
          </div>
        )}
      </Card>

      {/* Face Summary */}
      {faceAnnotations.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Detected Faces ({faceAnnotations.length})</h4>
            <div className="text-xs text-muted-foreground">
              {faceAnnotations.filter(f => f.personName).length} tagged • {faceAnnotations.filter(f => !f.personName).length} untagged
            </div>
          </div>

          <div className="space-y-2">
            {faceAnnotations.map((face) => (
              <div key={face.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                    {face.personName ? face.personName.charAt(0) : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {face.personName || 'Untagged Face'}
                    </p>
                    {face.confidence && (
                      <p className="text-xs text-muted-foreground">
                        Confidence: {Math.round(face.confidence * 100)}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFaceClick(face)}
                    className="text-xs"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {face.personName ? 'Retag' : 'Tag'}
                  </Button>
                  {face.personName && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFaceTag(face.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Face Tagging Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tag Face</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Existing Persons */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Search Existing Persons</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Person List */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {filteredPersons.slice(0, 10).map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                  onClick={() => tagFaceWithPerson(person.id, person.name)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded text-sm flex items-center justify-center">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {person.category} • {person.faces.length} faces
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{person.verified ? 'Verified' : 'Unverified'}</Badge>
                </div>
              ))}

              {filteredPersons.length === 0 && searchQuery && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No persons found matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Create New Person */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Create New Person</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter person name..."
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewPerson()}
                />
                <Button
                  onClick={createNewPerson}
                  disabled={!newPersonName.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
