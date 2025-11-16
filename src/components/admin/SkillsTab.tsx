import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface SkillsTabProps {
  data: any;
  onDataUpdate: () => void;
}

const SkillsTab = ({ data: _data, onDataUpdate: _onDataUpdate }: SkillsTabProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchSkills = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('admin_token');
      const userId = 1;
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/skills/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Skills API response:', data);
        
        // Handle paginated response structure
        if (data.results && Array.isArray(data.results)) {
          // Transform the data structure to match our UI expectations
          const transformedSkills = data.results.flatMap((skillGroup: any) => 
            skillGroup.skills_list.map((skillName: string) => ({
              id: `${skillGroup.id}-${skillName}`,
              name: skillName,
              category: skillGroup.category?.name || '',
              category_id: skillGroup.category?.id || null,
              proficiency_level: 85, // Default value, you can adjust
              skill_group_id: skillGroup.id
            }))
          );
          setSkills(transformedSkills);
        } else if (Array.isArray(data)) {
          setSkills(data);
        } else {
          setSkills([]);
        }
      } else {
        console.error('Error fetching skills:', response.statusText);
        setSkills([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = () => {
    setIsEditing('new');
    setFormData({});
  };

  const handleEdit = (skill: any) => {
    setIsEditing(`edit-${skill.id}`);
    setFormData({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      category_id: skill.category_id, // Include category_id for API updates
      proficiency_level: skill.proficiency_level,
      skill_group_id: skill.skill_group_id // Include skill_group_id for updates
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userId = 1;
      const isEditing = formData.id;
      
      // Validate that skill_group_id exists when editing
      if (isEditing && !formData.skill_group_id) {
        console.error('Error: skill_group_id is missing for update');
        alert('Error: Unable to update skill. Please try again.');
        setLoading(false);
        return;
      }
      
      // For the current API structure, we need to handle skill groups
      // This is a simplified approach - you might need to adjust based on your backend
      const endpoint = isEditing 
        ? `/api/users/${userId}/skills/${formData.skill_group_id}/`
        : `/api/users/${userId}/skills/`;
      
      const method = isEditing ? 'PUT' : 'POST';

      // Transform form data to match API expectations
      // The API expects category_id and skills_list (comma-separated string)
      const submitData: any = {
        skills_list: formData.name // Single skill name as string (backend stores as comma-separated)
      };
      
      // For both create and update, we need category_id
      // If category_id is not available, we might need to find it by name or create it
      // For now, use category_id if available, otherwise use category (assuming it's an ID)
      if (formData.category_id) {
        submitData.category_id = formData.category_id;
      } else if (formData.category && !isNaN(Number(formData.category))) {
        // If category is a number, treat it as category_id
        submitData.category_id = Number(formData.category);
      } else {
        // If category is a name, we'd need to look it up or create it
        // For now, show an error
        alert('Error: Category ID is required. Please select a valid category.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        await fetchSkills();
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

  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    setLoading(true);
    try {
      const userId = 1;
      // Extract skill group ID from the composite ID
      const skillGroupId = skillId.split('-')[0];
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/skills/${skillGroupId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        await fetchSkills();
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
        <div>
          <h3 className="text-xl font-bold">Skills</h3>
          <p className="text-sm text-gray-500 mt-1">Skills are organized by categories</p>
        </div>
        <Button onClick={handleAdd} disabled={isEditing !== null}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Group
        </Button>
      </div>

      {isEditing && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Frontend Development"
                className="text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., React"
                className="text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Proficiency Level (1-100)</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.proficiency_level || 85}
                onChange={(e) => setFormData({...formData, proficiency_level: parseInt(e.target.value)})}
                className="text-gray-900 bg-white"
              />
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

      {fetching ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading skills...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {skills.length > 0 ? (
            skills.map((skill: any) => (
            <Card key={skill.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{skill.name}</h4>
                  <p className="text-sm text-gray-600">{skill.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${skill.proficiency_level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{skill.proficiency_level}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(skill)}
                    disabled={isEditing !== null}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(skill.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
                      ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No skills found. Add your first skill!</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsTab; 