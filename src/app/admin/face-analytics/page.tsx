"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Zap,
  Eye,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Scan
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  faceDetectionService,
  type RecognitionMetrics,
  type TrainingInsights,
  type Person
} from "@/services/faceDetection";
type ServiceDetectionHistoryItem = {
  imageId: string;
  timestamp: string;
  faces: number;
  processingTime: number;
  accuracy: number;
};
export default function FaceAnalyticsPage() {
  const [metrics, setMetrics] = useState<RecognitionMetrics | null>(null);
  const [insights, setInsights] = useState<TrainingInsights | null>(null);
  const [topPersons, setTopPersons] = useState<Person[]>([]);
  const [detectionHistory, setDetectionHistory] = useState<ServiceDetectionHistoryItem[]>([]);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Load analytics data
    setMetrics(faceDetectionService.getRecognitionMetrics());
    setInsights(faceDetectionService.getTrainingInsights());
    setTopPersons(faceDetectionService.getAllPersons().slice(0, 10));
    setDetectionHistory(faceDetectionService.getDetectionHistory().slice(-50));
  }, []);

  if (!metrics || !insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Scan className="h-6 w-6 animate-pulse text-blue-600" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  const accuracyColor = metrics.accuracyRate >= 0.9 ? "text-green-600" :
                       metrics.accuracyRate >= 0.8 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Face Detection Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into face recognition performance and training data
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Detections</p>
              <p className="text-3xl font-bold text-foreground">{metrics.totalDetections.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Scan className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-muted-foreground ml-1">vs last period</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recognition Rate</p>
              <p className={`text-3xl font-bold ${accuracyColor}`}>
                {Math.round(metrics.accuracyRate * 100)}%
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={metrics.accuracyRate * 100} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Calls Today</p>
              <p className="text-3xl font-bold text-foreground">{metrics.apiCallsToday.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-muted-foreground">Avg {metrics.processingTimeAvg}ms</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Database Size</p>
              <p className="text-3xl font-bold text-foreground">{insights.totalTrainingImages.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Users className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-muted-foreground">{faceDetectionService.getAllPersons().length} persons</span>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recognition Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recognition Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Successful Recognitions</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{metrics.successfulRecognitions}</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <Progress value={(metrics.successfulRecognitions / metrics.totalDetections) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">False Positives</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-red-600">{metrics.falsePositives}</span>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">False Negatives</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-yellow-600">{metrics.falseNegatives}</span>
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Recognized Persons */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Most Recognized Persons</h3>
              <div className="space-y-3">
                {metrics.topRecognizedPersons.map((person, index) => (
                  <div key={person.personId} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.recognitionCount} recognitions
                      </p>
                    </div>
                    <Badge variant="outline">
                      {person.recognitionCount}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quality Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Training Data Quality Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{insights.qualityDistribution.high}</div>
                <div className="text-sm text-muted-foreground">High Quality</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((insights.qualityDistribution.high / insights.totalTrainingImages) * 100)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{insights.qualityDistribution.medium}</div>
                <div className="text-sm text-muted-foreground">Medium Quality</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((insights.qualityDistribution.medium / insights.totalTrainingImages) * 100)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{insights.qualityDistribution.low}</div>
                <div className="text-sm text-muted-foreground">Low Quality</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((insights.qualityDistribution.low / insights.totalTrainingImages) * 100)}%
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">API Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Processing Time</span>
                  <span className="font-medium">{metrics.processingTimeAvg}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Confidence</span>
                  <span className="font-medium">{Math.round(metrics.averageConfidence * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Monthly API Calls</span>
                  <span className="font-medium">{metrics.apiCallsThisMonth.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Detection Activity</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {detectionHistory.slice(-10).reverse().map((detection, index) => (
                  <div key={detection.imageId} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">Image {detection.imageId.slice(-8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {detection.faces} faces • {detection.processingTime}ms
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(detection.accuracy * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Training Data Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Training Images</span>
                  <span className="font-medium">{insights.totalTrainingImages.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average per Person</span>
                  <span className="font-medium">{Math.round(insights.averageImagesPerPerson)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="font-medium">{Object.keys(insights.categoryDistribution).length}</span>
                </div>
              </div>
            </Card>

            {/* Category Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Person Categories</h3>
              <div className="space-y-3">
                {Object.entries(insights.categoryDistribution).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{count}</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / Math.max(...Object.values(insights.categoryDistribution))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Training Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Training Activity</h3>
            <div className="space-y-3">
              {insights.recentTrainingActivity.slice(-7).map((activity, index) => (
                <div key={activity.date} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{new Date(activity.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.imagesAdded} images • {activity.personsAdded} new persons
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      activity.accuracyImprovement > 0 ? 'text-green-600' :
                      activity.accuracyImprovement < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {activity.accuracyImprovement > 0 ? '+' : ''}
                      {Math.round(activity.accuracyImprovement * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI-Powered Recommendations
            </h3>
            <div className="space-y-4">
              {insights.recommendedActions.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">{recommendation}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Detection Accuracy</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.accuracyRate * 100} className="w-16 h-2" />
                    <span className={`font-medium ${accuracyColor}`}>
                      {Math.round(metrics.accuracyRate * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Quality</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(insights.qualityDistribution.high / insights.totalTrainingImages) * 100} className="w-16 h-2" />
                    <span className="font-medium text-green-600">
                      {Math.round((insights.qualityDistribution.high / insights.totalTrainingImages) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Performance</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={Math.max(0, 100 - (metrics.processingTimeAvg / 50))} className="w-16 h-2" />
                    <span className="font-medium text-blue-600">Good</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Set up automated retraining</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Optimize processing pipeline</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Expand training dataset</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Implement quality scoring</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
