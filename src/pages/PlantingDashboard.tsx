import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Calendar, MapPin, Users, Save, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { projectService } from '@/services/database/projectService';
import { toast } from 'sonner';

interface PlantingRecord {
  projectId: string;
  projectName: string;
  species: string;
  quantity: number;
  plantingDate: string;
  zones: Array<{
    zoneId: string;
    count: number;
    location: { lat: number; lon: number };
  }>;
}

const PlantingDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [plantingData, setPlantingData] = useState<PlantingRecord>({
    projectId: '',
    projectName: '',
    species: '',
    quantity: 0,
    plantingDate: new Date().toISOString().split('T')[0],
    zones: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // Load projects from Firebase
      const allProjects = await projectService.getAllProjects();
      // Filter projects in 'planning' status (ready for planting)
      setProjects(allProjects.filter(p => p.status === 'planning'));
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(projectId);
      setPlantingData({
        ...plantingData,
        projectId: project.id,
        projectName: project.name,
        species: project.species?.[0]?.name || '',
        quantity: project.species?.[0]?.quantity || 0
      });
    }
  };

  const handleSavePlanting = async () => {
    if (!plantingData.projectId || !plantingData.species || plantingData.quantity === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Save planting record
      const plantingRecord = {
        projectId: plantingData.projectId,
        species: plantingData.species,
        quantity: plantingData.quantity,
        plantingDate: plantingData.plantingDate,
        zones: plantingData.zones.length > 0 ? plantingData.zones : [
          {
            zoneId: 'Z1',
            count: plantingData.quantity,
            location: projects.find(p => p.id === plantingData.projectId)?.location || { lat: 0, lon: 0 }
          }
        ],
        status: 'planted',
        createdAt: new Date().toISOString()
      };

      // Save planting record (this also updates project status to 'monitoring')
      await projectService.savePlantingRecord(plantingData.projectId, plantingRecord);

      toast.success('Planting record saved successfully!');
      
      // Navigate to monitoring
      setTimeout(() => {
        navigate('/monitoring');
      }, 1500);
    } catch (error) {
      console.error('Error saving planting:', error);
      toast.error('Failed to save planting record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planting Dashboard</h1>
            <p className="text-gray-600 mt-1">Record planting activities and track progress</p>
          </div>
          <Button onClick={() => navigate('/planning')} variant="outline">
            Back to Planning
          </Button>
        </div>

        {/* Project Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Select Project
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No planned projects found</p>
              <Button onClick={() => navigate('/planning')}>
                Create New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedProject === project.id
                      ? 'border-green-500 border-2 bg-green-50'
                      : 'hover:border-green-300'
                  }`}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📍 {project.location?.name || 'Location'}</p>
                    <p>🌳 {project.species?.length || 0} species planned</p>
                    <p>📏 {project.area || 0} hectares</p>
                  </div>
                  {selectedProject === project.id && (
                    <div className="mt-2 flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Planting Form */}
        {selectedProject && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              Record Planting
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <Input
                  value={plantingData.projectName}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Species */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species *
                </label>
                <Input
                  value={plantingData.species}
                  onChange={(e) => setPlantingData({ ...plantingData, species: e.target.value })}
                  placeholder="e.g., Teak, Mahogany"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (saplings) *
                </label>
                <Input
                  type="number"
                  value={plantingData.quantity}
                  onChange={(e) => setPlantingData({ ...plantingData, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 5000"
                />
              </div>

              {/* Planting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planting Date *
                </label>
                <Input
                  type="date"
                  value={plantingData.plantingDate}
                  onChange={(e) => setPlantingData({ ...plantingData, plantingDate: e.target.value })}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Planting Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Species</p>
                  <p className="font-semibold">{plantingData.species || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Quantity</p>
                  <p className="font-semibold">{plantingData.quantity || 0} saplings</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold">{plantingData.plantingDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">Ready to Plant</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleSavePlanting}
                disabled={loading || !plantingData.species || plantingData.quantity === 0}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Planting Record'}
              </Button>
              <Button
                onClick={() => setSelectedProject('')}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Select a planned project from above</li>
            <li>Fill in planting details (species, quantity, date)</li>
            <li>Click "Save Planting Record" to record the planting</li>
            <li>System will automatically move project to monitoring phase</li>
            <li>You can then track health and progress in Monitoring Dashboard</li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlantingDashboard;
