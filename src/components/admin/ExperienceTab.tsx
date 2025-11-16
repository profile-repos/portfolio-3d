import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface ExperienceTabProps {
  data: any;
  onDataUpdate: () => void;
}

const ExperienceTab = ({ data, onDataUpdate }: ExperienceTabProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setIsEditing('new');
    setFormData({});
  };

  const handleEdit = (exp: any) => {
    setIsEditing(`edit-${exp.id}`);
    setFormData({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      description: exp.description,
      start_date: exp.start_date,
      end_date: exp.end_date
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userId = 1;
      const isEditing = formData.id;
      const endpoint = isEditing 
        ? `/api/users/${userId}/work-experience/${formData.id}/`
        : `/api/users/${userId}/work-experience/`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await onDataUpdate();
        setIsEditing(null);
        setFormData({});
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expId: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    setLoading(true);
    try {
      const userId = 1;
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/work-experience/${expId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        await onDataUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Work Experience</h3>
        <Button onClick={handleAdd} disabled={isEditing !== null}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {isEditing && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <Input
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="text-gray-900 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="text-gray-900 bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {data.work_experience?.map((exp: any) => (
          <Card key={exp.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{exp.title}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </p>
                <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(exp)}
                  disabled={isEditing !== null}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(exp.id)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab; 