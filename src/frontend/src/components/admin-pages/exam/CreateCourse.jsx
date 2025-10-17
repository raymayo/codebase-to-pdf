import React, { useState } from 'react'
import axios from 'axios'
import toast from "react-hot-toast";

const CreateCourse = () => {

  const [course, setCourse] = useState({
    name: '',
    description: '',
    passingScore: '',
    durationYears: '',
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCourse(prev => ({
      ...prev, [name]: type === 'number' ? (value === "" ? "" : Number(value)) : value.toUpperCase()
    }))
    console.log(course);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/course",
        course,
      );
      console.log(response.data);
      toast.success("Course created successfully");

      // Reset the form
      setCourse({
        name: '',
        description: '',
        passingScore: 0,
        department: '',
        durationYears: 4,
      });

    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error creating course");
    }
  };


  return (
    <div className='w-full h-full grid place-items-center'>
      <form onSubmit={handleSubmit} className='border border-zinc-200 shadow p-8 rounded max-w-2xl w-full'>
        <h1 className='mb-4 text-center text-xl font-semibold'>Create Course</h1>
        <div className='space-y-5'>

          <label className='flex flex-col text-sm text-zinc-600'>
            Course Name
            <input onChange={handleChange} value={course.name} name='name' className='border rounded border-zinc-200 shadow-2xs mt-1 text-base p-1.5' type="text" />
          </label>
          <label className='flex flex-col text-sm text-zinc-600'>
            Course Description
            <input onChange={handleChange} value={course.description} name='description' className='border rounded border-zinc-200 shadow-2xs mt-1 text-base p-1.5' type="text" />
          </label>
          <label className='flex flex-col text-sm text-zinc-600'>
            Passing Score
            <input onChange={handleChange} name='passingScore' className='border rounded border-zinc-200 shadow-2xs mt-1 text-base p-1.5 appearance-none' type="number" max={100} />
          </label>
          <label className='flex flex-col text-sm text-zinc-600'>
            Department
            <select className='border rounded border-zinc-200 shadow-2xs mt-1 text-base p-1.5' onChange={handleChange} name="department">
              <option value="" selected disabled>Department</option>
              <option value='Computer Studies'>Computer Studies</option>
              <option value='Business Education'>Business Education</option>
              <option value='Hospitality Management'>Hospitality Management</option>
              <option value='Teacher Education'>Teacher Education</option>
            </select>
          </label>
          <label className='flex flex-col text-sm text-zinc-600'>
            Course Duration
            <select className='border rounded border-zinc-200 shadow-2xs mt-1 text-base p-1.5' onChange={handleChange} name="durationYears">
              <option value="" selected disabled>Course Duration</option>
              <option value='2'>2 Year Course</option>
              <option value='4'>4 Year Course</option>
            </select>
          </label>
          <button type='submit' className='w-full bg-zinc-900 text-white p-2 rounded mt-8 cursor-pointer'>Create Course</button>
        </div>
      </form>
    </div>
  )
}

export default CreateCourse