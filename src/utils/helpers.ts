// Helper function to parse skills_list (can be string or array)
export const parseSkillsList = (skillsList: string[]): string[] => {
  if (skillsList.length === 0) return [];
  if (skillsList.length === 1 && skillsList[0].includes(',')) {
    return skillsList[0].split(',').map(s => s.trim()).filter(s => s);
  }
  return skillsList;
};

// Get initials from name
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// Format date for blog posts
export const formatBlogDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

