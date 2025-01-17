import React, { Component } from 'react';
import client from '../client'; // Pastikan client axios sudah dikonfigurasi

class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCourse: '',
      CoursesData: [],
      error: '',
      success: '',
    };
  }

  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses = async () => {
    try {
      const response = await client.get('api/user/courses');
      this.setState({ CoursesData: response.data });
    } catch (err) {
      console.error('Error fetching courses:', err);
      this.setState({ error: 'Failed to load courses.' });
    }
  };

  handleConfirm = async () => {
    const { mentorId, onClose } = this.props;
    const { selectedCourse } = this.state;

    if (!mentorId) {
      alert('Mentor ID is missing or invalid.');
      return;
    }

    if (!selectedCourse) {
      alert('Please select a course.');
      return;
    }

    try {
      const response = await client.put(`/api/admin/updateMentorCourse/${mentorId}`, {
        courseId: selectedCourse,
      });

      if (response.status === 200) {
        onClose();
        alert('Course updated successfully!');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Failed to update course.');
    }
  };

  render() {
    const { onClose } = this.props;
    const { selectedCourse, CoursesData, error } = this.state;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Add to Class</h2>
          <p>Are you sure you want to add this mentor to the class?</p>
          
          {/* Select Course Dropdown */}
          <div className="mb-4">
            <label className="block text-lg font-medium">Select Course</label>
            <select
              className="w-full border p-2 mt-2"
              value={selectedCourse}
              onChange={(e) => this.setState({ selectedCourse: e.target.value })}
            >
              <option value="">Select a course</option>
              {/* Hanya map jika CoursesData adalah array */}
              {Array.isArray(CoursesData) && CoursesData.length > 0 ? (
                CoursesData.map(course => (
                  <option key={course._id} value={course._id}>{course.namaCourse}</option>
                ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>
          </div>

          {/* Error handling */}
          {error && <div className="text-red-500">{error}</div>}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={this.handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PopUp;
